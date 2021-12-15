const { buildModularBlock } = require('datocms-client');
const { visit, find } = require('unist-utils-core');
const findOrCreateUploadWithUrl = require('./findOrCreateUploadWithUrl');

// In dast format, images become custom `block` nodes, but these are only allowed inside of
// `root` nodes, while in HTML we might find them... everywhere.

module.exports = (client, modelIds) => ({
  /*
   * this code modifies the original HTML moving images up to the root of the document.
   * in the process, it splits all the parents, so this:
   *
   * ```html
   * <ul>
   *   <li>item 1</li>
   *   <li><div><img src="./img.png"></div></li>
   *   <li>item 2</li>
   * </ul>
   * ```
   *
   * Becomes this:
   *
   * ```html
   * <ul>
   *   <li>item 1</li>
   * </ul>
   * <img src="./img.png">
   * <ul>
   *   <li>item 2</li>
   * </ul>
   * ```
   */

  preprocess: (tree) => {
    const liftedImages = new WeakSet();
    const body = find(
      tree,
      (node) => node.tagName === 'body' || node.type === 'root',
    );

    visit(body, (node, index, parents) => {
      if (
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
      let childrenAfterSplitPoint = [];

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
            1,
          );
        }
      }
    });
  },
  // now that images are top-level, convert them into `block` dast nodes
  handlers: {
    img: async (createNode, node, context) => {
      const { src: url } = node.properties;
      const upload = await findOrCreateUploadWithUrl(client, url);

      return createNode('block', {
        item: buildModularBlock({
          image: {
            uploadId: upload.id,
          },
          itemType: modelIds.image_block.id,
        }),
      });
    },
  },
});
