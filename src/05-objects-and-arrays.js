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
console.log('--- 对比 || (会把 0、''、false 也算作空) ---');
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