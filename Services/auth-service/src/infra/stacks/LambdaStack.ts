import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

export interface LambdaStackProps extends StackProps {
    lambdaCodePath: string;
}

export class LambdaStack extends Stack {
    public readonly authHandler: Function;
    public readonly authCallbackHandler: Function;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.authHandler = new Function(this, 'EtsyAuthHandler', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(props.lambdaCodePath),
            handler: 'authHandler.auth',
        });

        this.authCallbackHandler = new Function(this, 'EtsyAuthCallbackHandler', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(props.lambdaCodePath),
            handler: 'authHandler.authCallback',
        });
    }
}
