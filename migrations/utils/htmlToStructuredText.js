const parse5 = require('parse5');
const { parse5ToStructuredText } = require('datocms-html-to-structured-text');
const { validate } = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');

module.exports = async function htmlToStructuredText(text, settings) {
  if (!text) {
    return null;
  }

  const result = await parse5ToStructuredText(
    parse5.parse(text, {
      sourceCodeLocationInfo: true,
    }),
    settings,
  );

  const validationResult = validate(result);

  if (!validationResult.valid) {
    console.log(inspect(result));
    throw new Error(validationResult.message);
  }

  return result;
};
