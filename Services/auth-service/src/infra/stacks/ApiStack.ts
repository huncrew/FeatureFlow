import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi, Cors } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiStackProps extends StackProps {
    authHandler: NodejsFunction;
    authCallbackHandler: NodejsFunction;
    registration: NodejsFunction;
    login: NodejsFunction;
    verify: NodejsFunction;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
      super(scope, id, props);
  

      const api = new RestApi(this, 'Endpoint', {
        // Enabling CORS
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS, // Or specify origins ['http://example.com']
            allowMethods: Cors.ALL_METHODS, // Or specify methods ['GET', 'POST', 'PUT', 'OPTIONS']
            // You can add allowHeaders, allowCredentials, etc.
        },
    });
  
      const authResource = api.root.addResource('auth');
      authResource.addMethod('POST', new LambdaIntegration(props.authHandler));
  
      const callbackResource = authResource.addResource('callback');
      callbackResource.addMethod('GET', new LambdaIntegration(props.authCallbackHandler));
  
      const registrationResource = api.root.addResource('register');
      registrationResource.addMethod('POST', new LambdaIntegration(props.registration));

      const loginResource = api.root.addResource('login');
      loginResource.addMethod('POST', new LambdaIntegration(props.login));

      const verifyEmailResource = api.root.addResource('verify-email');
      verifyEmailResource.addMethod('POST', new LambdaIntegration(props.verify));
    }
  }
