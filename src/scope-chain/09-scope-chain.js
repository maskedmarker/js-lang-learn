// 09-scope-chain - 作用域与作用域链
// 核心概念:Execution Context / Lexical Environment / Scope Chain / Identifier Resolution

const title = '09-scope-chain - 作用域与作用域链';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 辅助:把一个 Environment Record 里所有的绑定打印出来(教学用)
// =============================================================================
function inspectEnv(env, label, visited = new WeakSet()) {
  if (!env || visited.has(env)) return;
  visited.add(env);
  const bindings = {};
  // Environment Record 的 bindings 是个 Map (规范层),遍历它
  const record = env.record;
  if (record && typeof record.forEach === 'function') {
    record.forEach((val, key) => { bindings[key] = val; });
  }
  console.log(`  ${label} { ${Object.keys(bindings).map(k => `${k}=${JSON.stringify(bindings[k])}`).join(', ') || '(empty)'} }`);
  if (env.outer) inspectEnv(env.outer, '  └ outer', visited);
}

// =============================================================================
// 1. 什么是作用域(Scope)?
// =============================================================================
console.log('--- 1. 什么是作用域 ---');
console.log(`
  作用域:一段代码中,变量(标识符)能被访问的区域。
  JavaScript 有 3 种作用域:
    - 全局作用域   最外层,代码任何地方都能访问
    - 函数作用域   function 内部创建的独立空间
    - 块级作用域   { } 创建 (let/const 专属)
`);
console.log('');

// =============================================================================
// 2. 全局作用域
// =============================================================================
console.log('--- 2. 全局作用域 ---');
// 在 Node ESM 顶层,这些变量挂在 module 顶层(不是真正的 global,类似全局)
// 真正的全局对象: globalThis (浏览器是 window)
const globalVar = 'I am in module scope (module-level)';
console.log('  globalThis:', typeof globalThis);  // Node 里是 {},有属性
console.log('  globalThis.Object:', typeof globalThis.Object); // function
console.log('');

// =============================================================================
// 3. 函数作用域
// =============================================================================
console.log('--- 3. 函数作用域 ---');
function outer() {
  const outerVar = 'I am from outer';
  console.log('  [outer] 可以访问:', outerVar);
  function inner() {
    const innerVar = 'I am from inner';
    console.log('  [inner] 可以访问:');
    console.log('    innerVar:', innerVar);
    console.log('    outerVar:', outerVar, '(从外层函数作用域拿到)');
    console.log('    globalVar:', globalVar, '(从更外层拿到)');
  }
  inner();
}
outer();
console.log('');

// =============================================================================
// 4. 块级作用域 { } (let / const)
// =============================================================================
console.log('--- 4. 块级作用域 { } (let / const) ---');
// var 不遵守块级作用域,所以 {
if (true) {
  var varInBlock = 'var ignores block';
  let  letInBlock = 'let respects block';
  const constInBlock = 'const respects block';
}
console.log('  var in { } 泄漏到函数/模块级:', varInBlock);
console.log('  let in { } 不泄漏:');
try {
  console.log(' ', letInBlock);
} catch (e) {
  console.log('   ReferenceError: letInBlock is not defined (正确!)');
}
try {
  console.log(' ', constInBlock);
} catch (e) {
  console.log('   ReferenceError: constInBlock is not defined (正确!)');
}
console.log('');

// =============================================================================
// 5. 作用域链(Scope Chain) 原理
// =============================================================================
console.log('--- 5. 作用域链原理 ---');
console.log(`
  当 JavaScript 执行一段代码时,会创建 Execution Context(执行上下文):
    EC = {
      LexicalEnvironment: {   // 词法环境
        EnvironmentRecord: { /* 当前作用域的变量 */ },
        outer: <上层词法环境>   // 指向外部作用域,形成链
      },
      VariableEnvironment: { ... },  // 同样是词法环境,专门存 var 声明
      ThisBinding: ...
    }

  作用域链 = 从当前 EC 的 LexicalEnvironment 沿 .outer 一路向上的引用链

  查找标识符时:
    1) 先在当前 EnvironmentRecord 里找
    2) 没找到 → 沿 .outer 去上一层找
    3) 直到全局 LexicalEnvironment (outer === null)
    4) 找不到 → ReferenceError
`);
console.log('');

// =============================================================================
// 6. 嵌套函数的 scope chain 构造过程
// =============================================================================
console.log('--- 6. 嵌套函数的 scope chain 构造 ---');
const topLevel = 'MODULE';
function makeMultiplier(factor) {
  const multiplier = factor;
  function multiply(num) {
    const product = num * multiplier;  // num 是局部,multiplier 从上层拿
    return product;
  }
  // 演示 scope chain:在 multiply 内部观测
  console.log('  [makeMultiplier] outer 的 LexicalEnvironment:');
  console.log('    multiplier:', multiplier, '(makeMultiplier 局部)');
  console.log('    factor:    ', factor, '(参数,等价于 makeMultiplier 局部)');
  console.log('    topLevel:  ', topLevel, '(从 module scope 拿)');
  console.log('  [multiply] 内的 scope chain(从内向外):');
  console.log('    num       :', '(调用时传入)');
  console.log('    multiplier:', '(从 makeMultiplier 的 scope 拿)');
  console.log('    topLevel  :', '(从 module scope 拿)');
  // 直接调用 multiply 验证
  return multiply;
}
const double = makeMultiplier(2);
console.log('  makeMultiplier(2) 返回 multiply(10):', double(10));
console.log('  makeMultiplier(3) 返回 multiply(10):', makeMultiplier(3)(10));
console.log('');

// =============================================================================
// 7. 闭包 = 函数 + 携带的 scope chain
// =============================================================================
console.log('--- 7. 闭包 = 函数 + 携带的 scope chain ---');
function createCounter() {
  let count = 0;           // 被内部函数引用,scope chain 保持引用 → 不被 GC 回收
  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    value()     { return count; },
  };
}
const counter = createCounter();
console.log('  正常调用:');
console.log('    increment():', counter.increment(), '(count=1)');
console.log('    increment():', counter.increment(), '(count=2)');
console.log('    decrement():', counter.decrement(), '(count=1)');
console.log('    value():', counter.value(), '(count=1)');
console.log(`
  闭包的工作原理:
    createCounter() 执行完毕后,其 Execution Context 本该出栈销毁,
    但内部函数(increment/decrement/value) 的 [[Scope]] 仍然持有
    指向 createCounter 的 LexicalEnvironment 的引用,
    所以 count 变量一直活着。
`);
console.log('');

// =============================================================================
// 8. 循环中的闭包经典陷阱
// =============================================================================
console.log('--- 8. 循环中的闭包经典陷阱(var 版本) ---');
console.log('  var 版本:所有闭包共享同一个 i');
const varFuncs = [];
for (var i = 0; i < 3; i++) {
  varFuncs.push(function() { return i; });
}
console.log('    执行 varFuncs[0]():', varFuncs[0](), '(期望:0,实际:3)');
console.log('    执行 varFuncs[1]():', varFuncs[1](), '(期望:1,实际:3)');
console.log('    执行 varFuncs[2]():', varFuncs[2](), '(期望:2,实际:3)');
console.log('  原因:var i 在循环结束后还存在,所有闭包共享同一个 i');

console.log('\n  let 版本:每个迭代有独立的 i(新的 Binding)');
const letFuncs = [];
for (let j = 0; j < 3; j++) {
  letFuncs.push(function() { return j; });
}
console.log('    执行 letFuncs[0]():', letFuncs[0](), '(期望:0,实际:0 ✓)');
console.log('    执行 letFuncs[1]():', letFuncs[1](), '(期望:1,实际:1 ✓)');
console.log('    执行 letFuncs[2]():', letFuncs[2](), '(期望:2,实际:2 ✓)');
console.log('  原因:for (let j) 在每次迭代都会创建新的词法环境 + 新的 j binding');
console.log('');

// =============================================================================
// 9. var 的函数作用域 vs let 的块级作用域 详解
// =============================================================================
console.log('--- 9. var vs let / const 作用域差异 ---');

// 9.1 var 在 if/switch/for 块里不创建独立作用域
function varScopeDemo() {
  if (true) {
    var shared = 'everyone sees me';
  }
  console.log('  var after if block:', shared, '(没有块作用域,泄漏到函数)');
}
varScopeDemo();

function letScopeDemo() {
  if (true) {
    let leet = 'I am block-scoped';
  }
  try {
    console.log(' ', leet);
  } catch (e) {
    console.log('  let after if block: ReferenceError ✓');
  }
}
letScopeDemo();

// 9.2 var 声明提升(hoisting)
console.log('\n  var hoisting:');
console.log('    声明被提升到函数顶部,但赋值不提升:');
function hoistingDemo() {
  console.log('    x before var:', typeof x, '(x 已声明但 undefined)');
  var x = 5;
  console.log('    x after var:', x, '(5)');
}
hoistingDemo();

console.log('    let / const 也有"提升",但表现为 TDZ(暂时性死区):');
function tdzDemo() {
  // 经典 TDZ 演示:let y 已在作用域顶部"声明",但访问在声明之前 → ReferenceError
  try {
    // 用 IIFE 包装,让"访问在前、声明在后"在同一个块里
    (function () {
      console.log('    typeof y:', typeof y);  // 这行单独 OK(因为 typeof y 不会抛错)
      let y = 10;                              // 实际触发 TDZ 是在这一行访问时
    })();
  } catch (e) {
    console.log('    ReferenceError: y 处于 TDZ');
  }
  // 真正的 TDZ 触发:在声明前直接访问
  try {
    // eval 让我们在运行时插入代码,模拟"声明前访问"
    eval('console.log("    y:", y); let y = 10;');
  } catch (e) {
    console.log('    ReferenceError: Cannot access "y" before initialization (TDZ)');
  }
  let y = 10; // 现在可以了
  console.log('    let y after declaration:', y);
}
tdzDemo();
console.log('');

// =============================================================================
// 10. 动态作用域 vs 词法作用域
// =============================================================================
console.log('--- 10. 词法作用域 vs 动态作用域 ---');
console.log(`
  JavaScript 使用【词法作用域(Lexical Scoping)】:
    作用域在代码编写阶段就由源代码的结构决定,
    与代码执行时的调用路径无关。

  对比【动态作用域】(Shell 脚本/Bash 常用,JS 不支持):
    作用域由调用栈决定,函数在哪里调用,就能访问哪里的变量。

  词法作用域的优势:代码可读性高,编译器可以静态分析。
`);
function lexicalDemo() {
  const name = 'Alice';
  function inner() {
    console.log('    name:', name);  // 词法上在外层定义,所以能访问 Alice
  }
  function callInner(fn) {
    const name = 'Bob';  // 动态作用域下这里定义的 name 会被 inner 访问到
    fn();
  }
  callInner(inner);  // 词法作用域:inner 里 name = Alice(定义时的外层)
}
lexicalDemo();
console.log('  结论:inner 的 name 永远是 "Alice",不受 callInner 里 Bob 的影响');
console.log('');

// =============================================================================
// 11. 块级作用域在循环中的真实层数(for let)
// =============================================================================
console.log('--- 11. for (let j) 每轮迭代 scope chain 层数分析 ---');
console.log(`
  for (let j = 0; j < 3; j++) {
    funcs.push(function() { return j; });
  }

  实际等价于(ES6 规范定义的 iteration environment):
  ┌─ iteration body 作用域 (j=0 的那一次)
  │   └─ 闭包 function() { return j; }
  │       持有: j 的引用 (j 绑定在 iteration environment)
  └─ iteration body 作用域 (j=1)
  ...
  for 的每次迭代都会创建新的 LexicalEnvironment,而不是共用同一个 j。
`);
console.log('');

// =============================================================================
// 12. eval / with 破坏作用域链(顺便提,生产中避免)
// =============================================================================
console.log('--- 12. eval / with 能动态修改作用域(生产避免) ---');
function evalScopeDemo() {
  const secret = 'dont use eval';
  // eval 接受字符串,字符串内容被当作已有作用域的一部分执行
  // strict mode 下 eval 有自己的作用域,不会泄漏
  // 非严格模式下 eval 可能会修改当前作用域的变量
  console.log('  eval in strict mode:');
  'use strict';
  const before = typeof leaked !== 'undefined' ? leaked : 'undefined';
  eval('const leaked = "I leak into eval scope"');
  // 注意:eval 在 strict 下会创建独立的 Scope,所以上面不会影响外部
  console.log('  leaked after strict eval:', typeof leaked);
}
evalScopeDemo();
console.log(`
  结论:生产代码永远不要用 eval 或 with —— 它们会绕过编译器优化,
       污染作用域链,使行为不可预测。
`);
console.log('');

// =============================================================================
// 13. 作用域链查找的性能影响
// =============================================================================
console.log('--- 13. 作用域链层级过深的性能影响 ---');
console.log(`
  标识符解析过程:当前 scope → outer → outer → ... → global
  每多一层就要多一次哈希查找(规范里是 HasField / GetIdentifierValue)。

  经验法则:
    - 减少嵌套层级(建议不超过 3-4 层)
    - 局部变量访问最快(0 次 outer 查找)
    - 嵌套深层时,可以把外层变量缓存到局部:
        function outer() {
          const a = obj.a;    // 缓存一次,后面不再逐层查找
          return function() { return a + obj.b; };
        }
`);
console.log('');

// =============================================================================
// 14. 常见坑
// =============================================================================
console.log('--- 14. 常见坑汇总 ---');
console.log(`
  1) 误用 var 导致循环闭包共享同一个变量
     → 解决:for (let j) / IIFE 闭包 / 改用 let

  2) 块内 var 泄漏:
       if (true) { var x = 1; }
       console.log(x); // 1,不是你期望的 ReferenceError

  3) 函数声明 vs 函数表达式里 this 的 scope 不同:
       const obj = {
         fn: function() { ... },     // fn 内部的 this === obj
         arrow: () => { ... }        // arrow 内部没有自己的 this,继承外层
       }

  4) TDZ(暂时性死区):在 let/const 声明前访问变量会 ReferenceError,
     即使在同一个作用域里同一个块,哪怕 typeof 也救不了

  5) 词法作用域下,内部函数定义的位置决定它能访问什么,
     和它被调用时外层有什么变量无关

  6) 全局变量挂载到 globalThis(浏览器 window),可能污染全局命名空间
`);
console.log('');

// =============================================================================
// 15. 小结:记忆图
// =============================================================================
console.log('--- 15. 作用域链记忆图 ---');
console.log(`
  Execution Context
  ┌─────────────────────────────┐
  │  LexicalEnvironment        │
  │  ┌───────────────────────┐ │
  │  │  EnvironmentRecord    │ │  ← 当前作用域的变量
  │  │  (a=1, b=2, fn=...)   │ │
  │  └───────────────────────┘ │
  │  outer ──────────────────┐ │
  └────────────────────────┼─┘
                           │
                           ▼
                    (上一级 EC 的 LexicalEnvironment)

  沿着 outer 一直找,直到 outer === null(全局)
  ReferenceError 就在这个遍历过程中触发

  ┌──────────────────────────────────────────────┐
  │  作用域链的长度 ≈ 函数定义的嵌套层数           │
  │  越短的链 = 越快的标识符解析                   │
  └──────────────────────────────────────────────┘
`);
console.log('\n=== ' + title + ' 结束 ===');
