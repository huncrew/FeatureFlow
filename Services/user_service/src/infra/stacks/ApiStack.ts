import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  footballLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'FootballApi');
    const footballResource = api.root.addResource('football');
    footballResource.addMethod('GET', props.footballLambdaIntegration);
    footballResource.addMethod('POST', props.footballLambdaIntegration);
    footballResource.addMethod('PUT', props.footballLambdaIntegration);
    footballResource.addMethod('DELETE', props.footballLambdaIntegration);
  }
}
