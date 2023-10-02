import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiStackProps extends StackProps {
    authHandler: NodejsFunction;
    authCallbackHandler: NodejsFunction;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new LambdaRestApi(this, 'Endpoint', {
            handler: props.authHandler,
        });

        const callbackResource = api.root.addResource('auth').addResource('callback');
        callbackResource.addMethod('GET', new LambdaIntegration(props.authCallbackHandler));
    }
}
