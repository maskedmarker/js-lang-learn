// 05 - 对象与数组
// 字面量、解构、扩展运算、可选链、空值合并

const title = '05 - 对象与数组';
console.log('=== ' + title + ' ===');
console.log('');



// ========== 1. 数组常用方法 ==========
console.log('--- 1. 数组方法 ---');
const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

console.log('原数组:', nums);
console.log('去重:', [...new Set(nums)]);
console.log('排序:', [...nums].sort((a, b) => a - b));    // 数字排序要传比较函数
console.log('反转:', [...nums].reverse());
console.log('包含 4:', nums.includes(4));
console.log('第一个 5 的索引:', nums.indexOf(5));
console.log('最后一个 5 的索引:', nums.lastIndexOf(5));
console.log('填充 0:', [1, 2, 3, 4].fill(0, 1, 3));        // [1, 0, 0, 4]

// flat: 扁平化
const nested = [1, [2, [3, [4]]]];
console.log('flat(Infinity):', nested.flat(Infinity));

// Array.from
console.log('Array.from("abc"):', Array.from('abc'));
console.log('Array.from({length:3}, (_, i) => i*2):', Array.from({ length: 3 }, (_, i) => i * 2));
console.log('');

// ========== 2. Map 与 Set ==========
console.log('--- 2. Map & Set ---');
const map = new Map();
map.set('name', '张三');
map.set('age', 28);
console.log('Map:', map.get('name'), map.get('age'));
console.log('Map 大小:', map.size);
console.log('Map keys:', [...map.keys()]);

const set = new Set([1, 2, 3, 3, 4]);
console.log('Set 去重:', [...set]);
console.log('Set 包含 3:', set.has(3));
console.log('');

