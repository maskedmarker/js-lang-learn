// 依次运行所有学习示例
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessons = [
  '01-basics.js',
  '02-types-and-coercion.js',
  '03-control-flow.js',
  '04-functions.js',
  '05-objects-and-arrays.js',
  '06-async-await.js',
  '07-void-operator.js',
];

console.log('=== JavaScript 学习 - 全部示例 ===\n');

for (const lesson of lessons) {
  const file = path.join(__dirname, 'src', lesson);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`▶ 运行: ${lesson}`);
  console.log('='.repeat(60));

  await new Promise((resolve) => {
    const child = spawn(process.execPath, [file], { stdio: 'inherit' });
    child.on('close', resolve);
  });
}

console.log('\n=== 全部完成! ===');