import * as fs from 'fs';
import * as path from 'path';
import { Component, Project } from 'projen';

export const ASSERT_HANDLER_FILE = 'assert.lambda.ts';

// run the tests in these regions
export const INTEG_RUNNER_REGIONS = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'];

const INTEG_COMMAND = `yarn integ-runner ${INTEG_RUNNER_REGIONS.map(r => `--parallel-regions ${r}`).join(' ')} --language typescript`;

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

    const integTask = project.tasks.tryFind('integ')!;
    const integUpdateTask = project.tasks.tryFind('integ:update')!;

    integTask.reset(INTEG_COMMAND);
    integUpdateTask.reset(`${INTEG_COMMAND} --update-on-failed`);

    integTask.prependSpawn(bundle);
    integUpdateTask.prependSpawn(bundle);

    const integSnapshotTask = project.tasks.addTask('integ:snapshot');
    integSnapshotTask.prependSpawn(bundle);
    integSnapshotTask.exec(`${INTEG_COMMAND} --force --dry-run`);

    // lets also add an update command with force to definitely
    // run everything and override local snapshots.
    const forceUpdate = project.tasks.addTask('integ:force');
    forceUpdate.spawn(bundle);
    forceUpdate.exec(`${INTEG_COMMAND} --force`);

    // sometimes we just want to list integ tests
    const list = project.tasks.addTask('integ:list');
    list.exec(`${INTEG_COMMAND} --list`);

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

    const integCommand = `${INTEG_COMMAND} --directory test/integ/${props.directory}`;
    const integName = `integ:test/${props.directory}`;

    const integTask = this.project.tasks.addTask(integName, {
      description: 'Deploy -> Update Snapshot -> Destroy',
    });
    integTask.prependSpawn(bundleAll);
    integTask.exec(integCommand);

    const integForceTask = this.project.tasks.addTask(`${integName}:force`, {
      description: 'Force Deploy -> Update Snapshot -> Destroy',
    });
    integForceTask.prependSpawn(bundleAll);
    integForceTask.exec(`${integCommand} --force`);

    const integUpdateTask = this.project.tasks.addTask(`${integName}:update`, {
      description: 'Deploy -> Update Snapshot',
    });
    integUpdateTask.prependSpawn(bundleAll);
    integUpdateTask.exec(`${integCommand} --update-on-failed`);

    const integDeployTask = this.project.tasks.addTask(`${integName}:deploy`, {
      description: 'Deploy -> Update Snapshot -> Dont Destroy',
    });
    integDeployTask.prependSpawn(bundleAll);
    integDeployTask.exec(`${integCommand} --update-on-failed --disable-update-workflow --no-clean`);

    const integForceDeployTask = this.project.tasks.addTask(`${integName}:force-deploy`, {
      description: 'Force Deploy -> Update Snapshot -> Dont Destroy',
    });
    integForceDeployTask.prependSpawn(bundleAll);
    integForceDeployTask.exec(`${integCommand} --force --disable-update-workflow --no-clean`);

    const integSnapshotTask = this.project.tasks.addTask(`${integName}:snapshot`, {
      description: 'Dont Deploy -> Update snapshot',
    });
    integSnapshotTask.prependSpawn(bundleAll);
    integSnapshotTask.exec(`${integCommand} --dry-run --force`);

    const integAssertTask = this.project.tasks.addTask(`${integName}:assert`, {
      description: 'Run the assertion locally',
    });
    integAssertTask.exec(`ts-node ${handlerPath}`);
    assertAll.spawn(integAssertTask);

  }
}