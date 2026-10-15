// 04 - 函数
// 多种声明方式、参数特性、箭头函数、闭包、高阶函数

const title = '04 - 函数';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. 函数声明 vs 函数表达式 vs 箭头函数 ==========
console.log('--- 1. 三种声明方式 ---');

// 函数声明:有提升 (hoisting),可在定义前调用
console.log('声明式 add(2,3):', add(2, 3));
function add(a, b) {
  return a + b;
}

// 函数表达式:没有提升
const subtract = function (a, b) {
  return a - b;
};
console.log('表达式 subtract(5,2):', subtract(5, 2));

// 箭头函数:简洁,没有自己的 this / arguments
const multiply = (a, b) => a * b;
console.log('箭头 multiply(3,4):', multiply(3, 4));
console.log('');

// ========== 2. 默认参数 ==========
console.log('--- 2. 默认参数 ---');
function greet(name = '游客', lang = 'zh') {
  return lang === 'zh' ? `你好, ${name}!` : `Hello, ${name}!`;
}
console.log(greet());
console.log(greet('张三'));
console.log(greet('Alice', 'en'));
console.log('');

// ========== 3. 剩余参数 (Rest Parameters) ==========
console.log('--- 3. 剩余参数 ...args ---');
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log('sum(1,2,3,4,5):', sum(1, 2, 3, 4, 5));

function introduce(action, ...items) {
  return `${action}: ${items.join(', ')}`;
}
console.log(introduce('我喜欢', '篮球', '读书', '音乐'));
console.log('');

// ========== 4. 解构参数 ==========
console.log('--- 4. 解构参数 ---');
function printUser({ name, age, city = '未知' }) {
  console.log(`${name} (${age} 岁) 来自 ${city}`);
}
printUser({ name: '李四', age: 30, city: '上海' });
printUser({ name: '王五', age: 25 });
console.log('');

// ========== 5. 箭头函数 this 行为 ==========
console.log('--- 5. 箭头函数没有自己的 this ---');
const obj = {
  name: '对象',
  regular: function () {
    setTimeout(function () {
      console.log('regular 中 this.name:', this?.name);   // undefined (this 指向 setTimeout 调用者)
    }, 0);
  },
  arrow: function () {
    setTimeout(() => {
      console.log('arrow 中 this.name:', this.name);       // '对象' (继承外层 this)
    }, 0);
  },
};
obj.regular();
obj.arrow();
await new Promise(r => setTimeout(r, 50));   // 等上面的 setTimeout 执行完
console.log('');

// ========== 6. 闭包 (Closure) ==========
console.log('--- 6. 闭包 ---');
function makeCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
  };
}
const counter = makeCounter(10);
console.log('初始:', counter.get());
counter.increment();
counter.increment();
console.log('+2 次后:', counter.get());
counter.decrement();
console.log('-1 次后:', counter.get());
console.log('');

// ========== 7. 高阶函数 ==========
console.log('--- 7. 高阶函数 (接收或返回函数) ---');
function withLogging(fn) {
  return function (...args) {
    console.log(`调用 ${fn.name}(${args.join(', ')})`);
    const result = fn(...args);
    console.log(`返回: ${result}`);
    return result;
  };
}
const loggedAdd = withLogging(add);
loggedAdd(2, 3);
console.log('');

// ========== 8. IIFE (立即执行函数表达式) ==========
console.log('--- 8. IIFE ---');
(function () {
  console.log('我立即执行了!');
})();

// 现代写法:直接用块作用域
{
  const scoped = '块作用域内的变量';
  console.log(scoped);
}
console.log('');

// ========== 9. 递归 ==========
console.log('--- 9. 递归 ---');
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log('5! =', factorial(5));
console.log('10! =', factorial(10));

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log('fib(10):', fibonacci(10));
console.log('');

// ========== 10. 生成器函数 (Generator) ==========
console.log('--- 10. Generator ---');
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
console.log('range(1, 10, 2):', [...range(1, 10, 2)]);
console.log('');