// 09 - import 专题 / 模块
// 演示:Node 内置模块 (node: 前缀)

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { __filename, __dirname };

// 演示一些 path 用法
export const basename = path.basename(__filename);
export const extname = path.extname(__filename);
