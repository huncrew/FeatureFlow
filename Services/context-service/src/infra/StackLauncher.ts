import { App } from 'aws-cdk-lib';
import { LambdaStack } from './stacks/LambdaStack';

import * as path from 'path';

const lambdasPath = path.join(__dirname, '..', 'lambdas');


const app = new App();


new LambdaStack(app, 'LambdaStack', {
    lambdaCodePath: lambdasPath
});

