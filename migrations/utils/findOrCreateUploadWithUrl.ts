import { Client } from "@datocms/cma-client-node";
import path from "path";

export default async function findOrCreateUploadWithUrl(
  client: Client,
  url: string
) {
  let upload;

  if (url.startsWith("https://www.datocms-assets.com")) {
    const pattern = path.basename(url).replace(/^[0-9]+\-/, "");

    const matchingUploads = await client.uploads.list({
      filter: {
        fields: {
          filename: {
            matches: {
              pattern,
              case_sensitive: false,
              regexp: false,
            },
          },
        },
      },
    });

    upload = matchingUploads.find((u) => {
      return u.url === url;
    });
  }

  if (!upload) {
    upload = await client.uploads.createFromUrl({ url });
  }

  return upload;
}
