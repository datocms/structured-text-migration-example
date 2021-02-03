module.exports = async function getModelIdsByApiKey(client) {
  return (await client.itemTypes.all()).reduce(
    (acc, it) => ({ ...acc, [it.apiKey]: it }),
    {},
  );
};
