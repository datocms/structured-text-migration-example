import { Document, Node, validate } from 'datocms-structured-text-utils';
import getModelIdsByApiKey from './utils/getModelIdsByApiKey';
import createStructuredTextFieldFrom from './utils/createStructuredTextFieldFrom';
import getAllRecords from './utils/getAllRecords';
import swapFields from './utils/swapFields';
import markdownToStructuredText from './utils/markdownToStructuredText';
import convertImgsToBlocks from './utils/convertImgsToBlocks';
import { Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node';

type ModularArticleType = SimpleSchemaTypes.Item & {
  title: string;
  content: any;
};

export default async function (client: Client) {
  const modelIds = await getModelIdsByApiKey(client);

  await createStructuredTextFieldFrom(
    client,
    'modular_content_article',
    'content',
    [modelIds.image_block.id, modelIds.text_block.id, modelIds.code_block.id],
  );

  const records = (await getAllRecords(
    client,
    'modular_content_article',
  )) as ModularArticleType[];

  for (const record of records) {
    const rootNode = {
      type: 'root',
      children: [] as Node[],
    };

    for (const block of record.content) {
      switch (block.relationships.item_type.data.id) {
        case modelIds.text_block.id: {
          const markdownSt = await markdownToStructuredText(
            block.attributes.text,
            convertImgsToBlocks(client, modelIds),
          );

          if (markdownSt) {
            rootNode.children = [
              ...rootNode.children,
              ...markdownSt.document.children,
            ];
          }
          break;
        }

        case modelIds.code_block.id: {
          rootNode.children.push({
            type: 'code',
            language: block.attributes.language,
            code: block.attributes.code,
          });
          break;
        }
        default: {
          delete block.id;
          delete block.meta;
          delete block.createdAt;
          delete block.updatedAt;

          rootNode.children.push({
            type: 'block',
            item: block,
          });
          break;
        }
      }
    }

    const result = {
      schema: 'dast',
      document: rootNode,
    } as Document;

    const validationResult = validate(result);

    if (!validationResult.valid) {
      throw new Error(validationResult.message);
    }

    await client.items.update(record.id, {
      structured_text_content: result,
    });

    if (record.meta.status !== 'draft') {
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, 'modular_content_article', 'content');
}
