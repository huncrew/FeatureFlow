"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFootball = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
async function getFootball(event, dynamodbClient) {
    if (event.queryStringParameters) {
        const footballId = event.queryStringParameters['id'];
        const singleItemResponse = await dynamodbClient.send(new client_dynamodb_1.GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: footballId },
            },
        }));
        const unmarshResp = (0, util_dynamodb_1.unmarshall)(singleItemResponse.Item);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'hi Dale', item: unmarshResp }),
        };
    }
    const result = await dynamodbClient.send(new client_dynamodb_1.ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));
    const unmarshAllItems = result.Items.map((item) => (0, util_dynamodb_1.unmarshall)(item));
    return {
        statusCode: 201,
        body: JSON.stringify({ items: unmarshAllItems, dale: 'you did it' }),
    };
}
exports.getFootball = getFootball;
