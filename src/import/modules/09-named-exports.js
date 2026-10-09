// 09 - import 专题 / 模块
// 演示:命名导出 (named exports) - 逐个导出

export const COURSE = 'JavaScript 入门';
export const LEVEL = 'beginner';

// 逐个 export
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 也可以先声明再 export
const author = '张三';
const version = '1.0.0';
export { author, version };
