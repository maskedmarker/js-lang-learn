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



// ========== 1. 可选链 ?.(Optional Chaining) ==========
console.log('--- 1. 可选链 ?. ---');
const user1 = { profile: { email: 'a@b.com' } };
const user2 = { profile: null };
const user3 = {};

console.log('user1.profile?.email:', user1.profile?.email);
console.log('user2.profile?.email:', user2.profile?.email);   // undefined
console.log('user3.profile?.email:', user3.profile?.email);   // undefined
console.log('');

// ========== 2. 空值合并 ?? ==========
console.log('--- 2. 空值合并 ?? ---');
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

// ========== 3. 对象方法速记 ==========
console.log('--- 3. 对象方法速记 ---');
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


// ========== 4. 不可变更新模式 ==========
console.log('--- 4. 不可变更新 (React/Redux 风格) ---');
const state = { user: { name: '张三', age: 25 }, items: [1, 2, 3], config: { theme: 'dark' } };

const newState = {
  ...state,                                        // 浅拷贝其他属性
  user: { ...state.user, age: 26 },                // 只改 user.age
  items: [...state.items, 4],                      // 追加一项
};
console.log('原 state:', state);
console.log('新 state:', newState);
console.log('原 user.age:', state.user.age, '(不变)');
console.log('新 user.age:', newState.user.age);


// ========== 5. 对象的 key 可以使用 number 类型的值 ==========
console.log('--- 5. 对象的 key 可以使用 number 类型的值 ---');

// 因为对象在创建时，数字类型的key会被转换成字符串

// 下面几种写法实际上是等价的
const obj1 = { 1: "A" };
const obj2 = { "1": "A" };
const obj3 = { ["1"]: "A" };
// 它们的属性名都是字符串 "1", 实际上它们是同一个属性，后面的值会覆盖前面的值
// 如果确实需要使用 number 类型的 key, JavaScript 提供了 Map

// 只能使用obj[1]或者obj["1"]来访问属性值, 而不能使用obj.1, 因为点操作符要求属性名是一个有效的标识符，而数字不是有效的标识符
