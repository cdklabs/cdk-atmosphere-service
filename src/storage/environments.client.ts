// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';

/**
 * Base error originating from actions on the environments table.
 */
export class EnvironmentsError extends Error {
  constructor(account: string, region: string, message: string) {
    super(`Environment aws://${account}/${region}: ${message}`);
  }
}

/**
 * Error thrown when an environment is already acquired.
 */
export class EnvironmentAlreadyAcquiredError extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already acquired');
  }
};

/**
 * Error thrown when an environment is already released.
 */
export class EnvironmentAlreadyReleasedError extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already released');
  }
};

/**
 * Error thrown when an environment is already in-use.
 */
export class EnvironmentAlreadyInUseError extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already in-use');
  }
};

/**
 * Error thrown when an environment is already in the target status.
 */
export class EnvironmentAlreadyInStatusError extends EnvironmentsError {
  constructor(account: string, region: string, status: string) {
    super(account, region, `already ${status}`);
  }
};

/**
 * Error thrown when an environment is already dirty.
 */
export class EnvironmentAlreadyDirtyError extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already dirty');
  }
}

/**
 * Error thrown when an environment is already cleaning.
 */
export class EnvironmentAlreadyCleaningError extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already cleaning');
  }
}

/**
 * Error thrown when an environment is already reallocated.
 */
export class EnvironmentAlreadyReallocated extends EnvironmentsError {
  constructor(account: string, region: string) {
    super(account, region, 'already reallocated');
  }
}

/**
 * Possible status an environment can be in.
 *
 * - `in-use`: Currently in use by an alloaction.
 * - `cleaning`: Environment being cleaned.
 * - `dirty`: Environment is dirty, meaning the cleanup did not finish successfully, or timed out.
 *
 * Note that there is no `free` status because free
 * environments don't appear in the table.
 */
type EnvironmentStatus = 'in-use' | 'cleaning' | 'dirty';

/**
 * Client for accessing the environments table at runtime.
 */
export class EnvironmentsClient {

  private readonly ddbClient: ddb.DynamoDB;

  constructor(private readonly tableName: string) {
    this.ddbClient = new ddb.DynamoDB({});
  }

  /**
   * Acquire an environment by inserting a new item into the table.
   * If the environment is already acquired, this will fail.
   */
  public async acquire(allocationId: string, account: string, region: string) {
    try {
      await this.ddbClient.putItem({
        TableName: this.tableName,
        Item: {
          account: { S: account },
          region: { S: region },
          status: { S: 'in-use' },
          allocation: { S: allocationId },
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          '#region': 'region',
          '#account': 'account',
        },
        // ensures insertion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: 'attribute_not_exists(#account) AND attribute_not_exists(#region)',
      });
    } catch (e: any) {
      if (e instanceof ddb.ConditionalCheckFailedException) {
        throw new EnvironmentAlreadyAcquiredError(account, region);
      }
      throw e;
    }
  }

  /**
   * Release an environment by deleting an item from the table.
   * If the environment is already released, this will fail.
   */
  public async release(allocationId: string, account: string, region: string) {
    try {
      await this.ddbClient.deleteItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region },
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          '#region': 'region',
          '#account': 'account',
          '#allocation': 'allocation',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':allocation_value': { S: allocationId },
          // we only expect to release an environment that is currenly being cleaned.
          // 'in-use' environments should not be released until they cleaned
          // 'dirty' environments should not be released because they trigger human intervention.
          ':expected_status_value': { S: 'cleaning' },
        },
        // ensures deletion.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
        ConditionExpression: 'attribute_exists(#account) AND attribute_exists(#region) AND #allocation = :allocation_value AND #status = :expected_status_value',
        ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
      });
    } catch (e: any) {
      if (e instanceof ddb.ConditionalCheckFailedException) {

        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }

        const old_allocation = e.Item.allocation?.S;
        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }

        const old_status = e.Item.status?.S;

        if (old_status) {
          switch (old_status) {
            case 'in-use': throw new EnvironmentAlreadyInUseError(account, region);
            case 'dirty': throw new EnvironmentAlreadyDirtyError(account, region);
            default: throw new Error(`Unexpected status for environment aws://${account}/${region}: ${old_status}`);
          }
        }

      }
      throw e;
    }
  }

  /**
   * Mark the environment status as 'cleaning'.
   * If the environment is already in a 'cleaning' status, this will fail.
   */
  public async cleaning(allocationId: string, account: string, region: string) {
    try {
      await this.setStatus(allocationId, account, region, 'cleaning');
    } catch (e: any) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyCleaningError(account, region);
      }
      throw e;
    }
  }

  /**
   * Mark the environment status as 'dirty'.
   * If the environment is already in a 'dirty' status, this will fail.
   */
  public async dirty(allocationId: string, account: string, region: string) {
    try {
      await this.setStatus(allocationId, account, region, 'dirty');
    } catch (e: any) {
      if (e instanceof EnvironmentAlreadyInStatusError) {
        throw new EnvironmentAlreadyDirtyError(account, region);
      }
      throw e;
    }
  }

  private async setStatus(allocationId: string, account: string, region: string, status: EnvironmentStatus) {
    try {
      await this.ddbClient.updateItem({
        TableName: this.tableName,
        Key: {
          account: { S: account },
          region: { S: region },
        },
        // avoid attribute name collisions with reserved keywords.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
        ExpressionAttributeNames: {
          '#status': 'status',
          '#allocation': 'allocation',
        },
        ExpressionAttributeValues: {
          ':status_value': { S: status },
          ':allocation_value': { S: allocationId },
        },
        UpdateExpression: 'SET #status = :status_value',
        // ensures update.
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate
        ConditionExpression: '#allocation = :allocation_value AND #status <> :status_value',
        ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
      });
    } catch (e: any) {
      if (e instanceof ddb.ConditionalCheckFailedException) {

        if (!e.Item) {
          throw new EnvironmentAlreadyReleasedError(account, region);
        }

        const old_allocation = e.Item.allocation?.S;
        const old_status = e.Item.status?.S;

        if (old_allocation && old_allocation !== allocationId) {
          throw new EnvironmentAlreadyReallocated(account, region);
        }

        if (old_status && old_status === status) {
          throw new EnvironmentAlreadyInStatusError(account, region, old_status);
        }

      }

      throw e;
    }
  }

}