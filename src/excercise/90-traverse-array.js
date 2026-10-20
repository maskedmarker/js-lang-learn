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

console.log('productTree:', "\r\n", JSON.stringify(productTree, null, 2));

console.log('============== 多根树结构的数组 =====================');
function traverseArray(arr) {
     for (const root of arr) {
          traverNode(root);
     }
}

function traverNode(node) {
     if (node.children && node.children.length > 0) {
          for (const child of node.children) {
               traverNode(child);
          }
     }
     console.log('node.productId:', node.productId);
}

console.log('遍历时经历的节点:');
traverseArray(productTree);

console.log('==============创建一个虚拟的根节点=====================');
function traverseArray2(arr) {
     // 创建一个虚拟的根节点，将数组作为其子节点,这样就可以将多根树结构的数组转换为单根树结构
     const virtualRoot = {
          productId: '0',
          productName: 'Virtual Root',
          children: arr
     };
     traverNode(virtualRoot);
}
console.log('遍历时经历的节点:');
traverseArray2(productTree);


console.log('==============「自顶向下」树过滤=====================');
// 「自顶向下」树过滤：父节点不满足条件时，整棵子树一起丢弃；满足时才继续向下过滤子节点
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



/**
 * 过滤掉不满足条件的节点
 * @param  node 当前节点
 * @param  filterFn 过滤函数，返回false表示节点不满足条件需要清除掉
 * @returns 返回处理后的节点
 */
function handleNode(node, filterFn) {
    if (!filterFn(node)) {
        return null;
    }
    const childNodes = [];
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const tmp = handleNode(child, filterFn);
            if (tmp !== null) {
                childNodes.push(tmp);
            }
        }
    }
    return { ...node, children: childNodes };  // 展开 node，不是 filterFn 的返回值
}


let result = handleForest(productTree, (node) => {
     // 示例过滤条件：只保留产品名称包含 "1" 的节点
     return node.productName.includes('1');
});
console.log('过滤后的结果:', "\r\n", JSON.stringify(result, null, 2));