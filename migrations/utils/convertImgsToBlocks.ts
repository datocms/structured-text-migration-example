import {
  buildBlockRecord,
  Client,
  SimpleSchemaTypes,
} from '@datocms/cli/lib/cma-client-node';
import { visit, find } from 'unist-utils-core';
import {
  HastNode,
  HastElementNode,
  CreateNodeFunction,
  Context,
} from 'datocms-html-to-structured-text';
import { Options } from 'datocms-html-to-structured-text';
import findOrCreateUploadWithUrl from './findOrCreateUploadWithUrl';

export default function convertImgsToBlocks(
  client: Client,
  modelIds: Record<string, SimpleSchemaTypes.ItemType>,
): Options {
  return {
    preprocess: (tree: HastNode) => {
      const liftedImages = new WeakSet();

      const body = find(
        tree,
        (node: HastNode) =>
          (node.type === 'element' && node.tagName === 'body') ||
          node.type === 'root',
      );

      visit<HastNode, HastElementNode & { children: HastNode[] }>(
        body,
        (node, index, parents) => {
          if (
            node.type !== 'element' ||
            node.tagName !== 'img' ||
            liftedImages.has(node) ||
            parents.length === 1
          ) {
            return;
          }

          const imgParent = parents[parents.length - 1];
          imgParent.children.splice(index, 1);

          let i = parents.length;
          let splitChildrenIndex = index;
          let childrenAfterSplitPoint: HastNode[] = [];

          while (--i > 0) {
            const parent = parents[i];
            const parentsParent = parents[i - 1];

            childrenAfterSplitPoint =
              parent.children.splice(splitChildrenIndex);
            splitChildrenIndex = parentsParent.children.indexOf(parent);

            let nodeInserted = false;

            if (i === 1) {
              splitChildrenIndex += 1;
              parentsParent.children.splice(splitChildrenIndex, 0, node);
              liftedImages.add(node);

              nodeInserted = true;
            }

            splitChildrenIndex += 1;

            if (childrenAfterSplitPoint.length > 0) {
              parentsParent.children.splice(splitChildrenIndex, 0, {
                ...parent,
                children: childrenAfterSplitPoint,
              });
            }

            if (parent.children.length === 0) {
              splitChildrenIndex -= 1;
              parentsParent.children.splice(
                nodeInserted ? splitChildrenIndex - 1 : splitChildrenIndex,
                1,
              );
            }
          }
        },
      );
    },
    // now that images are top-level, convert them into `block` dast nodes
    handlers: {
      img: async (
        createNode: CreateNodeFunction,
        node: HastNode,
        _context: Context,
      ) => {
        if (node.type !== 'element' || !node.properties) {
          return;
        }

        const { src: url } = node.properties;
        const upload = await findOrCreateUploadWithUrl(client, url);

        return createNode('block', {
          item: buildBlockRecord({
            item_type: { id: modelIds.image_block.id, type: 'item_type' },
            image: {
              upload_id: upload.id,
            },
          }),
        });
      },
    },
  };
}
