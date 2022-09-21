import { Client } from '@datocms/cli/lib/cma-client-node';

export default async function swapFields(
  client: Client,
  modelApiKey: string,
  fieldApiKey: string,
) {
  const oldField = await client.fields.find(`${modelApiKey}::${fieldApiKey}`);
  const newField = await client.fields.find(
    `${modelApiKey}::structured_text_${fieldApiKey}`,
  );
  // destroy the old field
  await client.fields.destroy(oldField.id);
  // rename the new field
  await client.fields.update(newField.id, {
    api_key: fieldApiKey,
    label: oldField.label,
    position: oldField.position,
  });
}
