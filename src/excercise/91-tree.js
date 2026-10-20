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

// 将没有子节点的节点删除
function removeEmptyNodes(tree) {
    if (!tree.children?.length) {
        return null;
    }
    return {
        ...tree,
        children: tree.children.map(removeEmptyNodes).filter(Boolean)
    };
}

console.log(JSON.stringify(removeEmptyNodes(productTree), null, 2));
