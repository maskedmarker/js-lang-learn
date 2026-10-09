// 09 - import 专题 / 模块
// 演示:重命名 export

const originalName = '原始名';
function originalFn() {
  return '原始函数';
}

// 导出时改名,导入方只能按导出的别名导入
export {
  originalName as renamed,
  originalFn as exportedFn,
};
