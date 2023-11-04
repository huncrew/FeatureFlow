import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../infra/stacks/LambdaStack';
import { ApiStack } from '../infra/stacks/ApiStack';
import { AuthStack } from '../infra/stacks/AuthStack';

import * as path from 'path';

const lambdasPath = path.join(__dirname, '..', 'lambdas');


const app = new App();

const authStack = new AuthStack(app, 'AuthStack');

const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    lambdaCodePath: lambdasPath,
    userPoolClientId: authStack.userPoolClient.userPoolClientId,
});

new ApiStack(app, 'EtsyApiStack', {
    authHandler: lambdaStack.authHandler,
    authCallbackHandler: lambdaStack.authCallbackHandler,
    registration: lambdaStack.registration
});


