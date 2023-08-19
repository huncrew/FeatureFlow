import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface FootBallTable extends StackProps {
  footballDataTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly footballLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: FootBallTable) {
    super(scope, id, props);

    const footballLambda = new NodejsFunction(this, 'footballLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'src', 'lambdas', 'alb-request', 'handler.ts'),
      environment: {
        TABLE_NAME: props.footballDataTable.tableName,
      },
    });

    footballLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.footballDataTable.tableArn],
        actions: [
          'dynamodb:PutItem',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
      }),
    );

    this.footballLambdaIntegration = new LambdaIntegration(footballLambda);
  }
}
