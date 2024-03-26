import { Stack, CfnOutput, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export interface LambdaStackProps extends StackProps {
  lambdaCodePath: string;
  projectContextTableName: string; // DynamoDB table name for storing project context
}

export class LambdaStack extends Stack {
  public readonly contextHandler: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Create the ContextHandler lambda function
    this.contextHandler = new NodejsFunction(this, 'ContextHandler', {
      entry: `${props.lambdaCodePath}/context-handler/index.ts`, // Adjust the path as necessary
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTableName, // Pass the DynamoDB table name as an environment variable
      },
    });

    // Grant the lambda function permissions to access the DynamoDB table
    const policyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['dynamodb:GetItem', 'dynamodb:PutItem'], // Adjust permissions as necessary
      resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${props.projectContextTableName}`],
    });

    this.contextHandler.addToRolePolicy(policyStatement);

    // Output the lambda function ARN
    new CfnOutput(this, 'ContextHandlerArn', {
      value: this.contextHandler.functionArn,
      exportName: 'ContextService-ContextHandlerArn',
    });
  }
}
