import { RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class EnvironmentsTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Default', {
      partitionKey: { name: 'account', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'region', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // According to the design doc, no secondary indexes are needed
    // because all access is done using the primary key (account + region)
  }

  public grantReadWrite(identity: iam.IGrantable) {
    this.table.grantReadWriteData(identity);
    return this;
  }

}