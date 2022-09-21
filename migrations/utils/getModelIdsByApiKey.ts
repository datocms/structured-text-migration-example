import { Client } from '@datocms/cli/lib/cma-client-node';
import { ItemType } from '@datocms/cma-client/dist/types/generated/SimpleSchemaTypes';

export default async function getModelIdsByApiKey(
  client: Client,
): Promise<Record<string, ItemType>> {
  const models = await client.itemTypes.list();
  return models.reduce(
    (acc, itemType) => ({
      ...acc,
      [itemType.api_key]: itemType,
    }),
    {},
  );
}
