import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?) {
    super(scope, id, props);

    // Create a Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      // Configure your user pool as needed
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    // Create a Cognito User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
        adminUserPassword: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: ['https://your-callback-url.com'],
        logoutUrls: ['https://your-logout-url.com'],
        scopes: [cognito.OAuthScope.EMAIL],
      },
    });
  }
}
