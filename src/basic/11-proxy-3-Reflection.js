
/**
Reflect.get() 

Syntax
Reflect.get(target, propertyKey)
Reflect.get(target, propertyKey, receiver)

Parameters
target: 
        The target object on which to get the property.
propertyKey: 
        The name of the property to get.
receiver (Optional):
        The value of this provided for the call to target if a getter is encountered. Defaults to target.
Return value:
        The value of the property.
 */

// Object
const obj1 = { x: 1, y: 2 };
Reflect.get(obj1, "x"); // 1

// Array
Reflect.get(["zero", "one"], 1); // "one"

// Proxy with a get handler
const obj2 = new Proxy(
  { p: 1 },
  {
    get(t, k, r) {
      return `${k}bar`;
    },
  },
);
Reflect.get(obj2, "foo"); // "foobar"

// Proxy with get handler and receiver
const obj3 = new Proxy(
  { p: 1, foo: 2 },
  {
    get(t, prop, receiver) {
      return `${receiver[prop]}bar`;
    },
  },
);
Reflect.get(obj3, "foo", { foo: 3 }); // "3bar"

// --------------------------------------------------------------------------------------------------------------------------------------------------------

/**
Reflect.set()

Syntax
Reflect.set(target, propertyKey, value)
Reflect.set(target, propertyKey, value, receiver)      


Parameters
target:
        The target object on which to set the property.

propertyKey:
        The name of the property to set.

value:
        The value to set.

receiver (Optional):
        The value of this provided for the call to the setter for propertyKey on target. 
        If provided and target does not have a setter for propertyKey, the property will be set on receiver instead. Defaults to target.

Return value:
        A Boolean indicating whether or not setting the property was successful.
 */

(function(){
    const target = {};
    const receiver = {};
    Reflect.set(target, "a", 2, receiver); // true
    // target is {}; receiver is { a: 2 }
})();

(function(){
    const target = { a: 1 };
    const receiver = {};
    Reflect.set(target, "a", 2, receiver); // true
    // target is { a: 1 }; receiver is { a: 2 }
})();


/**
Different target and receiver
When the target and receiver are different, Reflect.set will use the property descriptor of target (to find the setter or determine if the property is writable), but set the property on receiver.
 */
(function(){
    const target = {
      set a(v) {
        this.b = v;
      },
    };
    const receiver = {};
    Reflect.set(target, "a", 2, receiver); // true
    // target is { a: [Setter] }; receiver is { b: 2 }
})();



