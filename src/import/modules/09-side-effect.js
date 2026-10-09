// 09 - import 专题 / 模块
// 演示:副作用导入 (side-effect import)
// 这个文件被 import 时,会执行顶层代码,通常用来:
//   - 注册全局副作用(Polyfill / 样式 / 埋点)
//   - 给原型挂方法(可争议做法)
//   - 立即初始化一些东西

console.log('  [side-effect 模块被加载,执行了顶层代码!]');

// 在 window / globalThis 上挂个方法
globalThis.__sideEffectFlag = true;

// 模拟一个 polyfill
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
  console.log('  [side-effect] 装上了 Array.prototype.last polyfill');
}
