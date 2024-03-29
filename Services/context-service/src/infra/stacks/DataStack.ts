import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';

export class DataStack extends Stack {
  public readonly projectContextTable: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for Project Context
    this.projectContextTable = new Table(this, 'FeatureFlowContextTable', {
      tableName: 'FeatureFlowContextTable', // Specify your table name here
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // or PROVISIONED, based on your needs
    });
  }
}
