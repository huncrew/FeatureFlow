// File: lib/QueueStack.ts
import { Stack, CfnOutput, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class QueueStack extends Stack {
  public readonly myQueue: Queue;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an SQS queue
    this.myQueue = new Queue(this, 'MyQueue', {
      visibilityTimeout: Duration.seconds(300) 
    });

    // Output the SQS Queue URL
    new CfnOutput(this, 'QueueURL', {
      value: this.myQueue.queueUrl,
      exportName: 'MyQueueURL'
    });
  }
}
