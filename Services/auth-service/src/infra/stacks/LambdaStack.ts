import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface LambdaStackProps extends StackProps {
    lambdaCodePath: string;
    userPoolClientId: string
}

export class LambdaStack extends Stack {
    public readonly authHandler: NodejsFunction;
    public readonly authCallbackHandler: NodejsFunction;
    public readonly registration: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.authHandler = new NodejsFunction(this, 'EtsyAuthHandler', {
            entry: `${props.lambdaCodePath}/etsy-initiate-auth/index.ts`,
        });

        this.authCallbackHandler = new NodejsFunction(this, 'EtsyAuthCallbackHandler', {
            entry: `${props.lambdaCodePath}/etsy-callback-auth/index.ts`,
        });

        this.registration = new NodejsFunction(this, 'AppRegistration', {
            entry: `${props.lambdaCodePath}/registration/index.ts`,
            environment: {
                USERPOOL_CLIENT_ID: props.userPoolClientId
            }
        });
    }
}
