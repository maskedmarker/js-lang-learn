// 07 - void 运算符
// void 始终返回 undefined,无论后面的表达式是什么、是否有副作用

const title = '07 - void 运算符';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 基本语法 ==========
console.log('--- 1. void 的基本行为 ---');
console.log('void 0:', void 0);                          // undefined
console.log('void "hello":', void 'hello');              // undefined (字符串表达式被求值后丢弃)
console.log('void (1 + 2):', void (1 + 2));              // undefined
console.log('void true:', void true);                    // undefined
console.log('typeof void 0:', typeof void 0);            // 'undefined'
console.log('');

// ========== 2. void 与有副作用的表达式 ==========
console.log('--- 2. void 会执行表达式,但返回值总是 undefined ---');
let counter = 0;
const result = void counter++;                          // counter 仍会增加
console.log('counter:', counter);                       // 1
console.log('void 返回值:', result);                    // undefined
console.log('');

// ========== 3. void 是关键字,不是函数 ==========
console.log('--- 3. void 是运算符,不是函数 ---');
console.log('typeof void (合法):', typeof void 0);        // 'undefined',void 必须接操作数
try { console.log(eval('typeof void')); } catch (e) { console.log('void 必须接操作数:', e.name); }
console.log('合法的简写:void 0 (不需要括号)');
console.log('');

// ========== 4. void 在箭头函数中的常见用途 ==========
console.log('--- 4. void 在箭头函数中避免语法歧义 ---');
// 如果箭头函数体是一个对象字面量,需要 () 包裹;但也可以用 void 触发语句语义
const arrowReturningObject1 = () => ({ name: '张三' });
const arrowReturningObject2 = () => void { name: '张三' }; // 仍然返回 undefined,但 {} 被当作语句块
console.log('正常写法:', arrowReturningObject1());
console.log('void 写法返回:', arrowReturningObject2());   // undefined
console.log('');

// ========== 5. IIFE 简写 (历史上用过) ==========
console.log('--- 5. void + IIFE 简写 ---');
const value = void function () {
  return 42;
}();
console.log('void IIFE 结果:', value);                  // undefined (返回值被丢弃)
console.log('');

// ========== 6. 超链接的“空跳转”(浏览器环境) ==========
console.log('--- 6. 浏览器中的经典用法:阻止默认跳转 ---');
// 在 HTML 里: <a href="javascript:void(0)">点击</a>
// 这样点击链接时,不会发生跳转,只触发 onclick
// 对应到 JS:
const fakeLinkClick = () => {
  // 模拟 onclick 逻辑
  console.log('  链接被点击,但没有跳转');
  return false;
};
// 浏览器中等价于:
void fakeLinkClick();                                   // 返回 undefined,不参与任何表达式
console.log('');

// ========== 7. 与 undefined 的对比 ==========
console.log('--- 7. void 0 vs undefined ---');
// 在 ES5 之前,undefined 不是保留字,可能被覆盖;void 0 永远安全
// (function () { var undefined = 1; return undefined; })();  // 旧浏览器里返回 1
// 现在 undefined 是只读的全局属性,二者等价,但 void 0 更短,压缩后更小
console.log('void 0 === undefined:', void 0 === undefined);     // true
console.log('void(0) === undefined:', void (0) === undefined);   // true
console.log('');

// ========== 8. void 在 TypeScript / 严格模式下的语义 ==========
console.log('--- 8. void 作为返回类型 (TypeScript) ---');
// 在 TS 中 function foo(): void 表示“不关心返回值”
// 即使函数实际 return 了值,TS 也不会报错,但调用方拿不到那个值
// 这和运算符 void 是不同的概念:
function noop() { return '我返回了值'; }
const ignored = noop();
console.log('TS 风格的 void 函数返回值被丢弃:', ignored); // '我返回了值' (运行时还是会拿到)
console.log('但用 void 包装后:', void noop());              // undefined
console.log('');

// ========== 9. 一句话总结 ==========
console.log('--- 9. 总结 ---');
console.log(`
void 运算符:
  1. 对操作数求值,然后永远返回 undefined
  2. 不会短路,操作数如果是函数会执行,如果有副作用会触发
  3. void 0 是 undefined 的简写,历史上用于安全取 undefined
  4. 现代 JS 中更常用于 <a href="javascript:void(0)"> 阻止跳转
  5. 在 TS 中是“返回类型”概念,二者不要混淆
`);
