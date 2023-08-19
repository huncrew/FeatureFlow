"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postFootball = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const uuid_1 = require("uuid");
async function postFootball(event, dynamodbClient) {
    const randomId = (0, uuid_1.v4)();
    const item = JSON.parse(event.body);
    const result = await dynamodbClient.send(new client_dynamodb_1.PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            id: {
                S: randomId,
            },
            name: {
                S: item.name,
            },
        },
    }));
    console.log(result);
    return {
        statusCode: 201,
        body: JSON.stringify({ id: randomId, dale: 'you did it' }),
    };
}
exports.postFootball = postFootball;
