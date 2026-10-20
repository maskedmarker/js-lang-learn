// 遍历数组
const title = '90 - 遍历数组';
console.log('=== ' + title + ' ===');
console.log('');


const productTree = [
     {
          productId: '1',
          productName: 'Product 1',
          children: [
               {
                    productId: '1-1',
                    productName: 'Product 1-1',
                    children: [
                         {
                              productId: '1-1-1',
                              productName: 'Product 1-1-1',
                              children: []
                         }
                    ]
               },
               {
                    productId: '1-2',
                    productName: 'Product 1-2',
                    children: []
               }
          ]
     },
     {
          productId: '2',
          productName: 'Product 2',
          children: []
     }
];


console.log('==============自底向上剪枝=====================');
/**
 * 自底向上过滤并剪枝：
 * 1. 先递归过滤子节点；
 * 2. 不满足条件的节点清除（其子节点一并丢弃，不上提）；
 * 3. 原本有子节点的节点，过滤后变空了也清除（剪掉空分支）。
 * @returns 处理后的节点，或 null（被清除）
 */
function handleNode(node, filterFn) {
    // 1. 先自底向上过滤子节点
    const childNodes = [];
    const hasChildren = node.children && node.children.length > 0; // 记录"原本"是否有子节点
    if (hasChildren) {
        for (const child of node.children) {
            const tmp = handleNode(child, filterFn);
            if (tmp !== null) {
                childNodes.push(tmp);
            }
        }
    }

    // 2. 自身不满足条件 → 清除（子节点一并丢弃，不上提）
    if (!filterFn(node)) {
        return null;
    }

    // 3. 原本有子节点，但过滤后变空了 → 剪掉这个空分支
    if (hasChildren && childNodes.length === 0) {
        return null;
    }

    // 4. 保留
    return { ...node, children: childNodes };
}

function handleForest(arr, filterFn) {
    const result = [];
    for (const root of arr) {
        const tmp = handleNode(root, filterFn);
        if (tmp !== null) {
            result.push(tmp);
        }
    }
    return result;
}

let result = handleForest(productTree, (node) => {
     // 示例过滤条件：只保留产品名称包含 "1" 的节点
     return node.productName.includes('1');
});
console.log('过滤后的结果:', "\r\n", JSON.stringify(result, null, 2));