"use strict";

const { validate } = require("datocms-structured-text-utils");

const getModelIdsByApiKey = require("./utils/getModelIdsByApiKey");
const createStructuredTextFieldFrom = require("./utils/createStructuredTextFieldFrom");
const getAllRecords = require("./utils/getAllRecords");
const swapFields = require("./utils/swapFields");
const markdownToStructuredText = require("./utils/markdownToStructuredText");

module.exports = async (client) => {
  const modelIds = await getModelIdsByApiKey(client);

  await createStructuredTextFieldFrom(
    client,
    "modular_content_article",
    "content",
    [modelIds.image_block.id]
  );

  const records = await getAllRecords(client, "modular_content_article");

  for (const record of records) {
    const rootNode = {
      type: "root",
      children: [],
    };

    for (const block of record.content) {
      switch (block.relationships.itemType.data.id) {
        case modelIds.text_block.id: {
          const markdownSt = await markdownToStructuredText(
            block.attributes.text
          );
          if (markdownSt) {
            rootNode.children = [...rootNode.children, ...markdownSt.document.children];
          }
          break;
        }
        case modelIds.code_block.id: {
          rootNode.children.push({
            type: "code",
            language: block.attributes.language,
            code: block.attributes.code,
          });
          break;
        }
        default: {
          delete block.id;
          delete block.meta;
          delete block.attributes.createdAt;
          delete block.attributes.updatedAt;

          rootNode.children.push({
            type: "block",
            item: block,
          });
          break;
        }
      }
    }

    const result = {
      schema: "dast",
      document: rootNode,
    };

    const validationResult = validate(result);

    if (!validationResult.valid) {
      console.log(inspect(result));
      throw new Error(validationResult.message);
    }

    await client.items.update(record.id, {
      structuredTextContent: result,
    });

    if (record.meta.status !== "draft") {
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, "modular_content_article", "content");
};
