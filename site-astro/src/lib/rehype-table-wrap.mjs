/**
 * Markdown tables inside the reading column:
 *
 * - every table is wrapped in `<div class="table-wrap">`, which carries
 *   the rounded frame and scrolls sideways when a table is wider than
 *   the column;
 * - inline code in table cells gets a `<wbr>` after each `/`, so long
 *   import paths may break at a slash instead of mid-word or forcing
 *   the table to scroll.
 */
export default function rehypeTableWrap() {
    return (tree) => walk(tree);
}

function walk(node) {
    if (!node.children) return;
    node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
            breakPaths(child);
            return {
                type: 'element',
                tagName: 'div',
                properties: { className: ['table-wrap'] },
                children: [child],
            };
        }
        walk(child);
        return child;
    });
}

function breakPaths(node) {
    if (!node.children) return;
    for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName === 'code') {
            child.children = child.children.flatMap((text) => {
                if (text.type !== 'text' || !text.value.includes('/')) {
                    return [text];
                }
                const parts = text.value.split('/');
                return parts.flatMap((part, i) =>
                    i < parts.length - 1
                        ? [
                              { type: 'text', value: `${part}/` },
                              {
                                  type: 'element',
                                  tagName: 'wbr',
                                  properties: {},
                                  children: [],
                              },
                          ]
                        : [{ type: 'text', value: part }],
                );
            });
        } else {
            breakPaths(child);
        }
    }
}
