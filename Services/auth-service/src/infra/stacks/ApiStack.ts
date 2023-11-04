import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiStackProps extends StackProps {
    authHandler: NodejsFunction;
    authCallbackHandler: NodejsFunction;
    registration: NodejsFunction;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
      super(scope, id, props);
  
      const api = new RestApi(this, 'Endpoint', {
        // No default handler specified here
      });
  
      const authResource = api.root.addResource('auth');
      authResource.addMethod('POST', new LambdaIntegration(props.authHandler));
  
      const callbackResource = authResource.addResource('callback');
      callbackResource.addMethod('GET', new LambdaIntegration(props.authCallbackHandler));
  
      const registrationResource = api.root.addResource('register');
      registrationResource.addMethod('POST', new LambdaIntegration(props.registration));
    }
  }
