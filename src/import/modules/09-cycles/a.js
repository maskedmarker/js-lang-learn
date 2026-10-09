// 09 - import 专题 / 模块 - 循环依赖
// 模块 A

import { sayHelloFromB } from './b.js';

export function sayHelloFromA() {
  return 'A 打招呼';
}

// 在 A 的顶层立即调用 B
const message = sayHelloFromB();
export const aHeard = message;

console.log('  [A 模块] 已加载,aHeard =', JSON.stringify(message));
