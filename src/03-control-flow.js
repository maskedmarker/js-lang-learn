// 03 - 控制流
// 条件、循环、switch, match, 三元运算符

const title = '03 - 控制流';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. if / else if / else ==========
console.log('--- 1. if 语句 ---');
const score = 85;

if (score >= 90) {
  console.log('优秀');
} else if (score >= 80) {
  console.log('良好');
} else if (score >= 60) {
  console.log('及格');
} else {
  console.log('不及格');
}
console.log('');

// ========== 2. 三元运算符 ==========
console.log('--- 2. 三元运算符 ---');
const age = 20;
const status = age >= 18 ? '成年人' : '未成年人';
console.log(`年龄 ${age} 是 ${status}`);
console.log('');

// ========== 3. switch ==========
console.log('--- 3. switch (注意 break 和 fall-through) ---');
const day = 3;
let dayName;
switch (day) {
  case 1: dayName = '星期一'; break;
  case 2: dayName = '星期二'; break;
  case 3: dayName = '星期三'; break;
  case 4: dayName = '星期四'; break;
  case 5: dayName = '星期五'; break;
  case 6:
  case 7: dayName = '周末'; break;       // 多个 case 合并
  default: dayName = '无效';
}
console.log(`第 ${day} 天是 ${dayName}`);
console.log('');

// ========== 4. for 循环 ==========
console.log('--- 4. for 循环 ---');
for (let i = 1; i <= 5; i++) {
  process.stdout.write(`${i} `);
}
console.log('\n');

// ========== 5. for...of (遍历值) ==========
console.log('--- 5. for...of (遍历可迭代对象的值) ---');
const fruits = ['苹果', '香蕉', '橙子'];
for (const fruit of fruits) {
  console.log('水果:', fruit);
}
console.log('');

// ========== 6. for...in (遍历键,不推荐用于数组) ==========
console.log('--- 6. for...in (遍历对象的键,数组不要用) ---');
const user = { name: '张三', age: 25, city: '北京' };
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
console.log('');

// ========== 7. while / do...while ==========
console.log('--- 7. while ---');
let count = 0;
while (count < 3) {
  console.log(`count = ${count}`);
  count++;
}
console.log('');

// ========== 8. 数组方法替代循环 (函数式风格) ==========
console.log('--- 8. 函数式风格替代循环 ---');
const numbers = [1, 2, 3, 4, 5];

// forEach: 仅遍历
console.log('forEach:');
numbers.forEach((n, i) => console.log(`  索引 ${i} = ${n}`));

// map: 转换
const doubled = numbers.map(n => n * 2);
console.log('map (×2):', doubled);

// filter: 过滤
const evens = numbers.filter(n => n % 2 === 0);
console.log('filter (偶数):', evens);

// reduce: 累计
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('reduce (求和):', sum);

// find / some / every
console.log('find (第一个 > 3 的):', numbers.find(n => n > 3));
console.log('some (有偶数吗):', numbers.some(n => n % 2 === 0));
console.log('every (都 > 0 吗):', numbers.every(n => n > 0));
console.log('');

// ========== 9. break / continue / 标签 ==========
console.log('--- 9. break & continue ---');
for (let i = 0; i < 10; i++) {
  if (i === 3) continue;     // 跳过本次
  if (i === 7) break;        // 跳出整个循环
  console.log(i);
}