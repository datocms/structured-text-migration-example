import { Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node';

export default async function createStructuredTextFieldFrom(
  client: Client,
  modelApiKey: string,
  fieldApiKey: string,
  modelBlockIds: SimpleSchemaTypes.ItemTypeIdentity[],
): Promise<SimpleSchemaTypes.Field> {
  const legacyField = await client.fields.find(
    `${modelApiKey}::${fieldApiKey}`,
  );

  const newApiKey = `structured_text_${fieldApiKey}`;
  const label = `${legacyField.label} (Structured-text)`;

  console.log(`Creating ${modelApiKey}::${newApiKey}`);

  return client.fields.create(modelApiKey, {
    label,
    api_key: newApiKey,
    field_type: 'structured_text',
    fieldset: legacyField.fieldset,
    validators: {
      structured_text_blocks: {
        item_types: modelBlockIds,
      },
      structured_text_links: { item_types: [] },
    },
  });
}
