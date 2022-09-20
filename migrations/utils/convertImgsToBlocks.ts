import {
  buildBlockRecord,
  Client,
  SimpleSchemaTypes,
} from "@datocms/cma-client-node";
import { visit, find, Node as UnistNode } from "unist-utils-core";
import findOrCreateUploadWithUrl from "./findOrCreateUploadWithUrl";

export default function convertImgsToBlocks(
  client: Client,
  modelIds: Record<string, SimpleSchemaTypes.ItemType>
): any {
  return {
    preprocess: (tree: UnistNode | UnistNode[]) => {
      const liftedImages = new WeakSet();
      const body = find(
        tree,
        (node: UnistNode) => node.tagName === "body" || node.type === "root"
      );

      visit(body, (node, index, parents) => {
        if (
          node.tagName !== "img" ||
          liftedImages.has(node) ||
          parents.length === 1
        ) {
          return;
        }

        const imgParent = parents[parents.length - 1];
        imgParent.children.splice(index, 1);

        let i = parents.length;
        let splitChildrenIndex = index;
        let childrenAfterSplitPoint: UnistNode[] = [];

        while (--i > 0) {
          const parent = parents[i];
          const parentsParent = parents[i - 1];

          childrenAfterSplitPoint = parent.children.splice(splitChildrenIndex);
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
              1
            );
          }
        }
      });
    },
    // now that images are top-level, convert them into `block` dast nodes
    handlers: {
      img: async (createNode: any, node: any, _context: any) => {
        const { src: url } = node.properties;
        const upload = await findOrCreateUploadWithUrl(client, url);

        return createNode("block", {
          item: buildBlockRecord({
            item_type: { id: modelIds.image_block.id, type: "item_type" },
            image: {
              upload_id: upload.id,
            },
          }),
        });
      },
    },
  };
}
