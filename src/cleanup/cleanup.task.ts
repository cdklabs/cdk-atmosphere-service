// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CloudFormationClient,
  paginateDescribeStacks,
  Stack,
  DeleteStackCommand,
  DescribeStacksCommand,
  StackStatus,
  CloudFormationServiceException,
} from '@aws-sdk/client-cloudformation';

interface DeleteStackResult {
  readonly status: StackStatus | 'UNKNOWN';
  readonly error?: Error;
}

const TIMEOUT_SECONDS = 60 * 60;

async function waitForStackDeletion(cfn: CloudFormationClient, stackName: string): Promise<DeleteStackResult> {
  while (true) {
    try {
      const response = await cfn.send(new DescribeStacksCommand({ StackName: stackName }));
      const stack = response.Stacks?.[0];

      if (!stack) {
        return { status: 'DELETE_COMPLETE' };
      }

      if (stack.StackStatus?.endsWith('FAILED')) {
        throw new Error(`Stack ${stackName} deletion failed with status ${stack.StackStatus}`);
      }

      if (stack.StackStatus === 'DELETE_COMPLETE') {
        return { status: 'DELETE_COMPLETE' };
      }

      console.log(`[${new Date().toISOString()}] | Stack ${stackName} is in status: ${stack.StackStatus} (will check again in 5 seconds)`);
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error: any) {
      if (error instanceof CloudFormationServiceException && error.name === 'ValidationError') {
        // Stack no longer exists
        return { status: 'DELETE_COMPLETE' };
      }
      return { status: 'UNKNOWN', error };
    };
  }
}

async function deleteStack(cfn: CloudFormationClient, stack: Stack): Promise<DeleteStackResult> {
  if (!stack.StackName) {
    throw new Error('Stack name is undefined');
  }

  // some stacks may already be in deleting status because the integration test triggered deletion
  // and didn't get a chance to wait for the deletion to complete.
  if (stack.StackStatus !== 'DELETE_IN_PROGRESS') {
    console.log(`[${new Date().toISOString()}] | Initiating stack deletion: ${stack.StackName} [Current Status: ${stack.StackStatus}]`);
    // TODO pass the environment admin role as the RoleArn to avoid relying on the stack's role (which can be deleted because its part of the SUT)
    try {
      await cfn.send(new DeleteStackCommand({ StackName: stack.StackName }));
    } catch (e: any) {
      return { status: stack.StackStatus!, error: e };
    }
  }

  console.log(`[${new Date().toISOString()}] | Stack ${stack.StackName} deleting. Waiting for completion.`);
  return waitForStackDeletion(cfn, stack.StackName);
}

export async function main() {
  // You can specify the region when creating the client
  const cfn = new CloudFormationClient(); // Change region as needed

  const stacksPaginator = paginateDescribeStacks({
    client: cfn,
    pageSize: 10,
  }, {});

  const stacks: Stack[] = [];
  for await (const page of stacksPaginator) {
    for (const stack of page.Stacks ?? []) {
      if (stack.StackName !== 'CDKToolkit') {
        console.log(`[${new Date().toISOString()}] | Found stack to delete: ${stack.StackName}`);
        stacks.push(stack);
      }
    }
  }

  try {
    const report: { [key: string]: DeleteStackResult } = {};
    // Delete stacks in parallel and wait for all deletions to complete

    const all = Promise.all(stacks.map(async (stack) => {
      const result = await deleteStack(cfn, stack);
      report[stack.StackName!] = result;
    }));

    let t;

    const timeout = new Promise((_, reject) => {
      t = setTimeout(() => reject(new Error('Operation timed out')), 1000 * TIMEOUT_SECONDS);
    });

    await Promise.race([all, timeout]);

    printReport(report);
    clearTimeout(t);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] | Failed to delete all stacks:`, error);
    throw error; // Re-throw to ensure the script fails
  }
}

function printReport(report: { [key: string]: DeleteStackResult }) {
  console.log(`[${new Date().toISOString()}] | Finished waiting on all stacks to delete. Here is the report:`);
  for (const [stackName, r] of Object.entries(report)) {
    console.log('');
    console.log(` ---- ${stackName} ----`);
    console.log('');
    console.log(`Status: ${r.status}`);
    if (r.error) {
      console.log('');
      console.log(r.error);
    }
  }
}

// Execute the script
void main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

