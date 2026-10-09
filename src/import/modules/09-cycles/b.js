// 09 - import 专题 / 模块 - 循环依赖
// 模块 B (反向引用 A,形成循环)

import { sayHelloFromA } from './a.js';

export function sayHelloFromB() {
  return 'B 打招呼';
}

// B 的顶层也用 A 的导出
const aGreeting = sayHelloFromA();
export const bHeard = aGreeting;

console.log('  [B 模块] 已加载,bHeard =', JSON.stringify(aGreeting));
