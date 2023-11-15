import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface LambdaStackProps extends StackProps {
    lambdaCodePath: string;
}

export class ListingServiceLambdaStack extends Stack {
    public readonly openAIListingGenerator: NodejsFunction;
    public readonly openAIListingUpdater: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.openAIListingGenerator = new NodejsFunction(this, 'openAIListingGenerator', {
            entry: `${props.lambdaCodePath}/create-listing/index.ts`,
        });

        this.openAIListingUpdater = new NodejsFunction(this, 'openAIListingUpdater', {
            entry: `${props.lambdaCodePath}/update-listing/index.ts`,
            environment: {
                OPENAI_API_KEY: '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',
            }
        });

        // Output the ARN of the authCallbackHandler Lambda function
        new CfnOutput(this, 'openAIListingGeneratorArn', {
            value: this.openAIListingGenerator.functionArn,
            exportName: `ListingService-openAIListingGenerator`,
        });


        // Output the ARN of the authCallbackHandler Lambda function
        new CfnOutput(this, 'openAIListingUpdaterArn', {
            value: this.openAIListingGenerator.functionArn,
            exportName: `ListingService-openAIListingUpdater`,
        });

    }
}
