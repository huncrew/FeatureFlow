import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';

const app = new App();

// stacks
const footballData = new DataStack(app, 'DataStack');

// instantiate the lambda stack object, assign it to the lambdaStack variable
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  footballDataTable: footballData.footballUsersTable
});

// we pass the helloLambda Function as props to the Api stack, so it can connect that to the API stack.
new ApiStack(app, 'ApiStack', {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration
})

