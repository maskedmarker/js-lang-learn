// 09 - class
// class 声明、构造函数、实例方法、静态成员、继承、super、私有字段

const title = '09 - class';
console.log('=== ' + title + ' ===');
console.log('');


// ========== 1. 基本声明与实例化 ==========
console.log('--- 1. 基本声明与实例化 ---');

class Animal {
    // 构造函数:创建实例时调用
    constructor(name) {
        this.name = name;
    }

    // 实例方法:定义在原型上
    speak() {
        return `${this.name} makes a sound.`;
    }
}

const dog = new Animal('Dog');
console.log(dog.name);        // Dog
console.log(dog.speak());     // Dog makes a sound.
console.log(typeof Animal);   // function  (class 本质是函数)


// ========== 2. 静态成员 (static) ==========
console.log('--- 2. 静态成员 ---');

class MathUtil {
    static PI = 3.14159;

    static add(a, b) {
        return a + b;
    }
}

// 静态成员属于类本身,不属于实例
console.log(MathUtil.PI);          // 3.14159
console.log(MathUtil.add(2, 3));   // 5
// console.log(new MathUtil().PI); // undefined

// 静态方法中 this 指向类本身
class Person {
    static count = 0;

    constructor(name) {
        this.name = name;
        Person.count++;  // 通过类名访问静态属性
    }
}

new Person('A');
new Person('B');
new Person('C');
console.log(Person.count);  // 3


// ========== 3. 继承 (extends) ==========
console.log('--- 3. 继承 ---');

class Dog extends Animal {
    constructor(name, breed) {
        super(name);          // 必须先调用 super(),才能用 this
        this.breed = breed;
    }

    // 重写父类方法
    speak() {
        return `${this.name} barks.`;
    }

    // 子类自己的方法
    fetch() {
        return `${this.name} fetches the ball.`;
    }
}

const rex = new Dog('Rex', 'Labrador');
console.log(rex.speak());   // Rex barks.
console.log(rex.fetch());   // Rex fetches the ball.
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true


// ========== 4. super 关键字 ==========
console.log('--- 4. super 关键字 ---');

class Cat extends Animal {
    speak() {
        // super.speak() 调用父类的方法
        return super.speak() + ' Specifically, meows.';
    }
}

const kitty = new Cat('Kitty');
console.log(kitty.speak());  // Kitty makes a sound. Specifically, meows.


// ========== 5. 私有字段 (#) ==========
console.log('--- 5. 私有字段 ---');

class BankAccount {
    // # 开头的字段是真正的私有,外部无法访问
    #balance = 0;

    constructor(owner) {
        this.owner = owner;
    }

    deposit(amount) {
        if (amount > 0) this.#balance += amount;
        return this.#balance;
    }

    get balance() {
        return this.#balance;
    }
}

const account = new BankAccount('Alice');
account.deposit(100);
console.log(account.balance);   // 100  (通过 getter 访问)
// console.log(account.#balance); // SyntaxError: 外部不能访问


// ========== 6. getter / setter ==========
console.log('--- 6. getter / setter ---');

class Temperature {
    constructor(celsius) {
        this._celsius = celsius;
    }

    get fahrenheit() {
        return this._celsius * 9 / 5 + 32;
    }

    set celsius(value) {
        if (value < -273.15) {
            throw new Error('Below absolute zero!');
        }
        this._celsius = value;
    }
}

const t = new Temperature(100);
console.log(t.fahrenheit);   // 212
t.celsius = 25;
console.log(t.fahrenheit);   // 77


// ========== 7. 方法绑定 (this) ==========
console.log('--- 7. 方法绑定 ---');

class Button {
    constructor(label) {
        this.label = label;
        // 在构造函数中绑定,避免作为回调时 this 丢失
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        return `Clicked: ${this.label}`;
    }
}

const btn = new Button('Submit');
const handler = btn.handleClick;
console.log(handler());   // Clicked: Submit
