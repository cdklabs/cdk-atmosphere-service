import * as fs from 'fs';
import * as path from 'path';
import { Component, Project } from 'projen';

export const ASSERT_HANDLER_FILE = 'assert.lambda.ts';

export class IntegTests {

  public static discover(project: Project) {
    const base = path.join(__dirname, '..', 'test/integ');
    for (const integ of fs.readdirSync(base)) {
      const stats = fs.statSync(path.join(base, integ));
      if (stats.isDirectory()) {
        new IntegTest(project, { directory: integ });
      }
    }

    // lets also make sure we bundle everything before running tests.
    // bundling is pretty fast and we don't run this command often.
    const bundle = project.tasks.tryFind('bundle')!;
    project.tasks.tryFind('integ')!.prependSpawn(bundle);
    project.tasks.tryFind('integ:update')!.prependSpawn(bundle);

    // lets also add an update command with force to definitely
    // run everything and override local snapshots.
    const forceUpdate = project.tasks.addTask('integ:force');
    forceUpdate.spawn(bundle);
    forceUpdate.exec('yarn integ-runner --language typescript --force');

    // sometimes we just want to list integ tests
    const list = project.tasks.addTask('integ:list');
    list.exec('yarn integ-runner --language typescript --list');

  }

  private constructor() {};

}

/**
 * Properties for `IntegHandlerBundle`.
 */
interface IntegHandlerProps {
  /**
   * The directory of the integration test, relative to the 'integ' dir.
   */
  readonly directory: string;
}

/**
 * Creates necessarry provisions for an integration test.
 */
class IntegTest extends Component {
  constructor(project: Project, props: IntegHandlerProps) {
    super(project);

    const assertAll = project.tasks.tryFind('integ:assert') ?? project.addTask('integ:assert');
    const bundleAll = this.project.tasks.tryFind('bundle')!;
    const handlerPath = path.join('test', 'integ', props.directory, ASSERT_HANDLER_FILE);
    if (!fs.existsSync(handlerPath)) {
      throw new Error(`Handler path not found: ${handlerPath}`);
    }

    const bundleTask = this.project.tasks.addTask(`bundle:test/integ/${props.directory}/${ASSERT_HANDLER_FILE}`);
    const command = [
      'esbuild',
      '--bundle',
      handlerPath,
      '--target=\"node18\"',
      '--platform=\"node\"',
      `--outfile=\"assets/test/integ/${props.directory}/index.js\"`,
      '--tsconfig=\"tsconfig.dev.json\"',
      '--external:@aws-sdk/*',
    ];
    bundleTask.exec(command.join(' '));
    bundleAll.spawn(bundleTask);

    const integCommand = `yarn integ-runner --language typescript --directory test/integ/${props.directory}`;
    const integName = `integ:test/${props.directory}`;

    // lets also create test specific tasks
    const integTask = this.project.tasks.addTask(integName, { description: 'Run the test in snapshot mode' });
    integTask.prependSpawn(bundleTask);
    integTask.exec(integCommand);

    // task to force deploy the test
    const integForceTask = this.project.tasks.addTask(`${integName}:force`, {
      description: 'Force update the snapshot by deploying the test',
    });
    integForceTask.prependSpawn(bundleTask);
    integForceTask.exec(`${integCommand} --force`);

    // task to deploy and update the snapshot if needed
    const integUpdateTask = this.project.tasks.addTask(`${integName}:update`, {
      description: 'Deploy and update the snapshot if necessary',
    });
    integUpdateTask.prependSpawn(bundleTask);
    integUpdateTask.exec(`${integCommand} --update-on-failed`);

    // task to deploy the test and keep in running
    const integDeployTask = this.project.tasks.addTask(`${integName}:deploy`, {
      description: 'Deploy and update the snapshot while keeping the service running',
    });
    integDeployTask.prependSpawn(bundleTask);
    integDeployTask.exec(`${integCommand} --no-clean --force`);

    // task to update the snapshot
    const integSnapshotTask = this.project.tasks.addTask(`${integName}:snapshot`, {
      description: 'Update snapshot without deploying (discoureged)',
    });
    integSnapshotTask.prependSpawn(bundleTask);
    integSnapshotTask.exec(`${integCommand} --dry-run --force`);

    // task to run the assertion handler
    const integAssertTask = this.project.tasks.addTask(`${integName}:assert`, {
      description: 'Run the assertion locally against a deployed service',
    });
    integAssertTask.exec(`ts-node ${handlerPath}`);
    assertAll.spawn(integAssertTask);

    if (props.directory == 'dev') {
      // special test that has no assertions. it is just to deploy
      // an environment we can run assertions against.
      const devTask = project.tasks.addTask(`integ:${props.directory}`);
      devTask.spawn(bundleAll);
      devTask.spawn(integDeployTask);
    }

  }
}