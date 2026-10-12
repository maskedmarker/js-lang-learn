// 09-arrays - 数组方法专题 / flat() / flatMap()
// 单独建目录系统讲,避免在 05-objects-and-arrays.js 里把每个方法都一笔带过

const title = '09-arrays - 数组方法专题:flat() / flatMap()';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 基础:默认 depth=1 ==========
console.log('--- 1. 基础 (默认 depth=1) ---');
console.log('flat() 不传参 === flat(1),只拆一层');
console.log('  [1, [2, 3], [4, [5]]].flat():', [1, [2, 3], [4, [5]]].flat());
console.log('  [1, [2, 3], [4, [5]]].flat(1):', [1, [2, 3], [4, [5]]].flat(1));
console.log('  注意:第二层 [5] 还在,只拆了第一层');
console.log('');

// ========== 2. depth 参数:控制拆几层 ==========
console.log('--- 2. depth 控制拆几层 ---');
const deep = [1, [2, [3, [4, [5]]]]];
console.log('  原数组 deep:', JSON.stringify(deep));
console.log('  flat(0)  :', deep.flat(0), '  (0 层,完全不动)');
console.log('  flat(1)  :', deep.flat(1));
console.log('  flat(2)  :', deep.flat(2));
console.log('  flat(3)  :', deep.flat(3));
console.log('  flat(10) :', deep.flat(10), '  (超过实际深度也安全)');
console.log('  flat(-1) :', deep.flat(-1), '  (负数被视作 0,不拆)');
console.log('');

// ========== 3. flat(Infinity):任意深度全拍平 ==========
console.log('--- 3. flat(Infinity):任意深度全拍平 ---');
const messy = [1, [2, [3, [4, [5, [6, [7]]]]]]];
console.log('  messy.flat(Infinity):', messy.flat(Infinity));
console.log('  Infinity 必须字面量,不能用变量算出来的非有限值');
console.log('  有限小数也行,会被截断:', [1, [2, [3]]].flat(1.9), '  (1.9 → 1)');
console.log('');

// ========== 4. sparse array(稀疏数组 / 空槽) ==========
console.log('--- 4. 稀疏数组 sparse array:空槽会被压紧 ---');
// [1, , 3] 在数组字面量里写"留空"就是空槽,不是 undefined!
const sparse = [1, , 3];                  // length=3,索引 1 是 empty
console.log('  sparse:           ', sparse, '   length=', sparse.length);
console.log('  1 in sparse:      ', 1 in sparse, '   (空槽没有这个 key)');
console.log('  sparse[1]:        ', sparse[1], '   (读出来是 undefined,但性质和 undefined 不一样)');
console.log('  sparse.flat():    ', sparse.flat(), '   length=', sparse.flat().length);
console.log('  空槽被压紧!length 从 3 变 2');
console.log('');

// 4.1 对比:数组里包了稀疏数组,外层拆一层
const nestedSparse = [1, [2, , 4], 5];
console.log('  nestedSparse:      ', nestedSparse);
console.log('  nestedSparse.flat():', nestedSparse.flat(), ' length=', nestedSparse.flat().length);
console.log('  外层拆 1 层 + 内层空槽被压紧:从 5 项变 4 项');
console.log('');

// 4.2 重要对比:稀疏数组本身 vs 显式 undefined
const withUndef = [1, undefined, 3];
console.log('  [1, undefined, 3].flat():', withUndef.flat(), ' length=', withUndef.flat().length);
console.log('  [1, undefined, 3] 的 length:', withUndef.length, '(undefined 元素算一项,不会被去掉)');
console.log('  结论:flat 移除的是"空槽"(sparse holes),不是 undefined');
console.log('');

// ========== 5. 自动移除空槽的副作用 ==========
console.log('--- 5. flat 的"空槽 → 压紧"是 ES2019 规范保证 ---');
const arr = Array(5);                     // [empty × 5],纯空槽
console.log('  Array(5):         ', arr, ' length=', arr.length);
console.log('  Array(5).flat():  ', arr.flat(), ' length=', arr.flat().length);
console.log('  5 个空槽被全部压成 0 项');
// 实战中稀疏数组很少见,主要是 Array(n) / delete arr[i] / 大索引赋值 才会出现
const holey = [1, 2, 3];
delete holey[1];
console.log('  delete 后的 holey:', holey, ' 1 in:', 1 in holey);
console.log('  holey.flat():     ', holey.flat());
console.log('');

// ========== 6. 非数组元素原地保留 ==========
console.log('--- 6. 非数组元素原地保留 ---');
const mixed = [1, [2, 3], { a: 1 }, 'str', null, undefined, true, new Date(0)];
const flatted = mixed.flat();
console.log('  原  :', mixed);
console.log('  flat:', flatted);
// 浅引用检查:原数组里 [{a:1}] 这个对象,在 flat 后的数组里也能找到
// 关键:不是按下标找,而是按引用找
const sameRef = flatted.find(x => typeof x === 'object' && !(x instanceof Date) && x && x.a === 1);
console.log('  flatted 里 a===1 的对象 === mixed[2]?', sameRef === mixed[2], '(true = 浅引用保留)');
console.log('');

// ========== 7. flatMap:map + flat 一气呵成 ==========
console.log('--- 7. flatMap:等价于 map(...).flat(1),但只走一遍 ---');
const nums = [1, 2, 3, 4];
const doubled = nums.flatMap(x => [x, x * 10]);
console.log('  nums:', nums);
console.log('  flatMap(x => [x, x*10]):', doubled);
// 经典场景:把句子拆成单词(每个元素返回字符串数组 → 自动展平)
const sentences = ['Hello world', 'Good morning', 'Hi'];
const words = sentences.flatMap(s => s.split(' '));
console.log('  句子拆单词:', words);
// 经典场景:filter + map 合并(返回 [] 表示"过滤掉")
const filterAndMap = [1, 2, 3, 4, 5].flatMap(x => x % 2 === 0 ? [x * 100] : []);
console.log('  偶数 × 100,奇数过滤:', filterAndMap);
console.log('');

// 7.1 flatMap 永远只拆 1 层,不像 flat 可以传 depth
const fm = [1, 2].flatMap(x => [[x]]);
console.log('  flatMap(x => [[x]]) 永远只展 1 层:', fm, '(结果是嵌套数组)');
// 等价于 [...arr].map(...).flat(1)
console.log('');

// ========== 8. flat 本质:reduce + concat ==========
console.log('--- 8. flat 本质上就是 reduce + concat ---');
// 规范里 flat 的实现就是:
//   for each element: if isArray, concat, else push
// 下面写一个 polyfill 风格的自实现,看就懂
function myFlat(input, depth = 1) {
  return input.reduce((acc, cur) => {
    if (Array.isArray(cur) && depth > 0) {
      return acc.concat(myFlat(cur, depth - 1));
    }
    // 关键:reduce 默认会跳过空槽,所以"空槽被压紧"是天然行为
    // (reduce 不调用回调,acc.concat 也不会接收到那个位置)
    // 这里的 [cur] 是为了不破坏 undefined 元素(对照下一行)
    return acc.concat([cur]);
  }, []);
}
console.log('  myFlat([1,[2,[3,[4]]]], 1):', myFlat([1, [2, [3, [4]]]], 1));
console.log('  myFlat([1,[2,[3,[4]]]], 2):', myFlat([1, [2, [3, [4]]]], 2));
console.log('  myFlat([1,[2,[3,[4]]]]):', myFlat([1, [2, [3, [4]]]]));
console.log('  myFlat([1, , 3]):       ', myFlat([1, , 3]), '  (空槽在 reduce 里被跳过)');
console.log('  myFlat([1, undefined, 3]):', myFlat([1, undefined, 3]), '  (undefined 不被跳过)');
console.log('');

// ========== 9. 不修改原数组(返回新数组) ==========
console.log('--- 9. 不改原数组,返回新数组 ---');
const src = [1, [2, 3]];
const out = src.flat();
console.log('  src:    ', src, '  length=', src.length);
console.log('  out:    ', out, '  length=', out.length);
console.log('  src === out?', src === out, '  (新数组)');
out.push(999);
console.log('  out.push(999) 后 src:', src, '  (原数组没被影响)');
console.log('');

// ========== 10. flat 会"拆开"子数组,不保留子数组本身的引用 ==========
console.log('--- 10. flat 会逐个提取子数组的元素,不会保留子数组引用 ---');
const inner = [10, 20];
const wrap = [inner, 30];
const flat1 = wrap.flat();
console.log('  wrap:    ', wrap, '   (含 inner 引用)');
console.log('  flat1:   ', flat1, '(子数组被拆开了)');
console.log('  flat1 里能找到一个元素 === inner?', flat1.find(x => x === inner) === inner, '  (false:子数组被拆散,引用没了)');
console.log('  原因:flat 把 inner 里的元素 10/20 一个一个取出来,inner 这个引用本身没出现在结果里');

// 想"保留子数组引用"需要 flatMap 包一层
const flatMap1 = wrap.flatMap(x => [x]);
console.log('  wrap.flatMap(x => [x]):', flatMap1);
console.log('  flatMap1 里能找到 === inner?', flatMap1.find(x => x === inner) === inner, '  (true:引用被保留)');
console.log('');

// ========== 11. 实战:API 嵌套数据扁平化 ==========
console.log('--- 11. 实战:评论树 → 扁平评论列表 ---');
const commentTree = [
  {
    id: 1,
    text: '第一条评论',
    replies: [
      { id: 11, text: '1-1 回复', replies: [] },
      { id: 12, text: '1-2 回复', replies: [
        { id: 121, text: '1-2-1 回复', replies: [] },
      ]},
    ],
  },
  {
    id: 2,
    text: '第二条评论',
    replies: [
      { id: 21, text: '2-1 回复', replies: [] },
    ],
  },
  { id: 3, text: '第三条评论', replies: [] },
];
// 提取所有评论的 id + text,不管嵌套多深
const flatComments = commentTree.flatMap(c => [c, ...c.replies]).flat(Infinity);
console.log('  拍平后 (id,text):');
for (const c of flatComments) {
  console.log('   ', c.id, '|', c.text);
}
// 注意:上面的实现里把 comment 本身和 replies 一起 flatMap,
// 再用 flat(Infinity) 把深层 replies 也拍平
// (更严谨的实现应该递归,但 flat(Infinity) 一行搞定教学演示)
console.log('');

// 11.1 实战 2:打平 categories 得到所有叶子
const categories = [
  { name: '电子产品', children: [
    { name: '手机', children: [
      { name: 'iPhone', children: [] },
      { name: 'Android', children: [] },
    ]},
    { name: '电脑', children: [] },
  ]},
  { name: '服装', children: [
    { name: '男装', children: [] },
    { name: '女装', children: [] },
  ]},
];
const leafNames = categories.flatMap(c => [c, ...c.children]).flat(Infinity).map(c => c.name);
console.log('  分类叶子:', leafNames);
console.log('');

// ========== 12. 常见坑 ==========
console.log('--- 12. 常见坑汇总 ---');
console.log(`
  1) 默认只展 1 层,深层还在 → 想要全平用 flat(Infinity)
  2) sparse 空槽会被压紧(从 length 里去掉),与 undefined 行为不同
  3) flatMap 永远只展 1 层,无法传 depth
  4) flat 返回新数组,原数组不变(类似 map / filter)
  5) flat 会"拆散"子数组:子数组引用本身不会出现在结果里
     想保留子数组引用用 flatMap(x => [x])
  6) depth 不是整数会被截断,负数被视作 0
  7) Node 11+ / 主流浏览器都支持,极老环境需要 polyfill
  8) 不要用 flat 做深克隆(只浅),需要深克隆用 structuredClone()
`);
console.log('');

// ========== 13. 兼容性 ==========
console.log('--- 13. 兼容性 / 何时需要 polyfill ---');
console.log('  flat / flatMap 都在 ES2019 引入');
console.log('  Node 12+ 完全支持,Node 18+ 你用的版本肯定 OK');
console.log('  Chrome 69 / Firefox 62 / Safari 12 / Edge 79+ 原生支持');
console.log('  IE 全系不支持,需要 core-js / babel-polyfill');
console.log('');

console.log('=== ' + title + ' 结束 ===');
