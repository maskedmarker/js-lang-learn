// 多层嵌套的数组,删除各个层级中符合条件的元素
const title = '90 - 多层嵌套的数组';
console.log('=== ' + title + ' ===');
console.log('');


console.log('--- 不会修改原数组 ---');
// 递归遍历数组
// filter()：删除当前层级中符合条件的元素
// map()：如果元素本身是数组，就递归处理它内部的元素

function removeElements(arr, predicate) {
    return arr
        .filter(item => Array.isArray(item) || predicate(item))
        .map(item =>
            Array.isArray(item) ? removeElements(item, predicate) : item
        );
}

const arr = [1, -2, [3, -4, [5, -6]], 7];
const result = removeElements(arr, (item) => item >= 0);
console.log(arr);
console.log(result); // [1, [3, [5]], 7]


console.log('--- 修改原数组 ---');
// 用递归配合 splice()
function removeElements2(arr, predicate) {
    // 从后往前遍历,因为splice()会修改原数组,如果从前往后遍历,会导致索引错乱
    for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];

        if (Array.isArray(item)) {
            removeElements2(item, predicate);
        } else if (predicate(item)) {
            arr.splice(i, 1);
        }
    }

    return arr;
}
const arr2 = [1, -2, [3, -4, [5, -6]], 7];
const result2 = removeElements2(arr2, (item) => item >= 0);
console.log(arr2);
console.log(result2); // [1, [3, [5]], 7]
console.log("arr2 === result2 ? ", arr2 === result2); // true