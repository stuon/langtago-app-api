import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
import * as validationLib from "../libs/validation-lib";
import * as loggingLib from "../libs/logging-lib";
import config from "../config/config";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  loggingLib.logAPI("Create", data);

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
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      title: data.title,
      url: data.url,
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
