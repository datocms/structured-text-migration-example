import { Client } from "@datocms/cma-client-node";
import {
  Field,
  ItemTypeIdentity,
} from "@datocms/cma-client/dist/types/generated/SimpleSchemaTypes";

export default async function createStructuredTextFieldFrom(
  client: Client,
  modelApiKey: string,
  fieldApiKey: string,
  modelBlockIds: ItemTypeIdentity[]
): Promise<Field> {
  console.log(`${modelApiKey}::${fieldApiKey}`);

  const legacyField = await client.fields.find(
    `${modelApiKey}::${fieldApiKey}`
  );

  const newApiKey = `structured_text_${fieldApiKey}`;
  const label = `${legacyField.label} (Structured-text)`;

  console.log(`Creating ${modelApiKey}::${newApiKey}`);

  return client.fields.create(modelApiKey, {
    label,
    api_key: newApiKey,
    field_type: "structured_text",
    fieldset: legacyField.fieldset,
    validators: {
      structured_text_blocks: {
        item_types: modelBlockIds,
      },
      structured_text_links: { item_types: [] },
    },
  });
}
