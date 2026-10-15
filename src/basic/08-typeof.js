// 08 - typeof 运算符
// typeof 返回一个表示操作数类型的字符串

const title = '08 - typeof 运算符';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 7 种原始类型 + 3 种引用类型 的 typeof 返回值 ==========
console.log('--- 1. typeof 的 8 种返回值 ---');
console.log('typeof 42              :', typeof 42);              // 'number'
console.log('typeof "hello"         :', typeof 'hello');         // 'string'
console.log('typeof true            :', typeof true);            // 'boolean'
console.log('typeof undefined       :', typeof undefined);       // 'undefined'
console.log('typeof Symbol()        :', typeof Symbol());        // 'symbol'
console.log('typeof 123n            :', typeof 123n);            // 'bigint'
console.log('typeof null            :', typeof null);            // 'object'   ← 历史遗留 bug
console.log('typeof {}              :', typeof {});              // 'object'
console.log('typeof []              :', typeof []);              // 'object'  (数组也是 object)
console.log('typeof function (){}   :', typeof function () {}); // 'function'
console.log('');

// ========== 2. typeof 对未声明变量也不抛错 ==========
console.log('--- 2. typeof 是唯一不抛 ReferenceError 的运算符 ---');
try {
  console.log('直接访问 notDeclaredVar:');
  console.log(notDeclaredVar);           // ReferenceError!
} catch (e) {
  console.log('  抛错:', e.constructor.name, e.message);
}
console.log('typeof notDeclaredVar  :', typeof notDeclaredVar); // 'undefined',不抛错
console.log('');

// ========== 3. typeof 永远返回字符串,而不是值类型 ==========
console.log('--- 3. typeof 返回值是字符串,不是真正的 undefined ---');
console.log('typeof void 0          :', typeof void 0);                              // 'undefined'
console.log('typeof void 0 === undefined:', typeof void 0 === undefined);            // false (字符串 vs 值)
console.log('typeof void 0 === "undefined":', typeof void 0 === 'undefined');        // true  (字符串 vs 字符串)
console.log('');

// ========== 4. typeof 的运算时机:不进行隐式转换 ==========
console.log('--- 4. typeof 不做隐式类型转换 ---');
const val = '42';
console.log('typeof val             :', typeof val);          // 'string',typeof 只看表面
console.log('+val 的实际值          :', +val);                 // 42,字符串被转换成了数字
console.log('');

// ========== 5. 常见的类型守卫(type guard)写法 ==========
console.log('--- 5. 用 typeof 做类型守卫 ---');
function describe(value) {
  switch (typeof value) {
    case 'number':   return `数字:${value}`;
    case 'string':   return `字符串:${value}`;
    case 'boolean':  return `布尔:${value}`;
    case 'undefined':return 'undefined';
    case 'symbol':   return `Symbol:${value.toString()}`;
    case 'bigint':   return `大整数:${value}`;
    case 'function': return `[Function: ${value.name || 'anonymous'}]`;
    case 'object':
      if (value === null) return 'null';
      if (Array.isArray(value)) return `数组(长度 ${value.length})`;
      return '普通对象';
    default:         return '未知';
  }
}
console.log('describe(42)       :', describe(42));
console.log('describe("hi")     :', describe('hi'));
console.log('describe(null)     :', describe(null));
console.log('describe([])       :', describe([]));
console.log('describe({})       :', describe({}));
console.log('describe(undefined):', describe(undefined));
console.log('describe(Symbol()):', describe(Symbol('id')));
console.log('');

// ========== 6. typeof 的两类反直觉陷阱 ==========
console.log('--- 6. typeof 的两个反直觉陷阱 ---');
console.log('typeof null === "object"  :', typeof null === 'object');   // true  (历史遗留)
console.log('typeof []  === "object"   :', typeof [] === 'object');     // true  (数组也是 object)
// 正确判断数组/可迭代要用 Array.isArray()
console.log('Array.isArray([])        :', Array.isArray([]));
console.log('Array.isArray(null)      :', Array.isArray(null));
console.log('');

// ========== 7. typeof 在变量声明之前使用 ==========
console.log('--- 7. typeof 在变量声明之前(暂时性死区) ---');
try {
  console.log('typeof temporalDeadZoneVar:', typeof temporalDeadZoneVar);  // 抛错!
} catch (e) {
  console.log('  抛错:', e.constructor.name, e.message);
}
let temporalDeadZoneVar = '已声明';
console.log('typeof 已声明后           :', typeof temporalDeadZoneVar);
// 关键:typeof 对「未声明」宽容,对「TDZ 内的已声明」会抛错
console.log('');

// ========== 8. typeof 与一元运算符的优先级 ==========
console.log('--- 8. typeof 与其他一元运算符 ---');
// typeof 是一元运算符,优先级较高
console.log('typeof typeof 42  :', typeof typeof 42);                  // 'string'(因为 typeof 42 是 'number',再 typeof 得到 'string')
console.log('typeof +"42"      :', typeof +'42');                       // 'number' (+ 在 typeof 后求值)
console.log('typeof !true      :', typeof !true);                       // 'boolean' (! 在 typeof 后求值)
console.log('');

// ========== 9. typeof vs instanceof ==========
console.log('--- 9. typeof vs instanceof ---');
const arr = [1, 2, 3];
console.log('typeof arr         :', typeof arr);               // 'object',无法区分对象类型
console.log('arr instanceof Array:', arr instanceof Array);     // true,可以判断具体类
console.log('');

// ========== 10. typeof 的安全模式:可封装的判断函数 ==========
console.log('--- 10. 实战工具函数 ---');
const isUndefined = (v) => typeof v === 'undefined';
const isString    = (v) => typeof v === 'string';
const isNumber    = (v) => typeof v === 'number' && !Number.isNaN(v);
const isBoolean   = (v) => typeof v === 'boolean';
const isFunction  = (v) => typeof v === 'function';

// isUndefined 的实现本身已经用 typeof 保护了内部,但调用 isUndefined(undeclaredVar)
// 时,实参 undeclaredVar 在传入前就被求值,会抛 ReferenceError
// 正确做法:直接在调用点用 typeof,不通过函数参数传递未声明名字
console.log('typeof undeclaredVar === "undefined":', typeof undeclaredVar === 'undefined'); // true
console.log('isString(42)             :', isString(42));                // false
console.log('isNumber(NaN)            :', isNumber(NaN));               // false (NaN 不是数字)
console.log('isNumber(42)             :', isNumber(42));                // true
console.log('isFunction(()=>{})       :', isFunction(() => {}));        // true
console.log('');

// ========== 11. 总结 ==========
console.log('--- 11. 总结 ---');
console.log(`
typeof 运算符:
  1. 一元前缀运算符,返回操作数类型的「字符串」
  2. 返回值只有 8 种: 'undefined' 'boolean' 'number' 'string'
                    'bigint' 'symbol' 'function' 'object'
  3. typeof null === 'object' 是历史遗留 bug
  4. 数组的 typeof 是 'object',要区分需用 Array.isArray()
  5. 对未声明变量不抛错,是唯一安全的「存在性」检查
  6. 对 TDZ 内的 let/const 变量会抛 ReferenceError
  7. 永远和字符串 'undefined' 比较,而不是 undefined 值
`);