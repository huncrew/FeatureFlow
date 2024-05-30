import { Stack, CfnOutput, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import config from '../../../envConstants';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export interface LambdaStackProps extends StackProps {
  lambdaCodePath: string;
  projectContextTable: Table; 
  myQueue: Queue; 
}

export class LambdaStack extends Stack {
  public readonly contextHandler: NodejsFunction;
  public readonly stepCreate: NodejsFunction;
  public readonly stepStatusCheck: NodejsFunction;
  public readonly generateAI: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const queueUrl = props.myQueue.queueUrl;

    // PROJECT CONTEXT LAMBDA
    this.contextHandler = new NodejsFunction(this, 'ContextHandler', {
      entry: `${props.lambdaCodePath}/capture-project-context/index.ts`,
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

    // INITIATE STEP TASK LAMBDA FOR TASK ID

    this.stepCreate = new NodejsFunction(this, 'CreateStep', {
      entry: `${props.lambdaCodePath}/step-create/index.ts`,
      timeout: Duration.seconds(600),
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName,
        SQS_QUEUE_URL: queueUrl,
      },
    });

    props.projectContextTable.grantReadWriteData(this.stepCreate);

    this.stepCreate.addPermission('StepCreateInvokePermission', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
    });

    // Grant permissions to send messages to the SQS queue
    this.stepCreate.addToRolePolicy(
      new PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [props.myQueue.queueArn],
      }),
    );

    // Output the lambda function ARN
    new CfnOutput(this, 'StepCreateHandler', {
      value: this.stepCreate.functionArn,
      exportName: 'ContextService-StepCreateArn',
    });

    // STEP TASK STATUS CHECK
    this.stepStatusCheck = new NodejsFunction(this, 'StepStatusCheck', {
      entry: `${props.lambdaCodePath}/step-task-status-check/index.ts`,
      timeout: Duration.seconds(600),
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName,
      },
    });

    props.projectContextTable.grantReadWriteData(this.stepStatusCheck);

    this.stepStatusCheck.addPermission('StepStatusInvokePermission', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
    });

    // Output the lambda function ARN
    new CfnOutput(this, 'StepStatusHandler', {
      value: this.stepStatusCheck.functionArn,
      exportName: 'ContextService-StepStatusHandlerArn',
    });

    // GENERATE AI
    this.generateAI = new NodejsFunction(this, 'GenerateAI', {
      entry: `${props.lambdaCodePath}/sqs-generate-ai-chatgpt/index.ts`,
      timeout: Duration.seconds(600),
      environment: {
        PROJECT_CONTEXT_TABLE_NAME: props.projectContextTable.tableName,
        OPENAI_KEY: config.OPENAI_KEY,
      },
    });

    props.projectContextTable.grantReadWriteData(this.generateAI);

    this.generateAI.addPermission('GenerateAIInvokePermission', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:*/*/*/*`,
    });

    // Grant permissions to consume messages from the SQS queue
    props.myQueue.grantConsumeMessages(this.generateAI);

    // Add SQS event source to the generateAI lambda
    this.generateAI.addEventSource(new SqsEventSource(props.myQueue));

    // Output the lambda function ARN
    new CfnOutput(this, 'GenerateAIHandler', {
      value: this.generateAI.functionArn,
      exportName: 'ContextService-GenerateAIHandlerArn',
    });
  }
}
