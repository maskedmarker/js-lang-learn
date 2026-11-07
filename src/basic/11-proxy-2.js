
// Reflect.get(target, property, receiver) 的第三个参数 receiver 是用来指定 getter 内部的 this 指向的对象。
(function() {
  const target = {
    get info() {
      return this.value;
    },

    value: 100
  };

  const receiver = {
    value: 200
  };

  console.log(Reflect.get(target, 'info', receiver)); // 200
})();



// 为什么 Reflect.get(target, property, receiver) 能改变 getter 中的 this，而 target[property] 不能？
// 这里涉及 JavaScript 的一个重要概念：属性访问表达式（Property Access）与函数调用时的 this 绑定机制。
(function() {
  const target = {
    value: 100,

    get info() {
      console.log('getter this === target:', this === target);
      return this.value;
    }
  };

  // 方式一：直接使用 target[property]
  const proxy1 = new Proxy(target, {
    get(target, property, receiver) {
      return target[property];
    }
  });

  // target[property] 本质上是在 target 上执行属性访问。当访问到 getter 时，getter 的 this 就是 target。
  console.log(proxy1.info);  // getter this === target: true



  // 方式二：使用 Reflect.get
  const proxy2 = new Proxy(target, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    }
  });

  console.log(proxy2.info);   // getter this === target: false   getter 中的 this是 receiver
})();



// 更重要的区别：是否能够继续触发 Proxy 拦截
(function() {
  const target = {
    value: 100,

    get info() {
      return this.value;
    }
  };

  const proxy = new Proxy(target, {
    get(target, property, receiver) {
      console.log('拦截属性:', property);

      return target[property];
    }
  });

  console.log(proxy.info);  // 拦截属性: info
})();
/*
你可能会问：

为什么没有输出 拦截属性: value？

原因是：
1. 访问 proxy.info，触发 Proxy 的 get 拦截器。
2. 执行 target[property]，也就是 target.info。
3. getter 中的 this 指向 target。
4. getter 执行 this.value，实际访问的是 target.value。
5. 访问的是原始对象 target，因此不会再次触发 proxy 的 get 拦截器。

*/


(function() {
  const target = {
    value: 100,

    get info() {
      return this.value;
    }
  };

  const proxy = new Proxy(target, {
    get(target, property, receiver) {
      console.log('拦截属性:', property);

      return Reflect.get(target, property, receiver);
    }
  });

  console.log(proxy.info);
})();

/**
输出
拦截属性: info
拦截属性: value

这次发生了什么？
1. 访问 proxy.info，触发 get 拦截器。
2. Reflect.get(target, 'info', proxy) 执行 getter。
3. getter 内部的 this 指向 proxy。
4. getter 执行 this.value，相当于 proxy.value。
5. 再次触发 Proxy 的 get 拦截器。
这就是 receiver 的一个非常重要的价值：让 getter 内部的属性访问仍然经过 Proxy，从而保留代理行为。
 */
