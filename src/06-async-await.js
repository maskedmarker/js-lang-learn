// 06 - 异步编程
// Promise、async/await、错误处理、并行

const title = '06 - 异步编程';
console.log('=== ' + title + ' ===');
console.log('');

// ========== 1. setTimeout / setInterval ==========
console.log('--- 1. setTimeout ---');
console.log('  开始');
setTimeout(() => console.log('  1 秒后执行'), 1000);
console.log('  结束 (不会阻塞)');
await new Promise(r => setTimeout(r, 1100));
console.log('');

// ========== 2. Promise 基础 ==========
console.log('--- 2. Promise ---');
function fetchData(success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve({ id: 1, name: '数据加载成功' });
      } else {
        reject(new Error('加载失败'));
      }
    }, 500);
  });
}

// then/catch 链式调用
const result = await fetchData(true)
  .then(data => {
    console.log('  then 收到:', data);
    return data.name;     // 传给下一个 then
  })
  .catch(err => {
    console.error('  catch:', err.message);
    return null;
  })
  .finally(() => {
    console.log('  finally: 无论成功失败都执行');
  });
console.log('  最终结果:', result);
console.log('');

// ========== 3. async/await (推荐写法) ==========
console.log('--- 3. async/await ---');
async function loadUser() {
  try {
    const data = await fetchData(true);
    console.log('  await 得到:', data);
    return data;
  } catch (err) {
    console.error('  出错了:', err.message);
  }
}
await loadUser();
console.log('');

// ========== 4. 错误处理 ==========
console.log('--- 4. 错误处理 ---');
async function safeCall(shouldFail) {
  try {
    await fetchData(!shouldFail);
    console.log('  调用成功');
  } catch (err) {
    console.log('  捕获到错误:', err.message);
  }
}
await safeCall(false);   // 成功
await safeCall(true);    // 失败
console.log('');

// ========== 5. 并行执行 ==========
console.log('--- 5. 并行: Promise.all ---');
async function task1() {
  await new Promise(r => setTimeout(r, 300));
  return '任务 1 完成';
}
async function task2() {
  await new Promise(r => setTimeout(r, 200));
  return '任务 2 完成';
}
async function task3() {
  await new Promise(r => setTimeout(r, 100));
  return '任务 3 完成';
}

const t0 = Date.now();
const results = await Promise.all([task1(), task2(), task3()]);
console.log('  Promise.all 结果:', results);
console.log(`  总耗时 ${Date.now() - t0}ms (并行 ≈ 最慢的那个 ~300ms)`);
console.log('');

// ========== 6. Promise.allSettled (全部完成,无论成功失败) ==========
console.log('--- 6. Promise.allSettled ---');
const settled = await Promise.allSettled([
  Promise.resolve('成功'),
  Promise.reject('失败原因'),
  Promise.resolve('又成功'),
]);
console.log('  allSettled:', settled.map(r => r.status));
console.log('');

// ========== 7. Promise.race (谁先完成就用谁的结果) ==========
console.log('--- 7. Promise.race ---');
const raced = await Promise.race([
  new Promise(r => setTimeout(() => r('A'), 200)),
  new Promise(r => setTimeout(() => r('B'), 500)),
  new Promise(r => setTimeout(() => r('C'), 100)),
]);
console.log('  race 胜出:', raced);
console.log('');

// ========== 8. 顶层 await (ES Module 支持) ==========
console.log('--- 8. 顶层 await ---');
const data = await fetchData(true);
console.log('  顶层 await 数据:', data);
console.log('');

// ========== 9. 真实场景:串行依赖 vs 并发 ==========
console.log('--- 9. 串行 vs 并发 ---');

async function fakeApi(id, delay) {
  await new Promise(r => setTimeout(r, delay));
  return { id, data: `id=${id} 的结果` };
}

// 串行:慢 (总耗时 ≈ 各任务之和)
const s0 = Date.now();
const s1 = await fakeApi(1, 100);
const s2 = await fakeApi(2, 100);
const s3 = await fakeApi(3, 100);
console.log(`  串行耗时 ${Date.now() - s0}ms`);

// 并发:快 (总耗时 ≈ 最慢那个)
const p0 = Date.now();
const allResults = await Promise.all([
  fakeApi(1, 100),
  fakeApi(2, 100),
  fakeApi(3, 100),
]);
console.log(`  并发耗时 ${Date.now() - p0}ms`);
console.log('');

// ========== 10. AbortController (取消请求) ==========
console.log('--- 10. AbortController ---');
const controller = new AbortController();

const longTask = new Promise((resolve, reject) => {
  const timer = setTimeout(() => resolve('完成了'), 5000);
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timer);
    reject(new Error('被中止了'));
  });
});

setTimeout(() => controller.abort(), 200);   // 200ms 后取消

try {
  await longTask;
} catch (err) {
  console.log('  任务:', err.message);
}
console.log('');

console.log('=== 所有异步示例完成 ===');