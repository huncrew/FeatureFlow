import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../infra/stacks/LambdaStack';
import { ApiStack } from '../infra/stacks/ApiStack';
import * as path from 'path';

const lambdasPath = path.join(__dirname, '..', 'lambdas');


const app = new App();

const lambdaStack = new LambdaStack(app, 'EtsyLambdaStack', {
    lambdaCodePath: lambdasPath
});

new ApiStack(app, 'EtsyApiStack', {
    authHandler: lambdaStack.authHandler,
    authCallbackHandler: lambdaStack.authCallbackHandler
});
