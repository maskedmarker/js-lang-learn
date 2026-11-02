const title = '12-function-object - 函数与对象';
console.log('=== ' + title + ' ===\n');


// =============================================================================
/* 
     1. 函数不仅可以被调用，本身也是一个对象，可以拥有属性

*/
// =============================================================================

function Person(name) {
  this.name = name;
}

Person.description = "用于创建 Person 实例的函数";

console.log(Person.description); // 用于创建 Person 实例的函数

console.log(typeof Person); // "function"

/*
这里发生了两件事：
- Person 可以被调用，也可以在适当情况下通过 new 调用。
- Person 可以拥有属性，例如 description 和 prototype。

这说明 JavaScript 中的函数不只是可执行的代码，还具有对象的特征。

从 ECMAScript 规范的角度来说，函数是具有可调用能力的对象。
更准确地说，函数对象实现了内部的 [[Call]] 方法；能够作为构造函数的函数对象还具有 [[Construct]] 方法。


“函数对象”和“对象”是什么关系？

术语	                         强调的含义
对象（object）	               具有属性等对象特征的实体
函数（function）	          强调可调用的行为或函数语法
函数对象（function object）	强调一个函数同时也是对象，具有对象属性和内部方法
*/

