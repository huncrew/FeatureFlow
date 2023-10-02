import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../infra/stacks/LambdaStack';
import { ApiStack } from '../infra/stacks/ApiStack';

const app = new App();

const lambdaStack = new LambdaStack(app, 'EtsyLambdaStack', {
    lambdaCodePath: 'path_to_your_directory'
});

new ApiStack(app, 'EtsyApiStack', {
    authHandler: lambdaStack.authHandler,
    authCallbackHandler: lambdaStack.authCallbackHandler
});
