'use strict';

const { buildModularBlock } = require('datocms-client');
const { visit, CONTINUE } = require('unist-utils-core');

const getModelIdsByApiKey = require('./utils/getModelIdsByApiKey');
const createStructuredTextFieldFrom = require('./utils/createStructuredTextFieldFrom');
const findOrCreateUploadWithUrl = require('./utils/findOrCreateUploadWithUrl');
const htmlToStructuredText = require('./utils/htmlToStructuredText');
const getAllRecords = require('./utils/getAllRecords');
const swapFields = require('./utils/swapFields');

module.exports = async (client) => {
  const modelIds = await getModelIdsByApiKey(client);
  await createStructuredTextFieldFrom(client, 'html_article', 'content', [
    modelIds.image_block.id,
  ]);
  const records = await getAllRecords(client, 'html_article');

  for (const record of records) {
    await client.items.update(record.id, {
      structuredTextContent: await htmlToStructuredText(record.content, {
        preprocess: (tree) => {
          visit(tree, (node, index, parents) => {
            if (node.tagName === 'img' && parents.length > 1) {
              const parent = parents[parents.length - 1];
              tree.children.push(node);
              parent.children.splice(index, 1);
              return [CONTINUE, index];
            }
          });
        },
        handlers: {
          img: async (createNode, node, context) => {
            const { src: url } = node.properties;
            const upload = await findOrCreateUploadWithUrl(client, url);

            return createNode('block', {
              item: buildModularBlock({
                image: {
                  uploadId: upload.id,
                },
                itemType: modelIds.image_block.id,
              }),
            });
          },
        },
      }),
    });

    if (record.meta.status !== 'draft') {
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'html_article', 'content');
};
