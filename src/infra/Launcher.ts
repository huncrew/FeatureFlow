import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';

const app = new App();
new DataStack(app, 'DataStack');
new LambdaStack(app, 'LambdaStack');
