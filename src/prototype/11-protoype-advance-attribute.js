const title = '11-prototype-advanced-attribute - 原型属性';
console.log('=== ' + title + ' ===\n');

// =============================================================================
// 1. 为什么函数会有 prototype 属性, 它与对象的 [[Prototype]] 有什么区别? ，以及 new 是如何利用它的

// =============================================================================


function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log("Hello, " + this.name);
};

const alice = new Person("Alice");
alice.sayHello(); // Hello, Alice

/**
这段代码涉及三个对象或属性：
Person：一个函数对象。(这里使用函数对象这个词,是为了表示: 函数不仅可以被调用，本身也是一个对象，可以拥有属性)
Person.prototype：Person 函数的一个普通属性，其值是一个对象。
alice：通过 new Person() 创建的实例对象。

它们的关系如下：

Person函数对象的prototype 属性  --指向--> Person.prototype

Person.prototype 包含: 
          sayHello 方法, 
          constructor 属性  --指向--> Person

alice 对象包含:
          name 属性,
          [[Prototype]]属性 --指向--> Person.prototype


函数对象的prototype属性和对象的[[Prototype]]属性是两个不同的概念。
它们是两种不同的关系，但在构造函数场景下会关联起来。 

函数对象的prototype属性是一个普通属性，它指向一个对象，这个对象包含了通过该函数创建的实例对象所共享的方法和属性。
而对象的[[Prototype]]属性（通常通过__proto__访问）是一个内部属性，它指向该对象的原型对象，用于实现原型链查找。     
    
 */



// =============================================================================
// 2. new 到底是如何使用 prototype 的

// =============================================================================

// 当你执行
const bob = new Person("Bob");
/* 
可以用下面的概念模型理解它的主要过程：
1. 创建新对象. 
     创建一个新的对象，准备作为实例。
2. 建立原型链接.
     将新对象的 [[Prototype]] 设置为 Person.prototype
3. 执行构造函数.
     以新对象作为 this，执行 Person("Alice") 的函数体，从而设置 this.name。
4. 确定返回值.
     如果构造函数显式返回对象，通常会返回那个对象；否则返回新创建的实例。原始类型返回值会被忽略。     

所以，prototype 的作用不是存储实例，也不是直接存储实例属性，而是让 new 创建的实例能够与指定的原型对象建立关联。     
*/

// =============================================================================
// 4. prototype 与 [[Prototype]] 究竟有什么区别

/**

比较项	               prototype	                               [[Prototype]]
本质	                    普通属性	                                规范定义的内部属性
属于谁	               某些函数对象，例如普通构造函数	         对象
如何访问	               Person.prototype	                      Object.getPrototypeOf(alice)
主要作用	               为构造函数创建的实例提供原型对象	          表示对象自身的原型链接
是否总是指向同一个对象	 不适用	                                  不适用


 */
// =============================================================================



// =============================================================================
// 3. 补充: 不是所有函数都有 prototype 属性

// =============================================================================

// 普通的、可以使用 new 调用的构造函数通常有这个属性；箭头函数没有，简写形式定义的方法通常也没有 (JavaScript对不同类型的函数对象赋予了不同的能力)

const arrow = () => {};  // 箭头函数没有 prototype 属性

const obj = {
  method() {}, // 简写形式定义的方法没有 prototype 属性
  hi: function() {} // 普通函数有 prototype 属性
};

console.log('Person.hasOwnProperty("prototype"): ', Person.hasOwnProperty("prototype")); // true
console.log('arrow.hasOwnProperty("prototype"):', arrow.hasOwnProperty("prototype"));  // false
console.log('obj.method.hasOwnProperty("prototype"):', obj.method.hasOwnProperty("prototype")); // false
console.log('obj.hi.hasOwnProperty("prototype"):', obj.hi.hasOwnProperty("prototype")); // true