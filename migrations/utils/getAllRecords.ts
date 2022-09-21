import { Client } from '@datocms/cli/lib/cma-client-node';

export default async function getAllRecords(
  client: Client,
  modelApiKey: string,
) {
  const records = await client.items.list({
    filter: { type: modelApiKey },
    nested: 'true',
  });
  console.log(`Found ${records.length} records!`);
  return records;
}
