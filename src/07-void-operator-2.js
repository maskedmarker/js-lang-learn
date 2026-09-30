// 07 - void 运算符
// void 始终返回 undefined,无论后面的表达式是什么、是否有副作用

const title = '07 - void 运算符';
console.log('=== ' + title + ' ===');
console.log('');



// ========== 10. 扩展 ==========
console.log('--- 10. 扩展 ---');
console.log('void运算符支持有名函数(且支持入参),这样就可以引用自己: void function funcationName(args) { ... }');
let finalResult = -1;
let rootFlag = true;
const voidOperatorResult = void function factorial (i) {
  let root = false;
  if (rootFlag) {
     root = true;
	   rootFlag = false;
  }
  
  if (i <= 1) {
    return i;
  }
  
  let result =  i * factorial(i-1);  // 递归调用自己
  if (root) {
	  finalResult = result;
  }
  return result;
}(3);
console.log('factorial(3) = ', finalResult);
console.log('voidOperatorResult = ', voidOperatorResult);
console.log('typeof factorial === undefined:', typeof factorial === 'undefined');
try {
  factorial(3);
} catch (error) {
  console.log('void function funcationName中的函数名factorial无法被外部访问. ', error.name, error.message);
}
