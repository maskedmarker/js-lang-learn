// 05 - 对象与数组
// 字面量、解构、扩展运算、可选链、空值合并

const title = '05 - 对象与数组';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 对象字面量 ==========
console.log('--- 1. 对象字面量 ---');
const person = {
  name: '张三',
  age: 28,
  hobbies: ['编程', '阅读'],
  address: {
    city: '北京',
    street: '中关村大街',
  },
  greet() {
    return `你好,我是 ${this.name}`;
  },
};
console.log(person.greet());
console.log(person.address.city);
console.log('');

// ========== 2. 解构赋值 ==========
console.log('--- 2. 解构赋值 ---');
const { name, age, hobbies: [firstHobby] } = person;
console.log('name:', name, '| age:', age, '| firstHobby:', firstHobby);

// 重命名
const { name: userName } = person;
console.log('重命名为 userName:', userName);

// 默认值
const { country = '中国' } = person;
console.log('默认值 country:', country);
console.log('');

// 数组解构 + 跳过
const colors = ['红', '绿', '蓝', '黄'];
const [c1, , c3, ...restColors] = colors;
console.log('c1:', c1, '| c3:', c3, '| rest:', restColors);

// 交换变量
let a = 1, b = 2;
[a, b] = [b, a];
console.log('交换后 a:', a, 'b:', b);
console.log('');

// ========== 2.1 数组解构 (完整版) ==========
console.log('--- 2.1 数组解构 (完整版) ---');

// 1) 基础:按位置取
const fruits = ['apple', 'banana', 'cherry', 'date'];
const [f0, f1, f2, f3] = fruits;
console.log('1) 基础:', f0, f1, f2, f3);

// 2) 只取前几个
const [firstFruit] = fruits;
console.log('2) 只取第一个:', firstFruit);

// 3) 跳过元素:用空位占位
const [, , thirdFruit] = fruits;
console.log('3) 跳过前两个,取第三个:', thirdFruit);

// 4) 剩余元素(rest)
const [head, ...tail] = fruits;
console.log('4) head:', head, '| tail:', tail);
// 注意:rest 必须是最后一个,且数组中只能有一个 rest

// 5) 默认值:数组越界或 undefined 时生效
const sparseArr = [1];
const [x1 = '默认1', x2 = '默认2', x3 = '默认3'] = sparseArr;
console.log('5) 默认值:', x1, x2, x3);
// 注意:null 不会触发默认值(只有 undefined 会)
const [y1 = '默认'] = [null];
console.log('   null 不触发默认值:', y1);

// 6) 多维(嵌套)解构
const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const [[m00, m01], [, m11]] = matrix;
console.log('6) 二维解构 m00,m01,m11:', m00, m01, m11);

// 7) 函数返回多个值(最经典的解构用途)
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log('7) 函数多返回值:', 'min =', min, '| max =', max);

// 8) 函数参数列表的解构
function sum([a, b, c]) {
  return a + b + c;
}
console.log('8) 函数参数解构 sum([1,2,3]):', sum([1, 2, 3]));

// 9) 解构字符串(可迭代对象都行)
const [s0, s1] = '你好';
console.log('9) 字符串解构:', s0, s1);
// 超出长度的取 undefined
const [s0o, s1o, s2o = '默认值'] = '你';
console.log('   超出长度触发默认值:', s0o, s1o, s2o);
// 注意:emoji 等 surrogate pair 会解出半个字符
const [emoji0, emoji1] = '😀😎';
console.log('   emoji 解构:', emoji0, emoji1);

// 10) 解构 Set
const [setFirst] = new Set([10, 20, 30]);
console.log('10) Set 解构第一个:', setFirst);

// 11) 解构 Map(拿到 entry)
const [firstEntry] = new Map([['k1', 'v1'], ['k2', 'v2']]);
console.log('11) Map 解构第一个 entry:', firstEntry);

// 12) 配合正则 match:解析 URL 各部分
const urlRegex = /^(\w+):\/\/([\w.]+)(?::(\d+))?$/;
const parsed = 'https://example.com:8080'.match(urlRegex);
const [, protocol, host, port = '默认443'] = parsed;
console.log('12) 正则 match 解构:',
  'protocol =', protocol,
  '| host =', host,
  '| port =', port);

// 13) 解构 length 属性(对象也能像数组一样取 length)
const { length } = fruits;
console.log('13) 从数组解构 length:', length);

// 14) 不声明变量,只解构赋值:用于把数据塞进已有变量
let p, q;
[p, q] = [10, 20];
console.log('14) 不带 const/let 的解构:', p, q);

console.log('');

// ========== 3. 扩展运算 (Spread) ==========
console.log('--- 3. 扩展运算 ... ---');
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2, 7, 8];
console.log('数组合并:', merged);

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 99, c: 3 };
const objMerged = { ...obj1, ...obj2, d: 4 };     // 同名属性后者覆盖
console.log('对象合并 (obj2.b 覆盖):', objMerged);

// 拷贝(浅)
const copied = [...arr1];
const objCopied = { ...obj1 };
console.log('');

// ========== 4. 可选链 ?.(Optional Chaining) ==========
console.log('--- 4. 可选链 ?. ---');
const user1 = { profile: { email: 'a@b.com' } };
const user2 = { profile: null };
const user3 = {};

console.log('user1.profile?.email:', user1.profile?.email);
console.log('user2.profile?.email:', user2.profile?.email);   // undefined
console.log('user3.profile?.email:', user3.profile?.email);   // undefined
console.log('');

// ========== 5. 空值合并 ?? ==========
console.log('--- 5. 空值合并 ?? ---');
// ?? 只在 null/undefined 时使用默认值,不会把 0、''、false 当作空
console.log('0 ?? 100:', 0 ?? 100);            // 0
console.log("'' ?? 'default':", '' ?? 'default'); // ''
console.log('null ?? 100:', null ?? 100);      // 100
console.log("undefined ?? 'default':", undefined ?? 'default');

// 对比 ||
console.log('--- 对比 || (会把 0、字符串空、false 也算作空) ---');
console.log('0 || 100:', 0 || 100);            // 100
console.log("'' || 'default':", '' || 'default'); // 'default'
console.log('');

// ========== 6. 对象方法速记 ==========
console.log('--- 6. 对象实用方法 ---');
const product = { id: 1, name: '手机', price: 3999, stock: 10 };
console.log('Object.keys:', Object.keys(product));
console.log('Object.values:', Object.values(product));
console.log('Object.entries:', Object.entries(product));

// 对象 → 数组的转换
console.log('转数组:',
  Object.entries(product).map(([k, v]) => `${k}=${v}`)
);

// 数组 → 对象
const entries = [['name', '李四'], ['age', 30]];
console.log('数组 → 对象:', Object.fromEntries(entries));
console.log('');

// ========== 7. 数组常用方法 ==========
console.log('--- 7. 数组方法 ---');
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

// ========== 8. Map 与 Set ==========
console.log('--- 8. Map & Set ---');
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

// ========== 9. 不可变更新模式 ==========
console.log('--- 9. 不可变更新 (React/Redux 风格) ---');
const state = { user: { name: '张三', age: 25 }, items: [1, 2, 3] };

const newState = {
  ...state,
  user: { ...state.user, age: 26 },                // 只改 user.age
  items: [...state.items, 4],                      // 追加一项
};
console.log('原 state:', state);
console.log('新 state:', newState);
console.log('原 user.age:', state.user.age, '(不变)');
console.log('新 user.age:', newState.user.age);