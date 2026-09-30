// 02 - 类型与类型转换
// 原始类型、引用类型、隐式转换、显式转换

const title = '02 - 类型与类型转换';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 原始类型 (Primitive Types) ==========
console.log('--- 1. 7 种原始类型 ---');
console.log('string   :', typeof 'hi');
console.log('number   :', typeof 42);
console.log('bigint   :', typeof 42n);
console.log('boolean  :', typeof true);
console.log('null     :', typeof null);          // 'object' (历史 bug)
console.log('undefined:', typeof undefined);
console.log('symbol   :', typeof Symbol('id'));
console.log('');

// ========== 2. 引用类型 ==========
console.log('--- 2. 引用类型 ---');
console.log('object   :', typeof { a: 1 });
console.log('array    :', typeof [1, 2, 3]);     // 也是 'object'
console.log('function :', typeof function () {});
console.log('');

console.log('数组判断 Array.isArray([1,2,3]):', Array.isArray([1, 2, 3]));
console.log('数组判断 Array.isArray({a:1}):', Array.isArray({ a: 1 }));
console.log('');

// ========== 3. 隐式转换 (Coercion) ==========
console.log('--- 3. 隐式转换 (容易出 bug 的地方) ---');
console.log("'5' + 3     =>", '5' + 3);           // '53' (字符串拼接)
console.log("'5' - 3     =>", '5' - 3);           // 2   (转为数字)
console.log("'5' * '2'   =>", '5' * '2');         // 10
console.log("true + 1    =>", true + 1);         // 2
console.log("null + 1    =>", null + 1);         // 1   (null 被转为 0)
console.log("undefined + 1 =>", undefined + 1);   // NaN
console.log("'' == false =>", '' == false);      // true (双等号会转换)
console.log("'' === false =>", '' === false);    // false (严格相等不转换)
console.log("null == undefined =>", null == undefined); // true
console.log("null === undefined =>", null === undefined); // false
console.log('');

// ========== 4. 显式转换 ==========
console.log('--- 4. 显式转换 (推荐) ---');
console.log('Number("42"):', Number('42'));              // 42
console.log('Number("42abc"):', Number('42abc'));        // NaN
console.log('Number(true):', Number(true));              // 1
console.log('Number(null):', Number(null));              // 0
console.log('Number(undefined):', Number(undefined));    // NaN
console.log('String(123):', String(123));                // '123'
console.log('Boolean(0):', Boolean(0));                  // false
console.log('Boolean(""):', Boolean(''));                // false
console.log('Boolean("0"):', Boolean('0'));              // true  (非空字符串就是 true!)
console.log('Boolean([]):', Boolean([]));                // true  (空数组也是 true!)
console.log('');

// ========== 5. == vs === (重要规则) ==========
console.log('--- 5. === 严格相等规则 ---');
console.log('永远使用 === 和 !==,避免使用 == 和 !=');
console.log('例外: x == null 等价于 x === null || x === undefined,可用于判空');
const value = undefined;
if (value == null) {
  console.log('value 为 null 或 undefined');
}
console.log('');

// ========== 6. NaN 的特性 ==========
console.log('--- 6. NaN ---');
console.log('NaN === NaN:', NaN === NaN);              // false
console.log('Number.isNaN(NaN):', Number.isNaN(NaN));  // true  (推荐)
console.log('Number.isNaN("abc"):', Number.isNaN('abc')); // false (没有强制转换)
console.log('isNaN("abc"):', isNaN('abc'));              // true  (全局函数会先转换)
console.log('Object.is(NaN, NaN):', Object.is(NaN, NaN)); // true
console.log('');

// ========== 7. 浅拷贝 vs 深拷贝 ==========
console.log('--- 7. 浅拷贝 vs 深拷贝 ---');
const original = { name: '张三', hobbies: ['篮球', '读书'] };

// 浅拷贝
const shallow = { ...original };
shallow.hobbies.push('音乐');
console.log('原对象 hobbies:', original.hobbies);
console.log('浅拷贝 hobbies:', shallow.hobbies);
console.log('=> 浅拷贝后修改嵌套数组,原对象也被改了!');

// 深拷贝 (structuredClone,Node 17+ 内置)
const deep = structuredClone(original);
deep.hobbies.push('游泳');
console.log('深拷贝 hobbies:', deep.hobbies);
console.log('原对象 hobbies (应未变):', original.hobbies);