import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface LambdaStackProps extends StackProps {
    lambdaCodePath: string;
}

export class ListingServiceLambdaStack extends Stack {
    public readonly openAIListingGenerator: NodejsFunction;
    public readonly openAIListingUpdater: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        // retrieve key.
        const openAIApiKey = ssm.StringParameter.valueFromLookup(this, 'openai_api_key');


        this.openAIListingGenerator = new NodejsFunction(this, 'openAIListingGenerator', {
            entry: `${props.lambdaCodePath}/create-listing/index.ts`,
        });

        this.openAIListingUpdater = new NodejsFunction(this, 'openAIListingUpdater', {
            entry: `${props.lambdaCodePath}/update-listing/index.ts`,
            environment: {
                OPENAI_API_KEY: openAIApiKey,
            }
        });

        // Output the ARN of the authCallbackHandler Lambda function
        new CfnOutput(this, 'openAIListingGeneratorArn', {
            value: this.openAIListingGenerator.functionArn,
            exportName: `ListingService-openAIListingGeneratorArn`,
        });

        // Output the ARN of the authCallbackHandler Lambda function
        new CfnOutput(this, 'openAIListingUpdaterArn', {
            value: this.openAIListingGenerator.functionArn,
            exportName: `ListingService-openAIListingUpdaterArn`,
        });

    }
}
