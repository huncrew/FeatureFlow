import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import * as path from 'path';

const app = new App();

const lambdasPath = path.join(__dirname, '..', 'lambdas');

// Instantiate the DataStack
const dataStack = new DataStack(app, 'DataStack', {});

// Instantiate the LambdaStack, passing the DynamoDB table name as a prop
new LambdaStack(app, 'LambdaStack', {
  lambdaCodePath: lambdasPath,
  projectContextTableName: dataStack.projectContextTable.tableName, // Here we assume the table name is directly accessible; adjust as necessary
});
