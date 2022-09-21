import unified from 'unified';
import toHast from 'mdast-util-to-hast';
import parse from 'remark-parse';
import {
  hastToStructuredText,
  Options,
  HastRootNode,
} from 'datocms-html-to-structured-text';
import { validate } from 'datocms-structured-text-utils';

export default async function markdownToStructuredText(
  markdown: string,
  options: Options,
) {
  if (!markdown) {
    return null;
  }

  const mdastTree = unified().use(parse).parse(markdown);
  const hastTree = toHast(mdastTree) as HastRootNode;
  const result = await hastToStructuredText(hastTree, options);

  const validationResult = validate(result);

  if (!validationResult.valid) {
    throw new Error(validationResult.message);
  }

  return result;
}
