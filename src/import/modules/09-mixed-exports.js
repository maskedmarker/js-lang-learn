// 09 - import 专题 / 模块
// 演示:default + named 混用

// 默认导出
export default function calculateDiscount(price, rate = 0.1) {
  return price * (1 - rate);
}

// 命名导出
export const TAX_RATE = 0.13;
export const FREE_SHIPPING_THRESHOLD = 99;

export function formatPrice(value) {
  return `¥${value.toFixed(2)}`;
}
