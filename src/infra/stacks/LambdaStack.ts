import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path';

interface FootBallTable extends StackProps {
  footballDataTable: ITable;
}

export class LambdaStack extends Stack {

  public readonly helloLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: FootBallTable) {
    super(scope, id, props);
    
    const helloLambda = new LambdaFunction(this, 'HelloLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.main',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services'))
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}