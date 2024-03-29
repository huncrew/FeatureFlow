import { Stack, CfnOutput, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export interface LambdaStackProps extends StackProps {
  lambdaCodePath: string;
  projectContextTable: Table; // DynamoDB table name for storing project context
}

export class LambdaStack extends Stack {
  public readonly contextHandler: NodejsFunction;
  public readonly codeGenerator: NodejsFunction;


  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Create the ContextHandler lambda function
    this.contextHandler = new NodejsFunction(this, 'ContextHandler', {
      entry: `${props.lambdaCodePath}/capture-project-context/index.ts`, // Adjust the path as necessary
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName, // Pass the DynamoDB table name as an environment variable
      },
    });

    props.projectContextTable.grantReadWriteData(this.contextHandler);

    this.contextHandler.addPermission('ContextHandlerInvokePermission', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
    });

    // Output the lambda function ARN
    new CfnOutput(this, 'ContextHandlerArn', {
      value: this.contextHandler.functionArn,
      exportName: 'ContextService-ContextHandlerArn',
    });

    // Create the ContextHandler lambda function
    this.codeGenerator = new NodejsFunction(this, 'CodeGenerator', {
      entry: `${props.lambdaCodePath}/generate-ai-chatgpt/index.ts`, // Adjust the path as necessary
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName, // Pass the DynamoDB table name as an environment variable
      },
    });

    props.projectContextTable.grantReadWriteData(this.codeGenerator);


    this.codeGenerator.addPermission('CodeGeneratorInvokePermission', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
    });

    // Output the lambda function ARN
    new CfnOutput(this, 'GenerateCodeHandler', {
      value: this.codeGenerator.functionArn,
      exportName: 'ContextService-GenerateCodeHandlerArn',
    });
  }
}