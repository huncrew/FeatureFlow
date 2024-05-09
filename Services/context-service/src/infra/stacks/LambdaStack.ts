import { Stack, CfnOutput, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import config from '../../../envConstants'
import { Queue } from 'aws-cdk-lib/aws-sqs';


export interface LambdaStackProps extends StackProps {
  lambdaCodePath: string;
  projectContextTable: Table; // DynamoDB table name for storing project context
  myQueue: Queue;  // Add this line
}

export class LambdaStack extends Stack {
  public readonly contextHandler: NodejsFunction;
  public readonly codeGenerator: NodejsFunction;
  
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const queueUrl = props.myQueue.queueUrl;

    // Create the ContextHandler lambda function
    this.contextHandler = new NodejsFunction(this, 'ContextHandler', {
      entry: `${props.lambdaCodePath}/sqs-capture-project-context/index.ts`, 
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName, 
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
      entry: `${props.lambdaCodePath}/chat-initiate-task/index.ts`, // Adjust the path as necessary
      timeout: Duration.seconds(600), // Adjust based on expected response time
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName,
        SQS_QUEUE_URL: queueUrl,
        OPENAI_KEY: config.OPENAI_KEY, // Pass the DynamoDB table name as an environment variable
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
