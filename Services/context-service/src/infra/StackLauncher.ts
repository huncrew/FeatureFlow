import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import * as path from 'path';

const app = new App();

const lambdasPath = path.join(__dirname, '..', 'lambdas');

// Instantiate the DataStack
const dataStack = new DataStack(app, 'ContextService-DataStack', {});

// Pass the entire DynamoDB table object to the LambdaStack
new LambdaStack(app, 'ContextService-LambdaStack', {
  lambdaCodePath: lambdasPath,
  projectContextTable: dataStack.projectContextTable, 
});
