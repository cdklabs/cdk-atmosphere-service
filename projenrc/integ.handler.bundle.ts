import * as fs from 'fs';
import * as path from 'path';
import { Component, Project } from 'projen';

export const ASSERT_HANDLER_FILE = 'assert.lambda.ts';

/**
 * Properties for `IntegHandlerBundle`.
 */
export interface IntegHandlerProps {
  /**
   * The directory of the integration test, relative to the 'integ' dir.
   */
  readonly directory: string;
}

/**
 * Creates handler bundles for integration tests.
 */
export class IntegHandlerBundle extends Component {
  constructor(project: Project, props: IntegHandlerProps) {
    super(project);

    const handlerPath = path.join(__dirname, '..', 'test', 'integ', props.directory, ASSERT_HANDLER_FILE);
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
    this.project.tasks.tryFind('bundle')!.spawn(bundleTask);

    const integCommand = `yarn integ-runner --language typescript --directory test/integ/${props.directory}`;

    // lets also create test specific tasks
    const integTask = this.project.tasks.addTask(`integ:test/${props.directory}`);
    integTask.exec(integCommand);

    // task to deploy and update the snapshot if needed
    const integUpdateTask = this.project.tasks.addTask(`integ:test/${props.directory}:update`);
    integUpdateTask.exec(`${integCommand} --update-on-failed`);

    // task to deploy the test and keep in running
    const integDeployTask = this.project.tasks.addTask(`integ:test/${props.directory}:deploy`);
    integDeployTask.exec(`${integCommand} --no-clean --force`);

    // task to run the assertion handler
    const integAssertTask = this.project.tasks.addTask(`integ:test/${props.directory}:assert`);
    integAssertTask.exec(`ts-node ${handlerPath}`);

  }
}
