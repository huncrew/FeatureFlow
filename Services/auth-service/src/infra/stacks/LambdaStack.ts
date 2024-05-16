import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export interface LambdaStackProps extends StackProps {
  lambdaCodePath: string;
  userPoolClientId: string;
}

export class LambdaStack extends Stack {
  public readonly authHandler: NodejsFunction;
  public readonly authCallbackHandler: NodejsFunction;
  public readonly registration: NodejsFunction;
  public readonly login: NodejsFunction;
  public readonly verifyEmail: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Helper function to create a NodejsFunction and grant API Gateway invoke permissions
    const createLambdaWithPermissions = (
      id: string,
      entry: string,
      environment?: { [key: string]: string },
    ) => {
      const lambdaFunction = new NodejsFunction(this, id, {
        entry,
        environment,
      });

      lambdaFunction.addPermission(`${id}InvokePermission`, {
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
      });

      new CfnOutput(this, `${id}Arn`, {
        value: lambdaFunction.functionArn,
        exportName: `AuthService-${id}Arn`,
      });

      return lambdaFunction;
    };

    // Create the Lambda functions with the necessary permissions
    this.authCallbackHandler = createLambdaWithPermissions(
      'EtsyInitiateHandler',
      `${props.lambdaCodePath}/etsy-initiate-auth/index.ts`,
    );
    this.authHandler = createLambdaWithPermissions(
      'EtsyCallBackHandler',
      `${props.lambdaCodePath}/etsy-callback-auth/index.ts`,
      {
        USERPOOL_CLIENT_ID: props.userPoolClientId,
      },
    );
    this.registration = createLambdaWithPermissions(
      'RegistrationHandler',
      `${props.lambdaCodePath}/registration/index.ts`,
      {
        USERPOOL_CLIENT_ID: props.userPoolClientId,
      },
    );
    this.login = createLambdaWithPermissions(
      'SignInHandler',
      `${props.lambdaCodePath}/sign-in/index.ts`,
      {
        USERPOOL_CLIENT_ID: props.userPoolClientId,
      },
    );
    this.verifyEmail = createLambdaWithPermissions(
      'VerifyEmailHandler',
      `${props.lambdaCodePath}/verify-email/index.ts`,
      {
        USERPOOL_CLIENT_ID: props.userPoolClientId,
      },
    );
  }
}
