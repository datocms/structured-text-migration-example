const path = require('path');

module.exports = async function findOrCreateUploadWithUrl(client, url) {
  let upload;

  if (url.startsWith("https://www.datocms-assets.com")) {
    const pattern = path.basename(url).replace(/^[0-9]+\-/, "");
    console.log(pattern);

    const matchingUploads = await client.uploads.all({
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
    const uploadPath = await client.createUploadPath(url);
    upload = await client.uploads.create({ path: uploadPath });
  }

  return upload;
};
