// 10-generator-function - 生成器函数(Generator Function)完全讲解
// 核心概念:暂停/恢复协议 / iterator / yield / for...of 消费 / 实战场景

const title = '10-generator-function - 生成器函数完全讲解';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 1. 为什么需要生成器:从"一次性"到"可暂停"执行
// =============================================================================
console.log('--- 1. 为什么需要生成器 ---');
console.log(`
  普通函数:调用 → 一次性跑到底 → 返回一个值
  生成器:调用 → 返回 generator 对象 → 每次 .next() 跑一段(到 yield 为止)

  生成器函数 4 个关键特征:
    1) 函数声明带 *: function* foo() {}
    2) 函数体内用 yield 暂停,产出值
    3) 调用 foo() 不执行函数体,返回一个 generator 对象
    4) generator 对象实现了 Symbol.iterator,可被 for...of 消费
`);
console.log('');

// =============================================================================
// 2. function* 声明语法(4 种写法)
// =============================================================================
console.log('--- 2. function* 声明语法 ---');
console.log('  写法 1:function declaration');
function* genDecl() {
  yield 1;
  yield 2;
}
console.log('    function* genDecl() { yield 1; yield 2; }');

console.log('\n  写法 2:function expression');
const genExpr = function* () {
  yield 'a';
  yield 'b';
};
console.log('    const genExpr = function*() { yield "a"; yield "b"; }');

console.log('\n  写法 3:对象方法简写');
const obj = {
  *method() {
    yield 10;
    yield 20;
  },
};
console.log('    const obj = { *method() { yield 10; yield 20; } }');

console.log('\n  写法 4:类方法');
class MyClass {
  *gen() {
    yield 'x';
    yield 'y';
  }
}
console.log('    class MyClass { *gen() { yield "x"; yield "y"; } }');
console.log(`
  注意:
    - * 是 function 关键字的一部分(不是函数名)
    - function* foo() {} 中,* 与 function 之间可以有空格
    - 生成器函数不能当构造函数,new 会报错
`);
console.log('');

// =============================================================================
// 3. 调用 ≠ 执行:generator 对象
// =============================================================================
console.log('--- 3. 调用 ≠ 执行:generator 对象 ---');
function* simple() {
  console.log('    [函数体执行] 跑到了 yield 1');
  yield 1;
  console.log('    [函数体执行] 跑到了 yield 2');
  yield 2;
  console.log('    [函数体执行] 跑完了,无 yield');
}
const g = simple();
console.log('  const g = simple();');
console.log('  typeof g:', typeof g);
console.log('  g.constructor.name:', g.constructor.name);
console.log('  g[Symbol.iterator] === g:', g[Symbol.iterator] === g);
console.log(`
  调用 simple() 时函数体一行都没跑!
  返回的是一个 generator 对象(也是 iterator,也是 iterable)。
  只有调用 g.next() 才会推进函数体。
`);
console.log('');

// =============================================================================
// 4. next() 协议:IteratorResult = { value, done }
// =============================================================================
console.log('--- 4. next() 协议 ---');
const g4 = simple();
console.log('  第一次 next():');
const r1 = g4.next();
console.log('    返回值:', r1, 'typeof:', typeof r1);
console.log('  第二次 next():');
const r2 = g4.next();
console.log('    返回值:', r2);
console.log('  第三次 next():');
const r3 = g4.next();
console.log('    返回值:', r3);
console.log('  第四次 next()(已结束):');
const r4 = g4.next();
console.log('    返回值:', r4);
console.log(`
  规则:
    - 每次 next() 从上次 yield 处继续,跑到下一个 yield
    - 跑到函数末尾:返回 { value: undefined, done: true }
    - 后续 next() 永远返回 { value: undefined, done: true }
    - IteratorResult 的 value 字段是 yield 后面的表达式值
`);
console.log('');

// =============================================================================
// 5. yield 表达式:产出值 + 接收 next() 入参
// =============================================================================
console.log('--- 5. yield 表达式:产出值 + 接收 next() 入参 ---');
function* echo() {
  const a = yield 'first';     // yield 表达式本身有值 = 外部 next() 传入的参数
  const b = yield 'second';
  const c = yield 'third';
  return [a, b, c];
}
console.log('  function* echo() { const a = yield "first"; ... }');
const eg = echo();
console.log('  eg.next("A"):', eg.next('A'));        // 第一个 next 的参数被丢弃(没有 yield 接收)
console.log('  eg.next("B"):', eg.next('B'));        // a = "B"
console.log('  eg.next("C"):', eg.next('C'));        // b = "C"
console.log('  eg.next("D"):', eg.next('D'));        // c = "D",return [B,C,D]
console.log(`
  双向通信:
    - yield 产出值(IteratorResult.value)
    - 上一次 yield 的"值" = 下一次 next(x) 的 x
    - 第一次 next() 的参数被丢弃(没有 yield 接收它)
`);
console.log('');

// =============================================================================
// 6. yield* 委托:把另一个 iterable 依次产出
// =============================================================================
console.log('--- 6. yield* 委托 ---');
function* genA() {
  yield 1;
  yield 2;
}
function* genB() {
  yield* genA();      // 委托给 genA,把它每个值依次产出
  yield 3;
  yield 4;
}
function* genC() {
  yield* [10, 20, 30]; // 也能委托给普通 iterable(数组/字符串/Set/Map)
  yield 40;
}
console.log('  [...genB()]:', [...genB()]);
console.log('  [...genC()]:', [...genC()]);
console.log(`
  yield* 后面可以是任意 iterable:generator / 数组 / 字符串 / Set / Map。
  返回值是右侧 iterable 最后一个 value(若 done 也是最后一个 done 的 value)。
`);
console.log('');

// =============================================================================
// 7. return 提前终止
// =============================================================================
console.log('--- 7. return 提前终止 ---');
function* withReturn() {
  yield 1;
  yield 2;
  return 'finished';     // ← 显式 return 会让 done: true,value 是 return 的值
  yield 3;                // ← 永远不会执行
}
console.log('  [...withReturn()]:', [...withReturn()]);
console.log(`
  显式 return 后:
    - 后续 yield 不再执行
    - for...of 不会消费 return 的值
    - 但手动 .next() 能拿到 { value: "finished", done: true }
`);
console.log('');

// =============================================================================
// 8. throw():从外部向生成器抛异常
// =============================================================================
console.log('--- 8. throw():从外部向生成器抛异常 ---');
function* canThrow() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log(`    [生成器内部] 捕获到异常: ${e.message}`);
    yield 'recovered';
  }
  yield 3;
}
const tg = canThrow();
console.log('  tg.next():', tg.next());
console.log('  tg.throw(new Error("boom")):', tg.throw(new Error('boom')));
console.log('  tg.next():', tg.next());
console.log(`
  用法:从外部把异常"喂"进生成器,适合异步流程控制(已被 async/await 替代)。
  若生成器没 try/catch,throw 会冒泡出来。
`);
console.log('');

// =============================================================================
// 9. return():从外部强制结束
// =============================================================================
console.log('--- 9. return():从外部强制结束 ---');
function* endless() {
  while (true) yield Math.random();
}
const eg2 = endless();
console.log('  eg2.next():', eg2.next());
console.log('  eg2.next():', eg2.next());
console.log('  eg2.return("done!"):', eg2.return('done!'));
console.log('  eg2.next():', eg2.next());
console.log(`
  外部 return() 强制把生成器置为 done 状态。
  替代了 for...of break 的内部实现:break → iter.return()。
  finally 块仍会执行(类似 try/finally 的资源清理)。
`);
console.log('');

// =============================================================================
// 10. for...of 消费生成器(最常用)
// =============================================================================
console.log('--- 10. for...of 消费生成器 ---');
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
console.log('  function* range(0, 10, 2):');
for (const n of range(0, 10, 2)) {
  console.log(`    ${n}`);
}
console.log(`
  等价于 Array.from(range(0, 10, 2)) → [0, 2, 4, 6, 8]
  但 range 不一次性分配数组,惰性产出,内存友好。
`);
console.log('');

// =============================================================================
// 11. 无限序列:用 break 优雅中断
// =============================================================================
console.log('--- 11. 无限序列 + break ---');
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const fibs = [];
for (const f of fibonacci()) {
  fibs.push(f);
  if (fibs.length === 10) break;     // ← break 触发 iter.return(),生成器清理
}
console.log('  Fibonacci 前 10 项:', fibs);
console.log(`
  while(true) 不怕死循环:yield 暂停 + for...of 自动 next() + break 终止。
  这是普通函数写不出来的"懒加载无限流"。
`);
console.log('');

// =============================================================================
// 12. 对象实现 Symbol.iterator(对比:让任意对象可迭代)
// =============================================================================
console.log('--- 12. 任意对象可迭代(用 generator) ---');
const rangeLike = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {                  // ← 简写:generator 当迭代器方法
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  },
};
console.log('  rangeLike = { from:1, to:5, *[Symbol.iterator]() {...} }');
console.log('  [...rangeLike]:', [...rangeLike]);
console.log('  for (const n of rangeLike):');
for (const n of rangeLike) {
  console.log(`    ${n}`);
}
console.log(`
  任何对象只要实现 [Symbol.iterator](返回带 next 的对象)就变成 iterable。
  generator 自动提供 next(),所以 * [Symbol.iterator]() 是最简洁写法。
`);
console.log('');

// =============================================================================
// 13. 实战场景 1:手写 Array.prototype.flat(递归转生成器)
// =============================================================================
console.log('--- 13. 实战:手写 flat 用生成器 ---');
function* flatGen(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatGen(item);     // 递归 + yield* 委托
    } else {
      yield item;
    }
  }
}
const nested = [1, [2, 3], [4, [5, 6, [7, 8]]]];
console.log('  nested = [1, [2, 3], [4, [5, 6, [7, 8]]]]');
console.log('  [...flatGen(nested)]:', [...flatGen(nested)]);
console.log(`
  递归 + yield* 让深度优先的扁平化变成惰性序列。
  (这个比 Array.prototype.flat 更通用,支持任意深度且惰性)
`);
console.log('');

// =============================================================================
// 14. 实战场景 2:ID 生成器 / 状态机
// =============================================================================
console.log('--- 14. 实战:ID 生成器 ---');
function* idMaker(prefix = 'ID') {
  let n = 0;
  while (true) {
    yield `${prefix}-${++n}`;
  }
}
const ids = idMaker('USER');
console.log('  idMaker("USER") 前 5 个:');
for (let i = 0; i < 5; i++) {
  console.log(`    ${ids.next().value}`);
}
console.log(`
  优势:状态(n)封闭在生成器内部,外部不污染全局变量。
       多次调用 idMaker() 得到独立计数器。
`);
console.log('');

// =============================================================================
// 15. 实战场景 3:分页拉取(数据流)
// =============================================================================
console.log('--- 15. 实战:分页拉取(伪代码) ---');
async function fetchPage(page) {
  // 模拟接口
  await new Promise(r => setTimeout(r, 10));
  return {
    items: Array.from({ length: 3 }, (_, i) => `item-${page * 3 + i + 1}`),
    hasMore: page < 2,                  // 只有 3 页
  };
}
async function* paginate(fetchPage) {
  let page = 0;
  while (true) {
    const { items, hasMore } = await fetchPage(page++);
    if (items.length === 0) return;
    yield* items;
    if (!hasMore) return;
  }
}
console.log('  异步分页(3 页,每页 3 项):');
const collected = [];
for await (const item of paginate(fetchPage)) {
  collected.push(item);
  console.log(`    ${item}`);
}
console.log('  全部:', collected);
console.log(`
  async function* + for await...of 组合,处理"流式数据"的标配。
  跟分页/分块/事件流配合,避免一次性加载大对象。
`);
console.log('');

// =============================================================================
// 16. 实战场景 4:Saga 风格的中间步骤(已被 async/await 取代)
// =============================================================================
console.log('--- 16. 旧式 Saga 模式(对比 async/await) ---');
function* saga() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  const c = yield Promise.resolve(3);
  return a + b + c;
}

// 旧式 runner:把 yield 出来的 Promise 跑完,再 next(结果) 喂回去
function run(genFn) {
  const it = genFn();
  return new Promise((resolve, reject) => {
    function step(value) {
      const { value: v, done } = it.next(value);
      if (done) return resolve(v);
      Promise.resolve(v).then(step, (err) => it.throw(err));
    }
    step(undefined);
  });
}
run(saga).then((sum) => {
  console.log(`  run(saga) 旧式 runner 结果: ${sum} (= 1+2+3)`);
  console.log(`
  历史上用 generator 模拟 async/await(2014 年)。
  现在直接写 async function,生成器主要用于:
    - 惰性序列(Fibonacci/Range/无限流)
    - 状态机(内部状态封闭)
    - 自定义迭代器(* [Symbol.iterator])
    - 异步流(async function* + for await...of)
  `);

  // =============================================================================
  // 17. 常见坑汇总
  // =============================================================================
  console.log('--- 17. 常见坑汇总 ---');
  console.log(`
  1) 调用生成器函数不执行函数体:
       const g = foo();   // 函数体一行没跑
       g.next();          // 才推进

  2) 第一次 next() 的参数被丢弃:
       function* g() { const x = yield 1; }
       g.next('A');       // 'A' 被丢弃,x 仍是 undefined(因为没有 yield 接收它)
       g.next('B');       // x = 'B'

  3) for...of 不消费 return 的值:
       function* g() { yield 1; return 2; }
       [...g()]           // [1](不包含 2)
       g.next()           // { value: 1, done: false }
       g.next()           // { value: 2, done: true }

  4) 不能用 new 调用生成器:
       new (function*(){})()   // TypeError

  5) 闭包陷阱:同一个生成器实例只能消费一次:
       const g = foo();
       [...g];   // 拿走了所有值
       [...g];   // 空数组(已经 done 了)
       // 想要多次就每次调 foo() 拿新实例

  6) finally 在 return() / break 时仍执行(资源清理):
       function* g() {
         try { yield 1; } finally { console.log('cleanup'); }
       }
       const it = g();
       it.next();
       it.return();   // 打印 cleanup

  7) 性能:对一次性数据,生成器 + spread 比直接数组慢。
       简单遍历用 forEach / map,只有"惰性/无限/状态"需求才用 generator。
  `);

  // =============================================================================
  // 18. 速查表
  // =============================================================================
  console.log('--- 18. 速查表 ---');
  console.log(`
  ┌─────────────────────────┬──────────────────────────────────────────┐
  │ 语法                    │ 含义                                     │
  ├─────────────────────────┼──────────────────────────────────────────┤
  │ function* foo() {}      │ 声明生成器函数                           │
  │ yield expr              │ 暂停,产出 expr 作为 next().value        │
  │ yield* iterable         │ 委托,把 iterable 依次产出              │
  │ return value            │ 终止,value 是返回值(可被 next 拿到)     │
  ├─────────────────────────┼──────────────────────────────────────────┤
  │ it.next(x)              │ 推进;x 作为"上一个 yield 的返回值"       │
  │ it.return(x)            │ 强制结束;x 作为 IteratorResult.value    │
  │ it.throw(err)           │ 在暂停处抛异常(可被内部 try/catch 捕获)  │
  ├─────────────────────────┼──────────────────────────────────────────┤
  │ for (const v of gen)    │ 同步消费,自动 next,break → return()     │
  │ for await (const v of)  │ 异步消费(async function* 才能用)         │
  │ [...gen]                │ 一次性收集成数组                         │
  └─────────────────────────┴──────────────────────────────────────────┘
  `);

  console.log('\n=== ' + title + ' 结束 ===');
});
