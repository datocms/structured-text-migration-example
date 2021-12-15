'use strict';

const getModelIdsByApiKey = require('./utils/getModelIdsByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const htmlToStructuredText = require('./utils/htmlToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');
const convertImgsToBlocks = require('./utils/convertImgsToBlocks');

module.exports = async (client) => {
  const modelIds = await getModelIdsByApiKey(client);
  await createStructuredTextFieldFrom(client, 'html_article', 'content', [
    modelIds.image_block.id,
  ]);
  const records = await getAllRecords(client, 'html_article');

  for (const record of records) {
    await client.items.update(record.id, {
      structuredTextContent: await htmlToStructuredText(
        record.content,
        convertImgsToBlocks(client, modelIds),
      ),
    });

    if (record.meta.status !== 'draft') {
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'html_article', 'content');
};
