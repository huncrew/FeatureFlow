import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { QueueStack } from './stacks/QueueStack';
import * as path from 'path';

const app = new App();
const lambdasPath = path.join(__dirname, '..', 'lambdas');

const queueStack = new QueueStack(app, 'ContextService-QueueStack');
const dataStack = new DataStack(app, 'ContextService-DataStack');

new LambdaStack(app, 'ContextService-LambdaStack', {
  lambdaCodePath: lambdasPath,
  projectContextTable: dataStack.projectContextTable,
  myQueue: queueStack.myQueue, // Pass the queue like this
});
