import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataStack } from './stacks/DataStack';

const app = new App();
new DataStack(app, 'DataStack');
