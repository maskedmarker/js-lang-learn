// 09 - import 专题
// ES Module 的 import 各种写法、行为、坑
// 本项目是 ESM 模式 (package.json: "type": "module")

const title = '09 - import 专题';
console.log('=== ' + title + ' ===');
console.log('');

// 注意:所有被导入的模块顶层代码会在第一次 import 时执行(并只执行一次),
//      这就是所谓"module top-level evaluation"。
//      因此本文件执行时,模块的 console.log 会先于本文件的小节打印。
//      为了让小节标题清晰,本文件只 import 一次,各模块自己负责打印。

// ========== 1. import 的本质:静态解析 + 只读绑定 ==========
console.log('--- 1. import 的本质 ---');
// 1) import 是"编译期"决定依赖关系的,所有 import 会被提升到模块顶部
// 2) import 的绑定是"实时只读引用":被导入模块导出变化,这里也跟着变
//    (对应 CJS 的 require 时拿到的是值的拷贝,这是最大区别之一)
//
// 下面的 import 都放在文件顶部更标准;但放在中间也能工作(hoisting)
// 我们把这个例子里要用的放到对应小节即可

// ========== 2. 默认导入:import x from './...' ==========
console.log('--- 2. 默认导入 default import ---');
import defaultExport from './modules/09-default-export.js';
console.log('  default.PI =', defaultExport.PI);
console.log('  default.E =', defaultExport.E);
console.log('  default.greet():', defaultExport.greet('ES Module'));
console.log('  default.circleArea(2):', defaultExport.circleArea(2));
console.log('  默认导入的名字(defaultExport)可以任意取,模块里只关心 default');
console.log('');

// ========== 3. 命名导入:import { a, b } from './...' ==========
console.log('--- 3. 命名导入 named import ---');
import { COURSE, LEVEL, add, multiply, author, version } from './modules/09-named-exports.js';
console.log('  COURSE:', COURSE, '| LEVEL:', LEVEL);
console.log('  add(2, 3) =', add(2, 3));
console.log('  multiply(4, 5) =', multiply(4, 5));
console.log('  author:', author, '| version:', version);
// 名字必须与导出端一致(除非用 as 重命名)
console.log('');

// ========== 4. 命名空间导入:import * as M from './...' ==========
console.log('--- 4. 命名空间导入 namespace import ---');
import * as math from './modules/09-named-exports.js';
import * as mixed from './modules/09-mixed-exports.js';
console.log('  math.COURSE:', math.COURSE);
console.log('  math.add(10, 20):', math.add(10, 20));
// 4.1 关于 default 属性的精确说法:
// 命名空间对象上**总会有一个 default 属性**(ES 规范保证),只是值是 undefined
console.log('  math.default:', math.default, '   (模块无 default,占位为 undefined)');
console.log('  "default" in math:', 'default' in math, '  hasOwn:', Object.prototype.hasOwnProperty.call(math, 'default'));
// 对比:有 default 导出的模块,namespaced 之后 .default 就是那个值
console.log('  mixed.default:', typeof mixed.default, '   (模块有 default,指向 calculateDiscount)');
console.log('  mixed.TAX_RATE:', mixed.TAX_RATE, '    (named 和 default 在 namespace 里平级)');

// 4.2 namespace.default  与  { default as D }  严格等价(ES 规范)
//
//   import * as M from './foo.js';
//   import { default as D } from './foo.js';
//
// 上面两行对 default 值的访问应当等价:    M.default  <==>  D
//
// 也就是说,namespaced import 的 .default 并不是 ESM 为 namespace 临时造的
// "伪装属性",而是在词法上就等价于"把 default 当作一个具名导入"。
// ES 规范 (tc39.es / ImportEntries) 明确说:
//   - `import * as M` 会产生一个 namespace object,它包含所有 named export
//     再加上一个特殊键 "__esModule" 标识
//   - 访问 M.default 走的就是"default 这个 binding 的值",与直接具名导入
//     default 等价
//
// 这条规则让"namespace 写法"和"具名 default 写法"在语义上完全互通:
//   - M.default()  <==>  D()
//   - M.default.x  <==>  D.x
//   - M.default === undefined 也对应"模块没有 default"这个事实

// 我们用 mixed 模块现场验证这条等价性
import { default as D } from './modules/09-mixed-exports.js';
console.log('  mixed.default === D (引用相等):', mixed.default === D);
console.log('  mixed.default(50, 0.5)   =', mixed.default(50, 0.5), '   <==>  D(50, 0.5) =', D(50, 0.5));
// 注意:namespaced 导入还能保留 named,而 { default as D } 只拿到 default
//       这两种写法用途不同,只是"对 default 的访问"等价

// 注意:命名空间对象是"只读"的,不能 math.add = ...
try {
  math.add = null;
} catch (e) {
  console.log('  修改命名空间对象会抛错 (在严格模式/ESM 下):', e.name);
}
console.log('');

// ========== 5. 重命名:as ==========
console.log('--- 5. 重命名 as (导入侧 / 导出侧) ---');
// 导入侧重命名(导出端名字叫 originalName,这里叫显示名)
import { renamed, exportedFn } from './modules/09-aliased.js';
console.log('  renamed:', renamed);
console.log('  exportedFn():', exportedFn());

// 给默认导入重命名
import anotherName from './modules/09-default-export.js';
console.log('  anotherName.PI =', anotherName.PI, '(同一个模块,再 import 一次不会重载)');
// 上面的 import 不会重新执行模块顶层代码(模块缓存)
console.log('');

// ========== 6. 默认 + 命名混合 ==========
console.log('--- 6. 默认 + 命名混用 ---');
import calcDiscount, { TAX_RATE, FREE_SHIPPING_THRESHOLD, formatPrice } from './modules/09-mixed-exports.js';
console.log('  calcDiscount(100, 0.2):', calcDiscount(100, 0.2));
console.log('  TAX_RATE:', TAX_RATE);
console.log('  FREE_SHIPPING_THRESHOLD:', FREE_SHIPPING_THRESHOLD);
console.log('  formatPrice(99.5):', formatPrice(99.5));
console.log('');

// ========== 7. 副作用导入 ==========
console.log('--- 7. 副作用导入 side-effect import ---');
// 这种 import 只想"执行模块顶层代码",不拿任何东西
// 注意:必须 import 一次才能触发副作用,下面这一行被注释时
//      09-side-effect.js 里的 console.log 不会执行
import './modules/09-side-effect.js';

// 副作用:Array.prototype.last 已经被 polyfill
console.log('  [1, 2, 3].last():', [1, 2, 3].last());
console.log('  globalThis.__sideEffectFlag:', globalThis.__sideEffectFlag);
console.log('');

// ========== 8. 路径规则 ==========
console.log('--- 8. 路径规则 ---');
// 1) 相对路径:必须以 ./ 或 ../ 开头(裸字符串会去找 node_modules)
import { basename } from './modules/09-node-builtin.js';
console.log('  本文件 basename(由 ./09-node-builtin.js 提供):', basename);
// 2) 目录:Node 会按以下顺序找 index.js / index.mjs / package.json 的 "main" / "module"
//    import from './modules'  →  ./modules/index.js
// 3) 扩展名:.js / .mjs / .cjs(本项目是 ESM,推荐显式写 .js)
// 4) node: 前缀:Node 内置模块,推荐写法,意图明确
import path from 'node:path';
console.log('  path.sep:', JSON.stringify(path.sep));
console.log('  node:path 走的是 Node 内置,不会去 node_modules 找');
console.log('');

// ========== 9. Node 内置模块 ==========
console.log('--- 9. Node 内置模块 (node: 前缀) ---');
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'node:fs';
console.log('  fileURLToPath:', typeof fileURLToPath);
console.log('  createReadStream:', typeof createReadStream);
// 对比:也可以省略 node: 前缀,效果一样,但 node: 更清晰
import pathBare from 'path';
console.log('  bare "path".sep === node:path.sep:', pathBare.sep === path.sep);
console.log('');

// ========== 10. 聚合 / 重导出 (re-export) ==========
console.log('--- 10. re-export:把多个模块的导出汇总到一个 barrel 文件 ---');
// 通常会单独建一个 09-barrel.js,内容形如:
//   export { add, multiply } from './09-named-exports.js';
//   export { default as calc } from './09-mixed-exports.js';
//   export * from './09-default-export.js';
// 这里我们直接 inline 演示 re-export 的语法形状(不另起文件):
//
// import 表示使用;export 形式可以"转发"其它模块
//
// 验证方式:把下面的注释段复制到一个临时文件 09-barrel.js,再 import 它:
//   // 09-barrel.js
//   export { add, multiply, COURSE as course } from './modules/09-named-exports.js';
//   export { default as calcDiscount } from './modules/09-mixed-exports.js';
//
//   // 然后在主文件:
//   // import { add, course, calcDiscount } from './modules/09-barrel.js';
//
// 这里为了不污染目录,我们做一个"内联"等价:用 * 把另一个模块转成命名空间再 re-export
import * as namedMod from './modules/09-named-exports.js';
const barrel = {
  add: namedMod.add,
  multiply: namedMod.multiply,
  course: namedMod.COURSE,
};
console.log('  barrel.add(1,2):', barrel.add(1, 2));
console.log('  barrel.multiply(3,4):', barrel.multiply(3, 4));
console.log('  barrel.course:', barrel.course);
console.log('');

// ========== 11. 循环依赖 ==========
console.log('--- 11. 循环依赖(实际跑 + 解释) ---');
// a.js 和 b.js 互相 import,模块加载会"半初始化":
//   - 进入 a.js → 遇到 import b.js → 进入 b.js
//   - b.js 遇到 import a.js → a.js 还没初始化完,得到的是当前已求值部分(可能没有 sayHelloFromA)
//   - 这就是为什么循环依赖容易"undefined"
//
// 为了不在主教程启动时立刻触发这两个模块的顶层 import(它们会自己 print),
// 我们用 dynamic import 延迟加载
const aMod = await import('./modules/09-cycles/a.js');
const bMod = await import('./modules/09-cycles/b.js');
console.log('  [main] aMod.sayHelloFromA():', aMod.sayHelloFromA());
console.log('  [main] bMod.sayHelloFromB():', bMod.sayHelloFromB());
console.log('  [main] aMod.aHeard:', aMod.aHeard);
console.log('  [main] bMod.bHeard:', bMod.bHeard);
console.log('');

// ========== 12. 动态导入:await import() ==========
console.log('--- 12. 动态导入 dynamic import() ---');
// import() 是"运行时"的,返回一个 Promise
// 用法:按需加载、条件分支、代码分割、加载配置文件等
async function loadHeavy() {
  // 模拟按需加载
  const mod = await import('./modules/09-named-exports.js');
  return mod.add(100, 200);
}
const heavyResult = await loadHeavy();
console.log('  await import() 拿到的模块,add(100, 200):', heavyResult);

// 注意:动态 import() 接受任意字符串(运行时拼接也行),不像静态 import 必须是字面量
const which = '09-mixed-exports';
const dynMod = await import(`./modules/${which}.js`);
console.log('  拼接路径的动态导入,formatPrice(3.14):', dynMod.formatPrice(3.14));
console.log('');

// ========== 13. import 提升 + 只读绑定 ==========
console.log('--- 13. import 提升 (hoisting) 与只读绑定 ---');
// 13.1 提升:import 写在中间/底部,效果等同于在文件顶部
//      (但风格上仍推荐全部 import 放顶部)
import { COURSE as courseName } from './modules/09-named-exports.js';
console.log('  COURSE(顶部 import 提升,位置在 console 之后也能用):', courseName);

// 13.2 只读:导入的绑定是只读的,不能重新赋值
try {
  // courseName = '覆盖';   // 取消注释会抛 TypeError
} catch (e) {
  console.log('  重新赋值导入的绑定会报错:', e.name);
}
console.log('  courseName:', courseName, '(只读,本例没改)');
// 但要注意:如果导出的是对象/数组,对象的属性是可以改的(导出端才是真源)
// 这个我们用 mut 模块演示
import { bag } from './modules/09-mutable.js';
console.log('  bag.value (导入侧读):', bag.value);
bag.value = 99;                       // 可以改对象的属性!
console.log('  bag.value (导入侧改完):', bag.value);
// 如果想看导出端的实际值,需要再 import 一次(走的是同一个模块实例)
import { bag as sameBag } from './modules/09-mutable.js';
console.log('  sameBag.value (同一个模块实例,看到的也是 99):', sameBag.value);
console.log('');

// ========== 14. ESM vs CJS require 的差异 ==========
console.log('--- 14. ESM vs CommonJS require ---');
// 本项目是 ESM,没有 require。但差别值得记:
//   import         | require
// --------------------------------------------
//   静态(编译时)  | 动态(运行时)
//   异步/同步都行  | 同步
//   实时绑定引用   | 值拷贝(原始值是拷贝,对象是引用)
//   只读           | 可改(require 拿到的对象仍可改)
//   浏览器原生支持 | 浏览器需打包
//   后缀必须是 .mjs 或 package.json type=module | .cjs
//
// Node 进程里可以通过 createRequire 在 ESM 里使用 CJS:
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pathMod = require('node:path');
console.log('  在 ESM 里用 createRequire 拿到的 path 模块:', typeof pathMod.join === 'function');
console.log('  pathMod.join("a","b"):', pathMod.join('a', 'b'));
console.log('');

// ========== 15. 常见坑 ==========
console.log('--- 15. 常见坑汇总 ---');
console.log(`
  1) 路径必须以 ./ 或 ../ 开头,裸字符串会去 node_modules 找
  2) 写错文件后缀(.js vs .mjs vs .cjs)会报 ERR_MODULE_NOT_FOUND
  3) import 在严格模式下,模块顶层不能有 await (除非是顶级 await,Node 18+ 支持)
  4) default 名字可以随便取,但同一模块只能有 1 个 default
  5) import 是提升的,可以放文件任何位置(但风格上放顶部)
  6) 导入的绑定是只读,不能赋值;但对象属性可以改(导出端是真源)
  7) 循环依赖里,先被 import 的那个模块,后导入侧可能拿到 undefined
  8) 动态 import() 返回 Promise,必须 await 或 .then
  9) re-export (export ... from) 可以做 barrel,但会让依赖图变难追踪
 10) Node 内置模块推荐带 node: 前缀 (node:fs, node:path),意图明确
`);

// 顶部小节里 13.2 引用的可变绑定模块
