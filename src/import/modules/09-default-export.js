// 09 - import 专题 / 模块
// 演示:默认导出 (default export)

const PI = 3.14159;
const E = 2.71828;

function circleArea(r) {
  return PI * r * r;
}

function greet(name = '世界') {
  return `你好,${name}!`;
}

// 默认导出:一个模块里只能有一个 default
// 名字可以随便取(导入侧决定叫它什么)
export default {
  PI,
  E,
  circleArea,
  greet,
};
