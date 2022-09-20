"use strict";

import getModelIdsByApiKey from "./utils/getModelIdsByApiKey";
import createStructuredTextFieldFrom from "./utils/createStructuredTextFieldFrom";
import markdownToStructuredText from "./utils/markdownToStructuredText";
import convertImgsToBlocks from "./utils/convertImgsToBlocks";
import getAllRecords from "./utils/getAllRecords";
import swapFields from "./utils/swapFields";
import { Client, SimpleSchemaTypes } from "@datocms/cma-client-node";

type MdArticleType = SimpleSchemaTypes.Item & {
  title: string;
  content: string;
};

export default async function (client: Client) {
  const modelIds = await getModelIdsByApiKey(client);

  await createStructuredTextFieldFrom(client, "markdown_article", "content", [
    modelIds.image_block.id,
  ]);

  const records = (await getAllRecords(
    client,
    "markdown_article"
  )) as MdArticleType[];

  for (const record of records) {
    const structuredTextContent = await markdownToStructuredText(
      record.content,
      convertImgsToBlocks(client, modelIds)
    );

    await client.items.update(record.id, {
      structured_text_content: structuredTextContent,
    });

    if (record.meta.status !== "draft") {
      await client.items.publish(record.id);
    }
  }

  await swapFields(client, "markdown_article", "content");
}
