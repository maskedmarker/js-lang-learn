const productTree = {
    productId: "1",
    productName: "Product 1",
    children: [
        {
            productId: "1.1",
            productName: "Product 1.1",
            children: [
                {
                    productId: "1.1.1",
                    productName: "Product 1.1.1",
                }
            ]
        },
        {
            productId: "1.2",
            productName: "Product 1.2",
            children: []
        }
    ]
};

// =============================================================================
// predicate 抽象:
//   (node, depth) => boolean
//   返回 true 表示"这个节点应该被删除",递归会把它从父节点的 children 里挤掉。
//
// 函数本体只负责递归遍历结构,业务判定交给入参。
// =============================================================================
function prune(tree, predicate, depth = 0) {
    if (predicate(tree, depth)) {
        return null;
    }
    return {
        ...tree,
        children: (tree.children ?? [])
            .map(child => prune(child, predicate, depth + 1))
            .filter(Boolean),
    };
}

// --- 三种业务规则示例 ---

// 规则 1(原版语义):删除没有子节点的节点
const isLeaf = (node) => !node.children?.length;
console.log('--- 1) 删除叶子节点 ---');
console.log(JSON.stringify(prune(productTree, isLeaf), null, 2));

// 规则 2:超过 2 层的深度节点都砍掉(把树截到第 2 层)
const tooDeep = (node, depth) => depth >= 2;
console.log('\n--- 2) 只保留 2 层 ---');
console.log(JSON.stringify(prune(productTree, tooDeep), null, 2));

// 规则 3:名字里包含 "1.2" 的砍掉(演示完全不同的语义)
const blacklist = (node) => node.productName?.includes('1.2');
console.log('\n--- 3) 名字带 "1.2" 的砍掉 ---');
console.log(JSON.stringify(prune(productTree, blacklist), null, 2));
