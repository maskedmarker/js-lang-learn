// 14-destructuring - 解构(Destructuring)完全讲解
// 核心概念:对象解构 / 数组解构 / 解构赋值 / 解构模式(pattern)

const title = '14-destructuring - 解构(Destructuring)完全讲解';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 1. 什么是解构:左侧不是变量名,而是"模式(pattern)"
// =============================================================================
console.log('--- 1. 什么是解构 ---');
console.log(`
  普通赋值:左侧一个变量,右侧值整体塞进去
    const name = user.name;

  解构:左侧是"模式(pattern)",与右侧结构逐层匹配后提取
    const { name, age } = user;      // 对象解构:按属性名匹配
    const [first, second] = list;    // 数组解构:按位置匹配

  两种形态:
    1) 解构声明:const / let / var 后面直接跟模式
       const { a } = obj;   let [x] = arr;
    2) 解构赋值:变量已存在,只赋值不声明
       ({ a } = obj);       [x] = arr;

  模式由这些元素任意组合:目标变量、默认值、重命名、rest、跳位、嵌套(见 2~6 节)。
`);
console.log('');

// =============================================================================
// 2. 对象解构(Object destructuring):按属性名匹配
// =============================================================================
console.log('--- 2. 对象解构:按属性名匹配 ---');
const user2 = { name: 'Alice', age: 18, city: 'Shanghai' };
const { age, name } = user2;
console.log('  const { age, name } = { name: "Alice", age: 18, city: "Shanghai" }');
console.log('  name =', name, ', age =', age, '(按属性名匹配,与书写顺序无关;变量名跟着属性名走)');
console.log('');

console.log('  2.1 重命名:语法是 { 原属性名: 新变量名 }');
const { name: userName21, age: userAge21 } = user2;
console.log('  const { name: userName21, age: userAge21 } = user2');
console.log('  userName21 =', userName21, ', userAge21 =', userAge21);
console.log('  注意方向:左边是要匹配的属性名 name,右边才是新变量名 userName21,别写反。');
console.log('');

console.log('  2.2 默认值:只有 undefined 才触发');
const { height22 = 170, name: alias22 = 'guest' } = user2;
console.log('  const { height22 = 170, name: alias22 = "guest" } = user2');
console.log('  height22 =', height22, '(没有该属性 → 用默认值 170)');
console.log('  alias22 =', alias22, '(name 有值 → 默认值不用)');
console.log('');

console.log('  2.3 rest:收集剩余属性(浅拷贝)');
const { city, ...others23 } = user2;
console.log('  const { city, ...others23 } = user2');
console.log('  city =', city, ', others23 =', others23);
const source23 = { a: 1, nested: { x: 1 } };
const { a: a23, ...rest23 } = source23;
rest23.nested.x = 999;
console.log('  rest23.nested.x = 999 之后, source23.nested.x =', source23.nested.x, '(共享引用 → 浅拷贝)');
const sym23 = Symbol('s');
const rich23 = { visible: 1, [sym23]: 2 };
Object.defineProperty(rich23, 'hidden', { value: 3, enumerable: false });
const { ...copied23 } = rich23;
console.log('  Object.keys(copied23) =', Object.keys(copied23), '(不可枚举的 hidden 被过滤)');
console.log('  copied23[sym23] =', copied23[sym23], '(Symbol 属性会被 rest 收集)');
console.log('');

console.log('  2.4 嵌套解构:逐层深入');
const data24 = { user: { profile: { nick: 'A', scores: [90, 95] } } };
const { user: { profile: { nick: nick24, scores: [firstScore24] } } } = data24;
console.log('  nick24 =', nick24, ', firstScore24 =', firstScore24);
console.log('  注意:只有叶子变量 nick24 / firstScore24 被声明,中间层 user / profile 不会成为变量。');
console.log('');

console.log('  2.5 计算属性名:属性名来自变量');
const key25 = 'name';
const { [key25]: value25 } = user2;
console.log('  const { [key25]: value25 } = user2 → value25 =', value25);
console.log('');

console.log('  2.6 坑:解构方法会丢掉 this');
const user26 = {
  name: 'Alice',
  greet() { return 'Hi, I am ' + this.name; },
};
const { greet: greet26 } = user26;
console.log('  user26.greet() =', user26.greet());
try {
  console.log('  greet26() =', greet26());
} catch (e) {
  console.log(`  解构出来的 greet26() → ${e.name}: ${e.message}`);
}
console.log('  原因:greet26 只是裸函数引用,this 不再是 user26(模块顶层是严格模式,this = undefined)。');
console.log('  修复:greet26.call(user26),或 const greet26 = user26.greet.bind(user26)。');
console.log('');

// =============================================================================
// 3. 数组解构(Array destructuring):按位置匹配
// =============================================================================
console.log('--- 3. 数组解构:按位置匹配 ---');
const [first3, second3, third3] = [1, 2, 3, 4];
console.log('  const [first3, second3, third3] = [1, 2, 3, 4]');
console.log('  first3 =', first3, ', second3 =', second3, ', third3 =', third3, '(多出的 4 被丢弃)');
console.log('');

console.log('  3.1 跳位(Elision):空位跳过不想取的元素');
const [, , third31] = [1, 2, 3, 4];
console.log('  const [, , third31] = [1, 2, 3, 4] → third31 =', third31);
console.log('');

console.log('  3.2 缺位 → undefined');
const [only32, missing32] = [1];
console.log('  const [only32, missing32] = [1] → only32 =', only32, ', missing32 =', missing32);
console.log('');

console.log('  3.3 默认值:undefined 时才生效,null 不会');
const [a33 = 10, b33 = 20, c33 = 30] = [1, undefined, null];
console.log('  const [a33 = 10, b33 = 20, c33 = 30] = [1, undefined, null]');
console.log('  a33 =', a33, '(有值 1 → 不用默认值)');
console.log('  b33 =', b33, '(undefined → 用默认值 20)');
console.log('  c33 =', c33, '(null ≠ undefined → 不用默认值!)');
console.log('');

console.log('  3.4 默认值是惰性求值:用不到就不执行');
let lazyCount34 = 0;
function expensive34() { lazyCount34++; return 999; }
const [x34, y34 = expensive34()] = [1, 2];
const [w34 = expensive34()] = [undefined];
console.log('  const [x34, y34 = expensive34()] = [1, 2] → y34 =', y34, '(y34 有值,没执行)');
console.log('  const [w34 = expensive34()] = [undefined] → w34 =', w34, '(缺位,执行了)');
console.log('  expensive34 总共执行', lazyCount34, '次');
console.log('');

console.log('  3.5 rest:收集剩余元素(必须放最后)');
const [head35, ...tail35] = [1, 2, 3, 4];
console.log('  const [head35, ...tail35] = [1, 2, 3, 4] → head35 =', head35, ', tail35 =', tail35);
console.log('');

console.log('  3.6 嵌套解构');
const [[x36, y36], z36] = [[1, 2], 3];
console.log('  const [[x36, y36], z36] = [[1, 2], 3] → x36 =', x36, ', y36 =', y36, ', z36 =', z36);
console.log('');

console.log('  3.7 右侧只要是"可迭代对象"都能解构');
const [str37a, str37b] = 'hi';                                   // 字符串
const [set37a, set37b] = new Set([10, 20]);                      // Set
const [[mapK37, mapV37]] = new Map([['key', 99]]);               // Map:元素是 [k, v] 对
function* gen37() { yield 'g1'; yield 'g2'; yield 'g3'; }
const [gen37a, ...gen37rest] = gen37();                          // 生成器
console.log('  字符串 →', str37a, str37b);
console.log('  Set    →', set37a, set37b);
console.log('  Map    →', mapK37, mapV37);
console.log('  生成器 →', gen37a, JSON.stringify(gen37rest));
console.log('');

console.log('  3.8 实战:正则 exec() 结果(第 0 个是完整匹配,通常跳掉)');
const [, year38, month38, day38] = /^(\d{4})-(\d{2})-(\d{2})$/.exec('2026-11-05');
console.log('  year38 =', year38, ', month38 =', month38, ', day38 =', day38);
console.log('');

// =============================================================================
// 4. 解构赋值(Destructuring assignment):给已有变量赋值
// =============================================================================
console.log('--- 4. 解构赋值:给已有变量赋值 ---');
console.log('  4.1 声明 vs 赋值');
let a41, b41;
({ a: a41, b: b41 } = { a: 1, b: 2 });
console.log('  let a41, b41; ({ a: a41, b: b41 } = { a: 1, b: 2 })');
console.log('  a41 =', a41, ', b41 =', b41);
console.log(`
  规则:变量已存在时只能用赋值式,再写 let/const 声明会 SyntaxError(重复声明,见坑6)。
  对象解构赋值必须整体加括号,否则开头的 { 被解析成代码块(见坑4)。
  数组解构赋值 [a, b] = arr 不需要括号。
`);
console.log('');

console.log('  4.2 交换变量:不需要临时变量');
let x42 = 1, y42 = 2;
[x42, y42] = [y42, x42];
console.log('  [x42, y42] = [y42, x42] → x42 =', x42, ', y42 =', y42);
console.log('');

console.log('  4.3 赋值给对象的既有属性');
const target43 = { x: 0, y: 0 };
({ x: target43.x, y: target43.y } = { x: 5, y: 6 });
console.log('  ({ x: target43.x, y: target43.y } = { x: 5, y: 6 }) → target43 =', target43);
console.log('');

console.log('  4.4 解构赋值表达式整体的值 = 右侧原值');
let a44, b44;
const result44 = ([a44, b44] = [1, 2]);
console.log('  const result44 = ([a44, b44] = [1, 2])');
console.log('  a44 =', a44, ', b44 =', b44, ', result44 =', result44);
console.log('');

// =============================================================================
// 5. 入参解构(Parameter destructuring):函数形参直接写模式
// =============================================================================
console.log('--- 5. 入参解构:函数形参直接写模式 ---');
function greet51({ name, age = 18 }) {
  console.log('    greet51 →', name, '今年', age, '岁');
}
greet51({ name: 'Alice' });
greet51({ name: 'Bob', age: 25 });
console.log('');

console.log('  5.1 必填陷阱:整体默认值兜底');
try {
  greet51();
} catch (e) {
  console.log(`  greet51() 不传参 → ${e.name}: ${e.message}`);
}
function greet52({ name, age = 18 } = {}) {
  console.log('    greet52 →', name, '今年', age, '岁');
}
greet52();
console.log(`
  区别:
    function f({ name = 'guest' } = {})      → 不传参 / 传 {} 都是 guest
    function f({ name } = { name: 'guest' }) → 只有"整个参数"为 undefined 才兜底,
                                               传 {} 时 name 仍是 undefined!
`);
console.log('');

console.log('  5.2 数组形参');
function sum53([a, b = 0]) {
  return a + b;
}
console.log('  sum53([1, 2]) =', sum53([1, 2]));
console.log('  sum53([5])    =', sum53([5]));
console.log('');

console.log('  5.3 实战:options 配置对象(最常见的用法)');
function request54(url, { method = 'GET', timeout = 3000, headers = {} } = {}) {
  console.log(`    request54 → ${method} ${url}, timeout=${timeout}ms, headers=${JSON.stringify(headers)}`);
}
request54('/api/users');
request54('/api/users', { method: 'POST' });
request54('/api/users', { timeout: 500, headers: { token: 'abc' } });
console.log(`
  好处:调用方只传关心的字段,其余走默认值。
  对比传统写法的一堆 if (opts && opts.method !== undefined) 判断,清爽得多。
`);
console.log('');

console.log('  5.4 解构 + rest 参数');
function log55(level, { name, ...rest55 }) {
  console.log('    log55 [', level, ']', name, rest55);
}
log55('info', { name: 'app', ip: '127.0.0.1', code: 200 });
console.log('');

// =============================================================================
// 6. 解构模式进阶:模式可以任意嵌套组合
// =============================================================================
console.log('--- 6. 解构模式进阶 ---');
console.log('  6.1 深层混合:对象套数组,数组套对象');
const api61 = {
  code: 200,
  data: {
    users: [
      { id: 1, name: 'Alice', roles: ['admin', 'editor'] },
    ],
  },
};
const { data: { users: [{ name: name61, roles: [firstRole61] }] } } = api61;
console.log('  name61 =', name61, ', firstRole61 =', firstRole61);
console.log('');

console.log('  6.2 多返回值:函数返回数组/对象,调用处解构');
function divmod62(a, b) {
  return [Math.floor(a / b), a % b];
}
const [quotient62, remainder62] = divmod62(10, 3);
console.log('  const [quotient62, remainder62] = divmod62(10, 3) →', quotient62, remainder62);
console.log('');

console.log('  6.3 for...of 循环里直接解构');
const scores63 = new Map([['Alice', 90], ['Bob', 85]]);
for (const [who63, score63] of scores63) {
  console.log('    ', who63, ':', score63);
}
console.log('');

// =============================================================================
// 7. 常见坑汇总
// =============================================================================
console.log('--- 7. 常见坑汇总 ---');
console.log('  坑1:右侧是 null / undefined → TypeError(仅这两个值)');
try { const { a } = null; } catch (e) { console.log(`    const { a } = null → ${e.name}`); }
try { const [x] = undefined; } catch (e) { console.log(`    const [x] = undefined → ${e.name}`); }
console.log('    其它原始类型会被装箱:const { length } = "hi" →', 'hi'.length);
console.log('');

console.log('  坑2:嵌套路径的中间层是 null / undefined → 一样抛错');
try {
  const { a: { b } } = { a: null };
} catch (e) {
  console.log(`    const { a: { b } } = { a: null } → ${e.name}`);
}
console.log('');

console.log('  坑3:默认值只在 undefined 时生效,null 不触发(见 2.2 / 3.3)');
console.log('');

console.log('  坑4:对象解构赋值忘记括号 → SyntaxError(语法错误要用 eval 隔离演示)');
try {
  eval('var tmp74 = 1; { tmp74 } = { tmp74: 2 };');
} catch (e) {
  console.log(`    { tmp74 } = obj 裸写 → ${e.name}`);
}
console.log('    开头的 { 被解析成代码块,后面接 = 就是语法错误。数组没有这个坑。');
console.log('');

console.log('  坑5:rest 必须放在最后(数组/对象都一样)');
try {
  eval('const [a75, ...rest75, b75] = [1, 2, 3];');
} catch (e) {
  console.log(`    const [a75, ...rest75, b75] = [...] → ${e.name}`);
}
console.log('');

console.log('  坑6:解构声明不能重复声明已有变量');
let a76 = 1;
try {
  eval('let a76 = 1; let { a76 } = { a76: 2 };');
} catch (e) {
  console.log(`    let a76 = 1; let { a76 } = { a76: 2 } → ${e.name}`);
}
console.log('    已有变量请改用赋值式:({ a76 } = { a76: 2 })');
console.log('');

console.log('  坑7:解构方法丢 this(见 2.6)');
console.log('');

console.log('  坑8:ASI —— 上一行没分号,本行以 [ 开头会被"接"上去');
try {
  eval(`
    let eA = 1, eB = 2;
    eA = eB + 0
    [eA, eB] = [10, 20]
  `);
} catch (e) {
  console.log(`    eA = eB + 0\n    [eA, eB] = [10, 20] → ${e.name}`);
}
console.log('    实际解析:let eA = 1, eB = 2; eA = eB + 0[eA, eB] = [10, 20]');
console.log('    解决:语句结尾写分号,或解构赋值行首别放 [。');
console.log('');

// =============================================================================
// 8. 速查表
// =============================================================================
console.log('--- 8. 速查表 ---');
console.log(`
  ┌──────────────────────────────┬───────────────────────────────────────────┐
  │ 场景                         │ 写法                                      │
  ├──────────────────────────────┼───────────────────────────────────────────┤
  │ 数组:按位置                  │ const [a, b] = [1, 2]                     │
  │ 数组:跳位                    │ const [, , c] = arr                       │
  │ 数组:默认值                  │ const [a = 1] = arr                       │
  │ 数组:rest 收集               │ const [head, ...tail] = arr               │
  │ 对象:按属性名                │ const { a, b } = obj                      │
  │ 对象:重命名                  │ const { a: x } = obj   // x = obj.a       │
  │ 对象:默认值                  │ const { a = 1 } = obj                     │
  │ 对象:重命名 + 默认值         │ const { a: x = 1 } = obj                  │
  │ 对象:rest 收集               │ const { a, ...others } = obj              │
  │ 嵌套                         │ const { a: { b }, c: [d] } = obj          │
  │ 赋值(变量已存在)             │ ({ a } = obj);   [a, b] = arr             │
  │ 交换                         │ [a, b] = [b, a]                           │
  │ 入参                         │ function f({ a, b = 1 } = {})            │
  │ for...of                     │ for (const [k, v] of map)                 │
  └──────────────────────────────┴───────────────────────────────────────────┘

  三条规则:
    1) 对象按"属性名"匹配,数组按"位置"匹配
    2) 默认值只在 undefined 时生效,null 不算
    3) 右侧是 null / undefined 直接 TypeError(嵌套的中间层也一样)
`);

console.log('\n=== ' + title + ' 结束 ===');
