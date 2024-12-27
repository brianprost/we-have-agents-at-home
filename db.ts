import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export async function read(key: string) {
  try {
    const command = new GetCommand({
      TableName: Resource.ResponseCache.name,
      Key: {
        cacheKey: key,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return null;
    }

    return response.Item.response;
  } catch (e) {
    return null;
  }
}

export async function write(key: string, value: string) {
  try {
    const command = new PutCommand({
      TableName: Resource.ResponseCache.name,
      Item: {
        cacheKey: key,
        response: value,
      },
    });

    await docClient.send(command);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
