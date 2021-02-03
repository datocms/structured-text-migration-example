module.exports = async function swapFields(client, modelApiKey, fieldApiKey) {
  const oldField = await client.fields.find(`${modelApiKey}::${fieldApiKey}`);
  const newField = await client.fields.find(
    `${modelApiKey}::structured_text_${fieldApiKey}`,
  );

  // destroy the old field
  await client.fields.destroy(oldField.id);
  // rename the new field
  await client.fields.update(newField.id, {
    apiKey: fieldApiKey,
    label: oldField.label,
    position: oldField.position,
  });
};
