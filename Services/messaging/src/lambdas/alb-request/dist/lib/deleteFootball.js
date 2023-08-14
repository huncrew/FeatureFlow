"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFootball = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
async function deleteFootball(event, ddbClient) {
    if (event.queryStringParameters && 'id' in event.queryStringParameters) {
        const spaceId = event.queryStringParameters['id'];
        await ddbClient.send(new client_dynamodb_1.DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId },
            },
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with id ${spaceId}`),
        };
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!'),
    };
}
exports.deleteFootball = deleteFootball;
