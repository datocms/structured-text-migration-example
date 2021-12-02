module.exports = async function createStructuredTextFieldFrom(
  client,
  modelApiKey,
  fieldApiKey,
  modelBlockIds,
) {
  const legacyField = await client.fields.find(
    `${modelApiKey}::${fieldApiKey}`,
  );

  const newApiKey = `structured_text_${fieldApiKey}`;
  const label = `${legacyField.label} (Structured-text)`;

  console.log(`Creating ${modelApiKey}::${newApiKey}`);
  return client.fields.create(modelApiKey, {
    label,
    apiKey: newApiKey,
    fieldType: 'structured_text',
    fieldset: legacyField.fieldset,
    validators: {
      structuredTextBlocks: {
        itemTypes: modelBlockIds,
      },
      structuredTextLinks: { itemTypes: [] },
    },
  });
};
