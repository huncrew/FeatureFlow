"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putFootball = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
async function putFootball(event, ddbClient) {
    if ('id' in event.queryStringParameters) {
        const parsedBody = JSON.parse(event.body);
        const spaceId = event.queryStringParameters['id'];
        const requestBodyKey = Object.keys(parsedBody)[0];
        const requestBodyValue = parsedBody[requestBodyKey];
        const updateResult = await ddbClient.send(new client_dynamodb_1.UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: spaceId },
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues: {
                ':new': {
                    S: requestBodyValue,
                },
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey,
            },
            ReturnValues: 'UPDATED_NEW',
        }));
        return {
            statusCode: 204,
            body: JSON.stringify(updateResult.Attributes),
        };
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide right args!!'),
    };
}
exports.putFootball = putFootball;
