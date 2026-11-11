// 11-proxy - Proxy(代理)完全讲解
// 核心概念:拦截器(handler)/ trap(陷阱) / Reflect 转发 / receiver / 响应式 / 实战场景

const title = '11-proxy - Proxy(代理)完全讲解';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 1. 什么是 Proxy:从"直接操作"到"经过一道闸门"
// =============================================================================
console.log('--- 1. 什么是 Proxy ---');
console.log(`
  直接操作:
    const obj = { a: 1 };
    obj.a          // 直接读写对象

  使用代理:
    new Proxy(obj, handler) 在 obj 外面包一层"拦截器"
    - 对 proxy 的任何操作,都会先经过 handler 里对应的 trap(陷阱函数)
    - trap 决定:放行 / 修改 / 拒绝,并决定是否转发给真实 target

  典型用途:
    1) 属性校验 / 只读保护 / 私有属性
    2) 日志、埋点(不改原代码)
    3) 缓存、默认值、负索引等"魔法行为"
    4) 响应式框架(Vue3 的 reactive 底层就是 Proxy)
    5) 权限控制(Proxy.revocable 可撤销代理)
`);
console.log('');

// =============================================================================
// 2. 基本语法:new Proxy(target, handler) 与 13 个 trap
// =============================================================================
console.log('--- 2. 基本语法:new Proxy(target, handler) ---');
const raw2 = { name: 'Alice', age: 18 };
const transparent2 = new Proxy(raw2, {});   // handler 为空 → 完全透明
console.log('  transparent2.name:', transparent2.name);      // Alice
console.log('  transparent2 === raw2:', transparent2 === raw2);  // false(代理 ≠ 目标)
console.log(`
  13 个 trap(对应 13 种底层操作):
    属性类: get / set / has / deleteProperty / defineProperty
    键类:   ownKeys / getOwnPropertyDescriptor
    原型类: getPrototypeOf / setPrototypeOf
    扩展类: isExtensible / preventExtensions
    调用类: apply(函数调用) / construct(new)

  handler 里没定义的 trap → 走默认行为(等价于 Reflect 直接转发)。
  所以 new Proxy(target, {}) 就是"完全透明"的代理。
  Proxy 属于"元编程"(Meta Programming)能力。
`);
console.log('');

// =============================================================================
// 3. get trap:读取拦截(日志 / 私有属性 / 默认值 / 忘记转发的坑)
// =============================================================================
console.log('--- 3. get trap:读取拦截 ---');
const user3 = { name: 'Alice', age: 18 };
const userProxy3 = new Proxy(user3, {
  get(target, prop, receiver) {
    console.log(`    [get] 读取属性: ${String(prop)}`);
    return Reflect.get(target, prop, receiver);   // 转发给真实对象
  },
});
console.log('  userProxy3.name =', userProxy3.name);
console.log('  userProxy3.age  =', userProxy3.age);
console.log('');

console.log('  3.1 私有属性保护(_ 前缀禁止读取)');
const secretApi3 = new Proxy(
  { _password: 'hunter2', token: 'abc123' },
  {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop.startsWith('_')) {
        throw new Error(`禁止读取私有属性 ${prop}`);
      }
      return Reflect.get(target, prop, receiver);
    },
  }
);
console.log('  secretApi3.token =', secretApi3.token);       // abc123
try {
  console.log(secretApi3._password);
} catch (e) {
  console.log(`  拦截成功 → ${e.name}: ${e.message}`);
}
console.log('');

console.log('  3.2 缺省值:不存在的属性返回 0 而不是 undefined');
const withDefault3 = new Proxy({}, {
  get(target, prop, receiver) {
    if (prop in target) return Reflect.get(target, prop, receiver);
    return 0;                          // ← 缺省值
  },
});
console.log('  withDefault3.count(未赋值) =', withDefault3.count);  // 0
withDefault3.count = 5;
console.log('  withDefault3.count(已赋值) =', withDefault3.count);  // 5
console.log('');

console.log('  3.3 坑:trap 里忘记转发 → 默认行为丢失');
const broken3 = new Proxy({ a: 1 }, {
  get(target, prop) {
    if (prop === 'a') return '被劫持了!';
    // 其它属性忘了 return Reflect.get(...) → 一律 undefined
  },
});
console.log('  broken3.a        =', broken3.a);            // 被劫持了!
console.log('  broken3.toString =', broken3.toString);     // undefined!(本来是函数)
console.log(`
  规则:trap 必须显式转发,否则就"接管"了这个操作。
  不确定怎么写时,用对应的 Reflect.xxx 转发即可。
`);
console.log('');

// =============================================================================
// 4. set trap:写入拦截(校验 / 只读)
// =============================================================================
console.log('--- 4. set trap:写入拦截 ---');
const validated4 = new Proxy({}, {
  set(target, prop, value, receiver) {
    if (prop === 'age') {
      if (!Number.isInteger(value) || value < 0 || value > 150) {
        throw new RangeError(`age 必须是 0~150 的整数,收到: ${value}`);
      }
    }
    return Reflect.set(target, prop, value, receiver);
  },
});
validated4.name = 'Alice';
validated4.age = 25;
console.log('  合法写入:', validated4);                      // { name: 'Alice', age: 25 }
try { validated4.age = -1; } catch (e) { console.log(`  ${e.name}: ${e.message}`); }
try { validated4.age = 'old'; } catch (e) { console.log(`  ${e.name}: ${e.message}`); }
console.log('');

console.log('  4.1 set 返回 false → ESM(严格模式)下抛 TypeError');
const readonly4 = new Proxy({ n: 1 }, {
  set() { return false; }                // 一律拒绝写入
});
try {
  readonly4.n = 2;
} catch (e) {
  console.log(`  写入被拒 → ${e.name}`);
}
console.log('  readonly4.n 仍是:', readonly4.n);            // 1
console.log(`
  注意:如果不想抛错而是"静默忽略",return true 即可(假装成功)。
`);
console.log('');

// =============================================================================
// 5. has 与 deleteProperty:in / delete 拦截
// =============================================================================
console.log('--- 5. has 与 deleteProperty ---');
const range5 = new Proxy({ min: 1, max: 10 }, {
  has(target, prop) {
    if (prop === 'min' || prop === 'max') return Reflect.has(target, prop);
    return false;                       // 其它属性一律"不存在"
  },
});
console.log(`  'min' in range5:`, 'min' in range5);              // true
console.log(`  'max' in range5:`, 'max' in range5);              // true
console.log(`  'toString' in range5:`, 'toString' in range5);    // false!连原型链上的都拦掉
console.log(`
  注意:has 只拦截 in 操作符;
  hasOwnProperty / Object.keys 走的是 getOwnPropertyDescriptor / ownKeys(见第 6 节)。
`);
console.log('');

console.log('  5.1 deleteProperty:保护关键字段不被删除');
const keeper5 = new Proxy({ id: 1, temp: 2 }, {
  deleteProperty(target, prop) {
    if (prop === 'id') {
      console.log('    [deleteProperty] id 的删除被静默忽略(return true 谎报成功)');
      return true;
    }
    return Reflect.deleteProperty(target, prop);
  },
});
delete keeper5.temp;        // 真删
delete keeper5.id;          // 被忽略
console.log('  keeper5 =', keeper5);                          // { id: 1 }
console.log('');

// =============================================================================
// 6. ownKeys 与 getOwnPropertyDescriptor:隐藏属性
// =============================================================================
console.log('--- 6. ownKeys 与 getOwnPropertyDescriptor:隐藏属性 ---');
const hidden6 = new Proxy({ a: 1, secret: 3 }, {
  ownKeys(target) {
    return Reflect.ownKeys(target);            // 照常返回全部 key
  },
  getOwnPropertyDescriptor(target, prop) {
    if (prop === 'secret') return undefined;   // 唯独 secret 假装"没有描述符"
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },
});
console.log('  Object.keys(hidden6)    =', Object.keys(hidden6));            // [ 'a' ]
console.log('  JSON.stringify(hidden6)  =', JSON.stringify(hidden6));         // {"a":1}
console.log('  hasOwnProperty("secret") =', Object.prototype.hasOwnProperty.call(hidden6, 'secret'));  // false
console.log('  直接读 hidden6.secret    =', hidden6.secret);                  // 3 —— 依然能读!
console.log(`  'secret' in hidden6      =`, 'secret' in hidden6);             // true —— in 走 has,没拦
console.log(`
  结论:"隐藏"只影响枚举(keys / JSON / for...in),不是真删除:
    - Object.keys / JSON.stringify:ownKeys 列出 key → 逐个查描述符 → 过滤
    - 直接读属性:走 get trap(没拦)
    - in 操作符:走 has trap(没拦)
  想彻底拦住,需要 get / has / ownKeys / getOwnPropertyDescriptor 一起配合。
`);
console.log('');

// =============================================================================
// 7. defineProperty / getPrototypeOf / setPrototypeOf:其余常用 trap
// =============================================================================
console.log('--- 7. defineProperty / getPrototypeOf / setPrototypeOf ---');
const typed7 = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(`    [defineProperty] ${String(prop)}: value=${descriptor.value}, enumerable=${descriptor.enumerable}`);
    return Reflect.defineProperty(target, prop, descriptor);
  },
});
Object.defineProperty(typed7, 'x', { value: 1, enumerable: true });   // 直接触发 trap
typed7.y = 2;   // 没定义 set trap → 默认 set 行为落到 receiver(代理)的 defineProperty 上
console.log('  typed7 =', typed7);
console.log(`
  意外发现:typed7.y = 2 居然触发了 defineProperty!
  原因:没定义 set trap 时,默认 set 会走 target.[[Set]](receiver = 代理),
       plain object 的 set 最后调用 receiver.[[DefineOwnProperty]] → 触发代理的 defineProperty。
`);
console.log('');

console.log('  7.0 细坑:Reflect.set 转发 receiver → set 和 defineProperty 双双触发');
const both7 = new Proxy({}, {
  set(target, prop, value, receiver) {
    console.log(`    [set] ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value, receiver);   // receiver = 代理
  },
  defineProperty(target, prop, descriptor) {
    console.log(`    [defineProperty] ${String(prop)}`);
    return Reflect.defineProperty(target, prop, descriptor);
  },
});
both7.a = 1;    // [set] + [defineProperty] 都触发(Reflect.set 的 receiver 是代理)
console.log('');
const onlySet7 = new Proxy({}, {
  set(target, prop, value) {
    console.log(`    [set] ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value);   // 不传 receiver → 直接写 target
  },
  defineProperty(target, prop, descriptor) {
    console.log(`    [defineProperty] ${String(prop)}`);
    return Reflect.defineProperty(target, prop, descriptor);
  },
});
onlySet7.b = 2;    // 只有 [set](没传 receiver,写的是 target 本身)
console.log(`
  结论:Reflect.set(target, prop, value, receiver) 里 receiver 传代理时,
       写入最终会通过 receiver 的 defineProperty 落地 → 两个 trap 都会触发。
       如果不想让 defineProperty 被顺带触发,就省略 receiver。
       (但省略 receiver 会让 setter 里的 this 指向 target,和 get 是同一个权衡)
`);
console.log('');

console.log('  7.1 getPrototypeOf:伪装"没有原型"');
const fakeProto7 = new Proxy({}, {
  getPrototypeOf() { return null; }
});
console.log('  Object.getPrototypeOf(fakeProto7) =', Object.getPrototypeOf(fakeProto7));  // null
console.log('  fakeProto7 instanceof Object       =', fakeProto7 instanceof Object);      // false
console.log('');

console.log('  7.2 setPrototypeOf:禁止修改原型');
const noProto7 = new Proxy({}, {
  setPrototypeOf() {
    console.log('    [setPrototypeOf] 阻止修改原型');
    return false;                 // ESM 严格模式 → TypeError
  },
});
try {
  Object.setPrototypeOf(noProto7, Array.prototype);
} catch (e) {
  console.log(`  拦截成功 → ${e.name}`);
}
console.log('');

// =============================================================================
// 8. apply trap:拦截函数调用(日志 / 缓存)
// =============================================================================
console.log('--- 8. apply trap:拦截函数调用 ---');
function add8(a, b) {
  return a + b;
}
const loggedAdd8 = new Proxy(add8, {
  apply(target, thisArg, args) {
    console.log(`    [apply] 调用参数: [${args.join(', ')}]`);
    const result = Reflect.apply(target, thisArg, args);
    console.log(`    [apply] 返回结果: ${result}`);
    return result;
  },
});
console.log('  loggedAdd8(2, 3) =', loggedAdd8(2, 3));
console.log('');

console.log('  8.1 实战:通用 memoize(缓存计算结果)');
function memoize8(fn) {
  const cache = new Map();
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);
      if (!cache.has(key)) {
        cache.set(key, Reflect.apply(target, thisArg, args));
      }
      return cache.get(key);
    },
  });
}
let fib8;
fib8 = memoize8(function fibImpl(n) {
  if (n < 2) return n;
  return fib8(n - 1) + fib8(n - 2);   // 递归调用的是代理 → 全部命中缓存
});
console.log('  fib8(30) =', fib8(30));                    // 832040,瞬间出结果
console.log(`
  技巧:递归内部引用的是代理(fib8),所以每一层都经过缓存。
  (注意函数表达式不能命名为 fib8,否则内部递归会绕开代理)
`);
console.log('');

// =============================================================================
// 9. construct trap:拦截 new(构造日志 / 强制 new)
// =============================================================================
console.log('--- 9. construct trap:拦截 new ---');
class Point9 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const PointProxy9 = new Proxy(Point9, {
  construct(target, args, newTarget) {
    console.log(`    [construct] new 参数: [${args.join(', ')}]`);
    return Reflect.construct(target, args, newTarget);
  },
});
const p9 = new PointProxy9(3, 4);
console.log('  p9 =', p9);                              // Point9 { x: 3, y: 4 }
console.log('  p9 instanceof Point9:', p9 instanceof Point9);   // true
console.log('');

console.log('  9.1 实战:强制 new(忘写 new 也不会挂)');
function Person9(name) {
  this.name = name;
}
const StrictPerson9 = new Proxy(Person9, {
  apply(target, thisArg, args) {
    console.log('    [apply] 没写 new,自动补上');
    return Reflect.construct(target, args);
  },
});
const alice9 = StrictPerson9('Alice');     // ← 没有 new!
console.log('  alice9 =', alice9);                         // Person9 { name: 'Alice' }
console.log('  alice9 instanceof Person9:', alice9 instanceof Person9);  // true
console.log('');

// =============================================================================
// 10. Proxy.revocable:可撤销代理
// =============================================================================
console.log('--- 10. Proxy.revocable:可撤销代理 ---');
const { proxy: revProxy10, revoke: revoke10 } = Proxy.revocable(
  { n: 1 },
  {
    get(target, prop, receiver) {
      console.log(`    [get] 读取 ${String(prop)}`);
      return Reflect.get(target, prop, receiver);
    },
  }
);
console.log('  revoke 前 revProxy10.n =', revProxy10.n);    // 1
revoke10();                                    // 撤销!之后一切操作抛 TypeError
try {
  revProxy10.n;
} catch (e) {
  console.log(`  revoke 后 → ${e.name}: ${e.message.slice(0, 55)}`);
}
console.log(`
  典型场景:临时授权/一次性资源,权限到期后彻底作废,外部还持有引用也访问不了。
`);
console.log('');

// =============================================================================
// 11. Reflect 与 receiver:getter 里 this 指向谁(重点!)
// =============================================================================
console.log('--- 11. Reflect 与 receiver:getter 的 this 绑定 ---');
const target11 = {
  _value: 10,
  get value() {
    return this._value;      // this 是谁,取决于 get trap 怎么转发
  },
};

let readsA11 = 0;
const proxyA11 = new Proxy(target11, {
  get(t, p, r) {
    readsA11++;
    return Reflect.get(t, p, r);     // 转发 receiver → getter 的 this = 代理本身
  },
});
console.log('  proxyA11.value =', proxyA11.value);
console.log('  get 被触发次数:', readsA11);          // 2 次:value + _value(内部读取也经过代理)

let readsB11 = 0;
const proxyB11 = new Proxy(target11, {
  get(t, p) {
    readsB11++;
    return t[p];                     // 直接读 target → getter 的 this = target
  },
});
console.log('  proxyB11.value =', proxyB11.value);
console.log('  get 被触发次数:', readsB11);          // 1 次:_value 绕过了代理
console.log(`
  区别:
    - 转发 receiver:getter 内部的 this 是代理,内部读取也会走代理
      (响应式框架依赖这一点,才能收集到嵌套属性的依赖)
    - 不转发 receiver:getter 内部的 this 是 target,内部读取绕过代理
      (日志漏记、依赖漏收集)
  结论:get trap 里尽量写 Reflect.get(target, prop, receiver),除非有意为之。
`);
console.log('');

// =============================================================================
// 12. 实战 1:reactive 响应式(简化版 Vue3)
// =============================================================================
console.log('--- 12. 实战:reactive 响应式(简化版 Vue3) ---');
function reactive12(initial) {
  const watchers = new Set();
  const state = new Proxy(initial, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const old = target[prop];
      const ok = Reflect.set(target, prop, value, receiver);
      if (ok && old !== value) {
        watchers.forEach((fn) => fn(prop, value, old));   // 通知所有订阅者
      }
      return ok;
    },
  });
  return {
    state,
    watch(fn) { watchers.add(fn); },
  };
}

const { state: state12, watch: watch12 } = reactive12({ count: 0, user: 'Alice' });
watch12((prop, value, old) => {
  console.log(`    [响应式] ${String(prop)}: ${old} → ${value}`);
});
state12.count = 1;         // 触发通知
state12.count += 2;        // 读旧值 + 写新值 → 触发通知
state12.user = 'Bob';      // 触发通知
console.log('  最终 state12:', state12);
console.log(`
  原理:赋值走 set trap → 与旧值比较 → 通知 watcher。
  Vue3 的 reactive/ref 就是这个思路(加上依赖收集 track/trigger、深层代理)。
`);
console.log('');

// =============================================================================
// 13. 实战 2:负索引数组
// =============================================================================
console.log('--- 13. 实战:负索引数组 ---');
function negativeIndex13(arr) {
  return new Proxy(arr, {
    get(t, p, r) {
      if (typeof p === 'string' && /^-\d+$/.test(p)) {
        return Reflect.get(t, t.length + Number(p), r);   // -1 → length-1
      }
      return Reflect.get(t, p, r);
    },
    set(t, p, v, r) {
      if (typeof p === 'string' && /^-\d+$/.test(p)) {
        return Reflect.set(t, t.length + Number(p), v, r);
      }
      return Reflect.set(t, p, v, r);
    },
  });
}
const arr13 = negativeIndex13([10, 20, 30]);
console.log('  arr13[-1] =', arr13[-1]);                  // 30
console.log('  arr13[-2] =', arr13[-2]);                  // 20
arr13[-1] = 99;                                          // 改最后一个元素
console.log('  修改后 arr13:', arr13);                    // [ 10, 20, 99 ]
console.log('  arr13.map(x => x * 2):', arr13.map((x) => x * 2));   // [ 20, 40, 198 ]
console.log(`
  注意:只有字符串形式的负数才特殊处理;'map'、'length'、Symbol 等照常转发,
  所以数组原有方法完全不受影响。
`);
console.log('');

// =============================================================================
// 14. 实战 3:深路径安全访问(永不报 undefined 错)
// =============================================================================
console.log('--- 14. 实战:深路径安全访问 safe() ---');
function safe14(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop in target) {
        const value = Reflect.get(target, prop, receiver);
        // 对象/数组继续包代理,基本类型直接返回
        return value !== null && typeof value === 'object' ? safe14(value) : value;
      }
      return safe14({});       // 路径不存在 → 返回空代理,链式访问永不报错
    },
  });
}
const data14 = safe14({ user: { profile: { name: 'Alice' } } });
console.log('  data14.user.profile.name     =', data14.user.profile.name);   // Alice
console.log('  data14.user.missing.deep     =', data14.user.missing.deep);   // {} 空代理
console.log(`  'missing' in data14.user     =`, 'missing' in data14.user);   // false —— in 走默认行为
console.log(`
  两个必须知道的坑:
    1) 不存在的路径返回空代理({}),不是 undefined!
       if (data14.user.missing) 永远为真 → 判断存在性请用 'missing' in data14.user
    2) 每次访问都生成新代理,身份不稳定:
       data14.user === data14.user   → false
`);
console.log('');

// =============================================================================
// 15. 常见坑汇总
// =============================================================================
console.log('--- 15. 常见坑汇总 ---');
console.log('  坑1:get trap 忘记转发 → 其它属性全部 undefined(见第 3 节)');
console.log('  坑2:set / deleteProperty / defineProperty 返回 false → ESM 严格模式抛 TypeError(见第 4/5/7 节)');
console.log('');

console.log('  坑3:违反"不变量"(invariant) → TypeError');
const frozen15 = Object.freeze({ x: 1 });
const badGet15 = new Proxy(frozen15, { get() { return 999; } });
try {
  console.log('  badGet15.x =', badGet15.x);
} catch (e) {
  console.log(`  不可写不可配置属性必须返回真实值 → ${e.name}: ${e.message.slice(0, 72)}...`);
}
const locked15 = Object.preventExtensions({ a: 1 });
const badKeys15 = new Proxy(locked15, { ownKeys() { return ['a', 'ghost']; } });
try {
  console.log('  Object.keys(badKeys15) =', Object.keys(badKeys15));
} catch (e) {
  console.log(`  不可扩展对象不能多出 key → ${e.name}: ${e.message.slice(0, 72)}...`);
}
console.log('');

console.log('  坑4:代理不是目标,身份完全不同');
const t15 = { a: 1 };
const p15 = new Proxy(t15, {});
console.log('  p15 === t15:', p15 === t15);                              // false
console.log('  new Set([p15]).has(t15):', new Set([p15]).has(t15));      // false
console.log('  typeof p15:', typeof p15);                                 // object(无法伪装 typeof)
console.log('');

console.log('  坑5:私有字段 # 无法通过代理访问');
class Secret15 {
  #x = 1;
  read() { return this.#x; }
}
const s15 = new Secret15();
console.log('  s15.read() =', s15.read());        // 1 —— 直接调用没问题
const sp15 = new Proxy(s15, {});
try {
  console.log('  sp15.read() =', sp15.read());
} catch (e) {
  console.log(`  代理上调用 → ${e.name}: ${e.message}`);
}
console.log('');

console.log('  坑6:深代理身份不稳定、空代理恒真值(见第 14 节)');
console.log('  坑7:性能 —— 每次属性访问都多一层函数调用,热路径慎用');
console.log('  坑8:receiver 不转发 → getter 的 this 指向 target(见第 11 节)');
console.log('');

// =============================================================================
// 16. 速查表:13 个 trap
// =============================================================================
console.log('--- 16. 速查表:13 个 trap ---');
console.log(`
  ┌───────────────────────────┬──────────────────────────────────────────┐
  │ trap                      │ 拦截的操作                               │
  ├───────────────────────────┼──────────────────────────────────────────┤
  │ get(t, p, r)              │ obj.p 读取属性                           │
  │ set(t, p, v, r)           │ obj.p = v 写入属性                       │
  │ has(t, p)                 │ p in obj                                 │
  │ deleteProperty(t, p)      │ delete obj.p                             │
  │ defineProperty(t, p, d)   │ Object.defineProperty                    │
  │ ownKeys(t)                │ Object.keys / getOwnPropertyNames / for..in│
  │ getOwnPropertyDescriptor  │ Object.getOwnPropertyDescriptor / hasOwn │
  │ getPrototypeOf(t)         │ Object.getPrototypeOf / instanceof       │
  │ setPrototypeOf(t, p)      │ Object.setPrototypeOf                    │
  │ isExtensible(t)           │ Object.isExtensible                      │
  │ preventExtensions(t)      │ Object.preventExtensions                 │
  │ apply(t, thisArg, args)   │ fn(...) 函数调用                         │
  │ construct(t, args, nt)    │ new fn(...)                              │
  └───────────────────────────┴──────────────────────────────────────────┘

  三条铁律:
    1) trap 里转发用 Reflect.xxx(target, ...),别直接 target[p](getter 的 this 会错)
    2) 布尔型 trap(set / deleteProperty / defineProperty 等)要 return 转发结果
    3) 不变量:不可配置/不可扩展对象的 trap 不能"撒谎",否则 TypeError
`);

console.log('\n=== ' + title + ' 结束 ===');
