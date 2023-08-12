import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dotenv from 'dotenv';



export class MessagesStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
  }

}