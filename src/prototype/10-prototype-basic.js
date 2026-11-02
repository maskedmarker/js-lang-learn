const title = '10-prototype-basic - 原型基本概念';
console.log('=== ' + title + ' ===\n');


// =============================================================================
// 1. 原型基本概念


// 每个普通对象都有一个内部属性，规范中将它称为 [[Prototype]]
// __proto__是历史遗留的访问器属性，不建议在新代码中使用; Object.getPrototypeOf(obj) 是标准方法，用于获取对象的原型

// JavaScript 在对象自身找不到属性时，会继续沿着它的原型查找.
// 这种机制被称为原型链（prototype chain），它是 JavaScript 实现继承的基础。
// =============================================================================

console.log('--- 1. 原型基本概念 ---');

const person = {
    greet() {
        console.log("Hello from person");
    }
};

const alice = {
    name: "Alice"
};

// 设置原型
Object.setPrototypeOf(alice, person);
// JavaScript 在对象自身找不到属性时，会继续沿着它的原型查找
console.log("alice.name :", alice.name);
console.log("alice.greet() :", alice.greet());
console.log("alice.hasOwnProperty('name') :", alice.hasOwnProperty('name'));
console.log("alice.hasOwnProperty('greet') :", alice.hasOwnProperty('greet'));



// 原型链
console.log("Object.getPrototypeOf(alice) === person :", Object.getPrototypeOf(alice) === person);
console.log('alice.__proto__ === person:', alice.__proto__ === person);
console.log("Object.getPrototypeOf(person) === Object.prototype :", Object.getPrototypeOf(person) === Object.prototype);
console.log("Object.getPrototypeOf(Object.prototype) === null :", Object.getPrototypeOf(Object.prototype) === null);



// =============================================================================
// 2. 基于原型创建对象
// =============================================================================

console.log('--- 2. 基于原型创建对象 ---');

// 除了为存在的对象指定原型之外，还可以基于原型创建新对象
const bob = Object.create(person);
console.log("bob.name :", bob.name);
console.log("bob.greet() :", bob.greet());
console.log("Object.getPrototypeOf(bob) === person :", Object.getPrototypeOf(bob) === person);




// =============================================================================
// 3. 基础知识
// =============================================================================

console.log('--- 3. 基础知识 ---');

// 查看最顶层的原型对象Object.prototype,都有哪些属性及其类型
console.log("Object.prototype properties and types:");
Object.getOwnPropertyNames(Object.prototype).forEach(key => {
    console.log(`  ${key}: ${typeof Object.prototype[key]}`);
});

// constructor 属性来自原型链最顶端的 Object.prototype
console.log("alice.constructor === Object :", alice.constructor === Object);
console.log("alice.hasOwnProperty('constructor') :", alice.hasOwnProperty('constructor'));
console.log("Object.prototype.hasOwnProperty('constructor') :", Object.prototype.hasOwnProperty('constructor'));


// Object 是一个内置的构造函数,不是对象
console.log("typeof Object :", typeof Object); 
console.log("Object instanceof Function :", Object instanceof Function); // true
console.log("Object instanceof Object :", Object instanceof Object);  // true



// Object 比普通构造函数更特殊：它既可以作为普通函数调用，也可以作为构造函数调用
Object();          // 返回一个普通空对象
Object(null);      // 返回一个普通空对象
Object(undefined); // 返回一个普通空对象
Object("hello");   // 返回 String 对象包装值
Object(123);       // 返回 Number 对象包装值
Object(true);      // 返回 Boolean 对象包装值


// Object 自己也有原型
function Person() {}
const jane = new Person();
console.log("Object.getPrototypeOf(jane) === Person.prototype :", Object.getPrototypeOf(jane) === Person.prototype);   // true
console.log("Object.getPrototypeOf(Person) === Function.prototype :", Object.getPrototypeOf(Person) === Function.prototype); // true
console.log("Object.getPrototypeOf(Object) === Function.prototype :", Object.getPrototypeOf(Object) === Function.prototype); // true

// 查看最顶层的函数原型对象Function.prototype,都有哪些属性及其类型
console.log("Function.prototype properties and types:");
let attrNotAllowInStrictMode = ['callee', 'caller', 'arguments'];
Object.getOwnPropertyNames(Function.prototype).forEach(key => {
    if (attrNotAllowInStrictMode.includes(key)) {
        console.log(`  ${key}:  (not allowed in strict mode)`);
    } else {
        console.log(`  ${key}: ${typeof Function.prototype[key]}`);
    }
});




