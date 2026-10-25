const title = '13-instance-of - instanceof 操作符';
console.log('=== ' + title + ' ===\n');

// =============================================================================
/* 
     1. instanceof 的判断规则

     JavaScript 中的 instanceof 判断的是构造函数的 prototype 属性所指向的对象，是否出现在被检测对象的原型链上
*/
// =============================================================================

function Person() {}

const alice = new Person();

// 执行 new Person() 后，alice 的原型链上包含 Person.prototype。
console.log("Object.getPrototypeOf(alice) === Person.prototype :", Object.getPrototypeOf(alice) === Person.prototype); // true
console.log("alice instanceof Person :", alice instanceof Person); // true

// 为什么 Object instanceof Function 是 true？
console.log("Object.getPrototypeOf(Object) === Function.prototype :", Object.getPrototypeOf(Object) === Function.prototype); // true
console.log("Object instanceof Function :", Object instanceof Function); // true


// 为什么 Object instanceof Object 也是 true？
console.log("Object.getPrototypeOf(Object) === Function.prototype :", Object.getPrototypeOf(Object) === Function.prototype); // true
console.log("Object.getPrototypeOf(Function.prototype) === Object.prototype :", Object.getPrototypeOf(Function.prototype) === Object.prototype); // true
console.log("Object instanceof Object :", Object instanceof Object); // true

// Function
console.log("Function instanceof Function :", Function instanceof Function); // true
console.log("Function instanceof Object :", Function instanceof Object);   // true


/**
总结: 

     Object 函数对象的 [[Prototype]] 指向 Function.prototype.
     Function.prototype 的 [[Prototype]] 指向 Object.prototype.
     Object.prototype 的 [[Prototype]] 指向 null.
     
     所以 Object instanceof Function 为 true, Object instanceof Object 也为 true.
 */