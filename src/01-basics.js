// 01 - 基础语法
// 变量声明、模板字符串、基本输入输出

const title = '01 - 基础语法';

// === const vs let vs var ===
// const: 声明后不能重新赋值(推荐默认使用)
// let:   可以重新赋值,块级作用域
// var:   函数级作用域,有变量提升(老语法,不推荐)
const language = 'JavaScript';
let version = 'ES2024';
var legacy = '尽量避免';

// === 模板字符串 (Template Literals) ===
const greeting = `你好!欢迎学习 ${language} ${version}。`;

console.log('=== ' + title + ' ===');
console.log(greeting);
console.log('');

// === 基本数据类型(将在 02 详细展开) ===
const number = 42;
const string = 'Hello';
const boolean = true;
const nothing = null;
const notDefined = undefined;

console.log('number:', number, typeof number);
console.log('string:', string, typeof string);
console.log('boolean:', boolean, typeof boolean);
console.log('null:', nothing, typeof nothing);       // 注意: typeof null === 'object' (历史遗留 bug)
console.log('undefined:', notDefined, typeof notDefined);
console.log('');

// === 字符串常用方法 ===
const text = '  Node.js 学习  ';
console.log('原文:', JSON.stringify(text));
console.log('长度:', text.length);
console.log('trim:', JSON.stringify(text.trim()));
console.log('大写:', text.toUpperCase());
console.log('包含 "Node":', text.includes('Node'));
console.log('切片 [2:6]:', text.slice(2, 6));
console.log('分割:', text.trim().split(' '));
console.log('替换:', text.replace('学习', '实战'));
console.log('');

// === 数字常用方法 ===
console.log('=== Number ===');
console.log('toFixed(2):', (3.14159).toFixed(2));
console.log('parseInt:', parseInt('42px', 10));       // 42
console.log('parseFloat:', parseFloat('3.14abc'));    // 3.14
console.log('Number.isNaN(NaN):', Number.isNaN(NaN));
console.log('Number.isFinite(Infinity):', Number.isFinite(Infinity));
console.log('Math.max(1,2,3):', Math.max(1, 2, 3));
console.log('Math.random 0-1:', Math.random().toFixed(3));
console.log('');

// === 从命令行读取输入(REPL 风格) ===
// 取消下面这段的注释可以体验交互输入
// import readline from 'node:readline/promises';
// import { stdin as input, stdout as output } from 'node:process';
// const rl = readline.createInterface({ input, output });
// const name = await rl.question('请输入你的名字: ');
// console.log(`你好, ${name}!`);
// rl.close();