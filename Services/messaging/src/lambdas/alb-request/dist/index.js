"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const postFootball_1 = require("./lib/postFootball");
const getFootball_1 = require("./lib/getFootball");
const putFootball_1 = require("./lib/putFootball");
const deleteFootball_1 = require("./lib/deleteFootball");
// middy imports
const core_1 = __importDefault(require("@middy/core"));
const dynamodbClient = new client_dynamodb_1.DynamoDBClient({});
const lambdaHandler = async (event, context) => {
    let message;
    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await (0, getFootball_1.getFootball)(event, dynamodbClient);
                return getResponse;
            case 'POST':
                const postResponse = await (0, postFootball_1.postFootball)(event, dynamodbClient);
                return postResponse;
            case 'PUT':
                const putResponse = await (0, putFootball_1.putFootball)(event, dynamodbClient);
                console.log(putResponse);
                return putResponse;
            case 'DELETE':
                const deleteResponse = await (0, deleteFootball_1.deleteFootball)(event, dynamodbClient);
                console.log(deleteResponse);
                return deleteResponse;
            default:
                break;
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(message),
    };
    console.log(event);
    return response;
};
const handler = (0, core_1.default)(lambdaHandler);
exports.handler = handler;
