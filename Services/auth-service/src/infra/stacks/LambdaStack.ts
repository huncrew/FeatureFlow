import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface LambdaStackProps extends StackProps {
    lambdaCodePath: string;
}

export class LambdaStack extends Stack {
    public readonly authHandler: NodejsFunction;
    public readonly authCallbackHandler: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.authHandler = new NodejsFunction(this, 'EtsyAuthHandler', {
            entry: `${props.lambdaCodePath}/authHandler.ts`,
        });

        this.authCallbackHandler = new NodejsFunction(this, 'EtsyAuthCallbackHandler', {
            entry: `${props.lambdaCodePath}/authCallbackHandler.ts`,
        });
    }
}
