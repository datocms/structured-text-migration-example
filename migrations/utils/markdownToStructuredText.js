const unified = require('unified');
const toHast = require('mdast-util-to-hast');
const parse = require('remark-parse');
const { hastToStructuredText } = require('datocms-html-to-structured-text');
const { validate } = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');

module.exports = async function markdownToStructuredText(text, settings) {
  if (!text) {
    return null;
  }

  const mdastTree = unified().use(parse).parse(text);
  const hastTree = toHast(mdastTree);
  const result = await hastToStructuredText(hastTree, settings);

  const validationResult = validate(result);

  if (!validationResult.valid) {
    console.log(inspect(result));
    throw new Error(validationResult.message);
  }

  return result;
};
