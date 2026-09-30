# Hello Node - JavaScript 学习项目

一个用 Node.js 环境学习 JavaScript 语法的练习项目。

## 环境要求

- Node.js >= 18 (推荐 20+)
- npm

## 项目结构

```
hello-node/
├── package.json          # 项目配置与脚本
├── run-all.js            # 依次运行所有示例
└── src/
    ├── 01-basics.js              # 基础语法:变量、模板字符串
    ├── 02-types-and-coercion.js  # 类型与类型转换
    ├── 03-control-flow.js        # 控制流:if/switch/for/函数式
    ├── 04-functions.js           # 函数:声明/箭头/闭包/递归
    ├── 05-objects-and-arrays.js  # 对象与数组:解构/扩展/Map/Set
    ├── 06-async-await.js             # 异步编程:Promise/async-await
    ├── 07-void-operator-1.js       # void 运算符(基础):返回 undefined / 阻止跳转
    ├── 07-void-operator-2.js       # void 运算符(扩展):有名函数 + IIFE + 递归
    └── 08-typeof.js                # typeof:8 种返回值、与 undefined 比较的坑
```

## 使用方法

```bash
# 运行单个示例
npm run start        # 基础语法
npm run basics       # 同上
npm run types        # 类型与转换
npm run control      # 控制流
npm run functions    # 函数
npm run objects      # 对象与数组
npm run async        # 异步编程
npm run void         # void 运算符 (基础)
npm run void2        # void 运算符 (扩展:有名函数 + 递归)
npm run typeof       # typeof 运算符

# 依次运行所有示例
npm run all
```

## 学习顺序建议

1. `01-basics.js` — 熟悉变量、字符串、Number
2. `02-types-and-coercion.js` — 理解 7 种原始类型、隐式/显式转换
3. `03-control-flow.js` — 条件、循环、数组函数式方法
4. `04-functions.js` — 函数声明、箭头函数、闭包、递归
5. `05-objects-and-arrays.js` — 解构、扩展、可选链、Map/Set
6. `06-async-await.js` — Promise、async/await、并发
7. `07-void-operator-1.js` — `void` 运算符基础:返回 undefined、IIFE、阻止跳转
8. `07-void-operator-2.js` — `void` 运算符扩展:有名函数 IIFE、递归闭包
9. `08-typeof.js` — `typeof` 的 8 种返回值、未声明容错、与字符串 `'undefined'` 比较

## 关键提示

- ES Module 模式(`type: "module"`),用 `import` / `export`,而不是 `require`
- 始终使用 `===` 而非 `==`
- 默认使用 `const`,需要重新赋值时才用 `let`,不用 `var`
- 优先用 `?.`(可选链)和 `??`(空值合并)
- 异步优先用 `async/await`,而不是 `.then()` 链