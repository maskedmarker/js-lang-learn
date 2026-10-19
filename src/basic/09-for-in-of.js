// 09-for-in-of - for...in / for...of 完全讲解
// 核心概念:可枚举属性 / Symbol.iterator / 迭代器协议

const title = '09-for-in-of - for...in / for...of 完全讲解';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 1. for...in 基础:遍历对象的可枚举属性(key)
// =============================================================================
console.log('--- 1. for...in 基础 ---');
const person = {
  name: 'Alice',
  age: 30,
  city: 'Beijing',
};
console.log('  对象:', person);
console.log('  for (key in obj) 遍历:');
for (const key in person) {
  console.log(`    key="${key}", value=${person[key]}`);
}
console.log(`
  注意:key 是字符串,不是 number!
  'name' / 'age' / 'city' —— 即使数组也如此。
`);
console.log('');

// =============================================================================
// 2. for...in 遍历顺序
// =============================================================================
console.log('--- 2. for...in 遍历顺序 ---');
const orderTest = {
  b: 1,
  10: 2,
  a: 3,
  2: 4,
  c: 5,
  1: 6,
};
console.log('  对象(字面量顺序):b / 10 / a / 2 / c / 1');
console.log('  for...in 实际顺序:');
for (const k in orderTest) {
  console.log(`    "${k}" => ${orderTest[k]}`);
}
console.log(`
  规则:
    1) 整数键(integer index)按数值升序: 1, 2, 10
    2) 字符串键按插入顺序: b, a, c
    3) Symbol 键跳过(for...in 不可见 Symbol)
  对象键是字符串,'10' 不是整数,所以按插入顺序。
`);
console.log('');

// =============================================================================
// 3. for...in 会遍历继承的属性(重要坑!)
// =============================================================================
console.log('--- 3. for...in 会遍历继承的属性 ---');
const parent = { inherited: 'from parent', parentKey: 'parentValue' };
const child = Object.create(parent);  // child 的原型是 parent
child.own = 'own property';
child.another = 'another own';
console.log('  parent:', parent);
console.log('  child = Object.create(parent), child.own / child.another');
console.log('  child.hasOwnProperty("own"):', child.hasOwnProperty('own'));
console.log('  child.hasOwnProperty("inherited"):', child.hasOwnProperty('inherited'));
console.log('  child["inherited"]:', child['inherited']);

console.log('\n  不加 hasOwnProperty (遍历所有属性,包括继承的):');
for (const k in child) {
  console.log(`    "${k}" => ${child[k]}`);
}

console.log('\n  加 hasOwnProperty (只遍历自有属性):');
for (const k in child) {
  if (Object.prototype.hasOwnProperty.call(child, k)) {
    console.log(`    "${k}" => ${child[k]}`);
  }
}
console.log(`
  结论:for...in 会遍历原型链上所有可枚举属性。
       生产中如果要遍历自有属性,务必配合 hasOwnProperty。
       更好的方式是 Object.keys(child) —— 只返回自有可枚举字符串键。
`);
console.log('');

// =============================================================================
// 4. for...in vs Object.keys() / Object.entries()
// =============================================================================
console.log('--- 4. for...in vs Object.keys() ---');
console.log('  Object.keys(person):', Object.keys(person));  // 自有字符串键
console.log('  for (const k in person):');
for (const k in person) { console.log(`    ${k}`); }
console.log(`  对纯对象(全是字符串键、没有整数索引):`);
console.log('    - Object.keys() 和 for...in 的输出顺序完全一致,都是插入顺序');
console.log('    - 差异点:for...in 会遍历原型链上的属性,Object.keys() 不会');
console.log('  对数组(整数索引是 0,1,2,...)才体现顺序规则:');
console.log('    整数索引按数值升序,然后才是字符串键按插入顺序(第 5 节演示)');
console.log('');

// =============================================================================
// 5. for...in 遍历数组(不推荐,但要知道)
// =============================================================================
console.log('\n--- 5. for...in 遍历数组(不推荐) ---');
const arr = ['a', 'b', 'c'];
arr.custom = 'extra';           // 数组是对象,也可以挂属性
arr[100] = 'z';                 // 稀疏数组的大索引
console.log('  arr:', arr);
console.log('  arr.length:', arr.length);
console.log('  for (const i in arr) 遍历:');
for (const i in arr) {
  console.log(`    index="${i}" (${typeof i}), value="${arr[i]}"`);
}
console.log(`
  遍历了所有可枚举属性:
    - 字符串索引:'0','1','2'
    - 稀疏索引:'100'
    - 自定义属性:'custom'
  不按顺序遍历整数索引(这里碰巧是顺序)。
  for...in 会跳过空槽(undefined)?
  是的,空槽(holes)不产生可枚举属性,所以被跳过。
`);
console.log('');

// =============================================================================
// 6. for...of 基础:遍历可迭代对象(值)
// =============================================================================
console.log('--- 6. for...of 基础 ---');
const fruits = ['apple', 'banana', 'cherry'];
console.log('  数组:', fruits);
console.log('  for (const item of array) 遍历值:');
for (const item of fruits) {
  console.log(`    ${item}`);
}
console.log('');

// =============================================================================
// 7. for...of 遍历字符串
// =============================================================================
console.log('--- 7. for...of 遍历字符串 ---');
const greeting = 'Hi';
console.log('  字符串:', greeting);
console.log('  for (const ch of str) 按码点遍历:');
for (const ch of greeting) {
  console.log(`    "${ch}"`);
}
console.log('  (正确处理 Emoji/四字节字符,不会像 [0] 索引那样拆开 surrogate pair)');
console.log('');

// =============================================================================
// 8. for...of 遍历 Set / Map
// =============================================================================
console.log('--- 8. for...of 遍历 Set / Map ---');
const set = new Set([10, 20, 30]);
console.log('  Set:', set);
console.log('  for (const v of set):');
for (const v of set) {
  console.log(`    ${v}`);
}

const map = new Map([['a', 1], ['b', 2]]);
console.log('\n  Map:', map);
console.log('  for (const [k,v] of map):');
for (const [k, v] of map) {
  console.log(`    key="${k}", value=${v}`);
}
console.log('');

// =============================================================================
// 9. for...of 遍历普通对象(默认不可迭代!)
// =============================================================================
console.log('--- 9. for...of 遍历普通对象(默认不可迭代) ---');
const obj = { x: 1, y: 2 };
console.log('  普通对象 obj:', obj);
try {
  for (const v of obj) {
    console.log(v);
  }
} catch (e) {
  console.log(`  TypeError: obj is not iterable (默认,普通对象没有 Symbol.iterator)`);
}
console.log(`
  解决方式:给对象加 Symbol.iterator,或者用 Object.keys() / Object.values() / Object.entries():
`);
console.log('  for (const v of Object.values(obj)):', [...Object.values(obj)]);
console.log('  for (const [k,v] of Object.entries(obj)):');
for (const [k, v] of Object.entries(obj)) {
  console.log(`    ${k}: ${v}`);
}
console.log('');

// =============================================================================
// 10. for...of + 解构
// =============================================================================
console.log('--- 10. for...of + 解构 ---');
const pairs = [['Alice', 30], ['Bob', 25], ['Carol', 35]];
console.log('  pairs:', pairs);
console.log('  for (const [name, age] of pairs):');
for (const [name, age] of pairs) {
  console.log(`    ${name} is ${age} years old`);
}

const people = [
  { name: 'Alice', scores: [90, 85] },
  { name: 'Bob',   scores: [70, 95] },
];
console.log('\n  people:', people);
console.log('  for (const { name, scores } of people):');
for (const { name, scores } of people) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  console.log(`    ${name}: avg=${avg.toFixed(1)}`);
}
console.log('');

// =============================================================================
// 11. for...of vs for...in 核心对比
// =============================================================================
console.log('--- 11. for...in vs for...of 核心对比 ---');
const demoArr = ['x', 'y', 'z'];
demoArr.foo = 'bar';  // 数组上挂属性
console.log('  demoArr = ["x","y","z"]; demoArr.foo = "bar"');
console.log('');

console.log('  for (const k in demoArr):');
for (const k in demoArr) {
  console.log(`    k="${k}", value="${demoArr[k]}"`);
}
console.log('  遍历了:"0","1","2"(索引),"foo"(自定义属性)');

console.log('\n  for (const v of demoArr):');
for (const v of demoArr) {
  console.log(`    ${v}`);
}
console.log('  只遍历值:"x","y","z"(忽略自定义属性 foo)');
console.log('');

// =============================================================================
// 12. break / continue 在两个循环中的行为
// =============================================================================
console.log('--- 12. break / continue 在两个循环中 ---');
const nums = [1, 2, 3, 4, 5];

console.log('  for...of + break:');
for (const n of nums) {
  if (n === 3) break;
  console.log(`    ${n}`);
}

console.log('  for...of + continue:');
for (const n of nums) {
  if (n === 3) continue;
  console.log(`    ${n}`);
}

console.log('  for...in + break:');
for (const k in nums) {
  if (k === '2') break;
  console.log(`    index="${k}", value="${nums[k]}"`);
}

console.log('  for...in + continue:');
for (const k in nums) {
  if (k === '2') continue;
  console.log(`    index="${k}", value="${nums[k]}"`);
}
console.log('  break / continue 两个循环都支持。');
console.log('');

// =============================================================================
// 13. 生成器(Generator)天然可迭代
// =============================================================================
console.log('--- 13. 生成器天然可迭代 ---');
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
console.log('  function* fibonacci(): 无限生成 Fibonacci');
const gen = fibonacci();
const first10 = [];
for (const f of gen) {
  first10.push(f);
  if (first10.length === 10) break;
}
console.log('  取前 10 项:', first10);
console.log('  (for...of 自动调用 generator 的 next(),遇到 yield 就暂停)');
console.log('');

// =============================================================================
// 14. for await...of (异步迭代)
// =============================================================================
console.log('--- 14. for await...of (异步迭代) ---');
async function asyncDemo() {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ];
  console.log('  for await (const v of promises):');
  let sum = 0;
  for await (const v of promises) {
    console.log(`    resolved: ${v}`);
    sum += v;
  }
  console.log(`  sum = ${sum}`);
}
asyncDemo().then(() => {
  console.log('  (for await 需要在 async 函数里使用)');
  console.log('');

  // =============================================================================
  // 15. 常见坑汇总
  // =============================================================================
  console.log('--- 15. 常见坑汇总 ---');
  console.log(`
  1) for...in 遍历顺序不保证一致性:
       - 对象键遍历顺序:数字键升序 → 字符串键插入顺序 → Symbol 跳过
       - 不同 JS 引擎曾有不同的枚举顺序(现代引擎基本统一)
       - 不要依赖 for...in 的特定顺序做业务逻辑

  2) for...in 会遍历继承的属性:
       - 原型链上的可枚举属性也会被遍历
       - 解决方案:Object.prototype.hasOwnProperty.call(obj, key)

  3) for...in 用于数组是反模式:
       - 会遍历自定义属性和稀疏索引
       - 会把整数键当字符串遍历("0" 而非 0)
       - 数组遍历用 for...of / forEach / for(i=0)

  4) 普通对象不是 iterable,for...of 会抛 TypeError:
       - obj[Symbol.iterator] 不存在
       - 解决:Object.values(obj) / Object.entries(obj) / 手动实现

  5) for...of 不能直接遍历普通对象:
       6) for...of 只读值,无法修改对象属性(用 traditional for 循环)
       7) for...of 对稀疏数组的处理:跳过长度的空洞,只遍历实际有值的索引
  `);

  // =============================================================================
  // 16. 记忆表
  // =============================================================================
  console.log('--- 16. 记忆表 ---');
  console.log(`
  ┌────────────────────┬─────────────────────┬──────────────────────────┐
  │                    │   for...in           │   for...of               │
  ├────────────────────┼─────────────────────┼──────────────────────────┤
  │ 遍历内容           │ 对象的可枚举属性名   │ 可迭代对象的值           │
  │                    │ (key,字符串)         │ (value)                  │
  ├────────────────────┼─────────────────────┼──────────────────────────┤
  │ 返回值类型         │ string (key)         │ 元素本身                 │
  ├────────────────────┼─────────────────────┼──────────────────────────┤
  │ 对象               │ ✓ 原生支持           │ ✗ 需要 Symbol.iterator  │
  │ 数组               │ ✓ (不推荐)           │ ✓ 推荐                  │
  │ 字符串             │ ✗                    │ ✓ (按码点)              │
  │ Set / Map          │ ✗                    │ ✓                       │
  │ Generator          │ ✗                    │ ✓                       │
  ├────────────────────┼─────────────────────┼──────────────────────────┤
  │ 继承属性           │ 会遍历               │ 不遍历(只当前对象)       │
  │ Symbol 属性        │ 跳过                 │ 跳过(除非显式处理)       │
  │ 自定义属性(数组)   │ 会遍历               │ 不遍历                  │
  │ 稀疏数组空洞       │ 跳过                 │ 跳过                    │
  ├────────────────────┼─────────────────────┼──────────────────────────┤
  │ break / continue   │ 支持                 │ 支持                    │
  │ 遍历顺序           │ 数字键升序→插入顺序   │ 按迭代器顺序            │
  └────────────────────┴─────────────────────┴──────────────────────────┘
  `);

  console.log('\n=== ' + title + ' 结束 ===');
});
