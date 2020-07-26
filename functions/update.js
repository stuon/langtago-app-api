import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
import * as validationLib from "../libs/validation-lib";
import * as loggingLib from "../libs/logging-lib";
import config from "../config/config";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  loggingLib.logAPI("Update", data);

  try {
    validationLib.validateText(
      "title",
      data.title,
      null,
      config.MAX_TITLE_SIZE
    );
    validationLib.validateText("url", data.url, null, config.MAX_URL_SIZE);
    validationLib.validateText(
      "content",
      data.content,
      null,
      config.MAX_CONTENT_SIZE
    );
    validationLib.validateFile(
      "attachment",
      data.attachment,
      config.MAX_ATTACHMENT_SIZE
    );
  } catch (e) {
    return failure({ status: false, description: e });
  }

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression:
      "SET title = :title, #url = :url, content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":title": data.title || null,
      ":url": data.url || null,
      ":content": data.content || null,
    },
    ExpressionAttributeNames: {
      "#url": "url",
    },

    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
