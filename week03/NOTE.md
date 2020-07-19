学习笔记

# 学习总结

1. 运算符和表达式

   澄清表达式各级元素的优先顺序
   member 和 call 是基本运算

2. 类型转换

   条件判断表达式， + 表达式 等处要注意类型转换规则
   类型转换的规则和 == 判定相等的规则是两回事
   对字面量或基础类型值，后面调用 prototype 上的方法会发生装箱
   拆箱操作调用对象上的方法实现，可覆盖

3. 语句

   - 相关的运行时概念
     - Completion Record
     - Lexical Environment

4. 简单语句、复合语句

   - 语法分类
   - 各类型语句在运行时通过 Completion Record 内容影响程序流程
   - `for` 语句 `()` 内和 `{}` 内作用域的区别; `try {}` 后面的花括号属于 try 语句的成分，非创建块级作用域

5. 声明

   - var / function 和 let / const / class 属于两代不同的作用域规则
   - var 包含预处理的执行规则
   - 人为添加额外的花括号对代码进行分块

6. 执行

   - 宏任务和微任务概念
   - 事件循环的概念

7. 函数调用

   - 函数调用时发生上下文切换，外层 Execution Context 被压栈
   - EC 的分类辨析
   - EC -> { LexEnv, [async, Generator 状态信息], Function 拥有的信息, Module 拥有的信息, Realm } -> LexEnv.EnvRec
   - (静态信息) EnvRec 类家族
   - EnvRecord 运行时链接结构
   - 函数闭包 Env + Code

# 随堂笔记

## 运算符和表达式

按表达式优先级递减顺序

- 1 级 Member

  - `a.b`, `a[b]`
  - `` foo`string` ``
  - `super.b` `super['b']`
  - `new.target`
  - `new Foo()` `new Foo`
  - `new Foo()` 高于 `new Foo`, e.g. `new new a()` 解析为 `new ( new a() )`

- (补充) Reference ECMA-262 标准中的类型

  - Object.key 得到的是一个 reference
  - 解引用后以值参与运算 e.g. `a.b + c.d`
  - 以(对象+属性/identity/指针)信息参与运算
    - `delete a.b`
    - `a.b = c`

- 2 级 Call

  - `foo()` `super()`
  - `foo().b` `foo()['b']` `foo()` `` 会让右半部分的 Member 运算降级为 call

- 补充

  - `a.b` 可以放在 赋值操作符 左边，属于 Left-hand expression
  - `a + b` 不可以放在赋值操作符左边，不属于 Left-hand expression
  - 以下所讲各级属于非 left-hand expression

- 3 级 Update

  - `a ++` `a --`
  - `++ a` `-- a`

- 4 级 Unary 单目运算

  - `delete a.b` 右侧必须是 Reference
  - `void f()`
  - `typeof a`
  - `+ a` `- a` `~ a` `! a`
  - `await a`

- Exponential

  - 右结合 `2 ** 3 ** 2` 等价于 `2 ** ( 3 ** 2)`

- 四则运算

  - Multiplicative `*` `/` `%`
  - Additive `+` `-`
  - Shift `<<` `>>` `>>>`
  - Relationship `<` `>` `>=` `<=` `instanceof` `in`

- Equality

  - `==` `!=` `===` `!==`

- Bitwise

  - `&` `^` `|`

- Logical

  - `&&` `||`
  - 短路

- Conditional
  - `? :`
  - 短路

## 类型转换

- 发生自动转换的场合

  - `a + b` `'false' == false // false` `' ' == 0 // true`
  - `a[o] = 1` 若 `o` 非字符串，会被转换为字符串
  - 位运算的操作数会被转换成整数

- 强制类型转换表

  - `(Boolean)(0) === false` `(Boolean)('') === false`
  - `(Number)(true) ===`
  - `(Number)(undefined) === NaN` `(Number)(null) === 0`
  - `(Number))(o) === o.valueOf()` `(String)(o)` `o.valueOf()` / `o.toString()`
  - `(Object)(n)` Number, String, Boolean, Symbol - Boxing

- Unboxing 规则

  - 定义了 `[Symbol.toPrimitive]` 属性时跳过 valueOf 或 toString
    ```javascript
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return 42;
      }
      return null;
    }
    ```
  - 否则调用 `valueOf` 或 `toString` (视所在位置语义决定的 hint 而定)
  - 默认行为： 根据 hint 决定优先调用 `valueOf` 还是 `toString`
    - 参与加法表达式优先调用 `valueOf` (如果是字符串加法, 把 `valueOf` 的结果再转成字符串)，无定义时才用 `toString`
    - 作为属性名优先调用 `toString`

- Boxing 规则
  - `new Number(n)` `new Object(Symbol('s'))`
  - 值类型表达式加上.member() 会被自动装箱，调用对应的类上定义的方法

## 语句

- 语法层面
  - 简单语句
  - 组合语句
  - 声明
- 运行时层面
  - Completion Record
  - Lexical Environment

### Completion Record

描述语句执行后得到的结果

- 结构
  - `[[type]]` normal, break, continue, return, throw
  - `[[value]]`
  - `[[target]]` label (用于 break, continue 定向)

### 简单语句

- 包含以下类型

  - 表达式语句 (其中赋值语句有副作用)
  - 空语句
  - debugger
  - throw
  - continue
  - break
  - return (yield)

- 各类语句产生什么样的 Completion Record

### 组合语句

- 包含以下类型
  - Block~
  - If~
  - Switch~ - JS 中性能比 if 无优势
  - Iteration~ (`for (;;)` `for ( in )` `for ( of)` `while(){}` `do {} while` `for await( of )` )
    - for 语句开启作用域： `()` `{}` 作用域有区别
    - in 操作符？
  - With~
  - Labelled~
    - `CR.[[target]]`: label 指定跳出的目的行
  - Try~
    - try 后面的 `{}` 不能省略，属于 TryStatement，而非 BlockStatement
    - catch 开启作用域

### 声明语句

此分类非 ECMA 标准中所定义的概念

- 包含以下类型

  - FunctionDeclaration
  - GeneratorDeclaration
  - AsyncFunctionDeclaration
  - AsyncGeneratorDeclaration
  - Variable**Statement**
  - ClassDeclaration
  - LexicalDeclaration `const` `let`

- 区分 var / function 和 const / let
  - function 允许在被调用的代码位置之后声明
  - 若 var a = 1 在函数内其他语句之后，变量声明作用被 hoist，但是赋值操作在后面执行
- class / const / let 要求先声明后使用，否则抛出 ReferenceError
- 但若当前作用域外存在同名项，作用域存在内同名声明，内层声明之前的使用不会使用外部声明的项，而是报错
- var 的 hoist 在预处理阶段发生，即使 return 之后有 var 声明也会有效果

```javascript
try {
  var a = 2;
  void (function () {
    a = 1;
    console.log('inner a', a);
    return;
    const a = 1;
  })();
  console.log(a);
} catch {}
```

### 作用域

- 循环语句，控制表达式 `for (const item in list) {}` 内的 item 变量，作用域在 if 后的整个表达式，比花括号要高一层(花括号内若声明同名变量，外面的 item 不会被覆盖)

## 结构化

- 执行粒度(运行时)

  层级从高到低

  - 宏任务
  - 微任务 (Promise)
  - 函数调用 ( Execution Context )
  - 语句/声明 ( CompRec, LexEnv )
  - 表达式 ( Reference )
  - 直接量 / 变量 / this

### 宏任务和微任务

(JavaScriptCore 中的命名)
JS 宿主 解析执行代码产生的是宏任务，Promise 提交的任务是微任务

```javascript
new Promise((resolve, reject) => {
  body;
});
```

执行机制补充阅读
https://juejin.im/post/59e85eebf265da430d571f89

### 事件循环

由宿主把事件信息传递给 JS 引擎
o 获取代码 -> 执行代码 -> 等待(线程挂起) -->o

### 函数调用

运行时数据结构 Execution Context

- 运行时随着函数调用形成 栈 结构
- 栈顶称为 Running Execution Context 是当前执行代码的环境

- EC 的内容

  - code evaluation state - 用于 async 和 generator 函数，表示代码执行位置
  - Function - 用于函数
  - ScriptOrModule - 用于 script 或 module
  - Generator - 只适用于 Generator 创建的 EC
  - Realm - 保存所有可用的内置对象等
  - LexicalEnvironment - 代码(块)可访问到的变量 - 内容为 Env Records (见下文) 和 outer LexicalEnv 指针
  - VariableEnvironment - 同上，适用于 var 声明的变量

- 两类 EC

  - ECMAScript Code Execution Context (不包含 Generator)
  - Generator Execution Context (包含 Generator)

- LexicalEnvironment

  - 广泛使用
  - 旧标准只保存变量，新标准还包含 this, super, new.target 等

- VariableEnvironment

  - 仅用于 var 声明(历史包袱)
  - `{ let y=2; eval('var x = 1'); }` eval 产生的 x 会向上穿透，进入外层 module 或 function 的上下文

- Environment Record 类体系

  - Declarative ~ - 对应 `{}` 代码块
    - Function ~ - 用于函数体
    - Module ~ - 用于模块 exports
  - Global ~ - 用于 global 单例
  - Object ~ - 用于 with 语句

- Function 的闭包结构

  - Env Record + Code
  - Env Record 保存了函数定义时所在的环境的所有变量，且保存到函数对象身上，从而实现闭包
  - Env Record 指向外一层 Env Record 形成链
  - 早期术语叫 Scope Chain
  - 据 2020 版规范，由 LexicalEnvironment.outer 构成链
  - 箭头函数中，除环境中的各变量外，Env Record 中还保存了 this

### Realm

- 代码中创建对象，或隐式装箱转换等，用到的内置原型，记录在 Realm 中
- 每个 JS 引擎实例中有一个 Realm 实例
- 不同的窗口内 Realm 实例相互独立

### 补充 Realm 相关知识

- Realm Record 数据结构

  - [[Intrinsics]]
  - [[GlobalObject]]
  - [[GlobalEnv]] (type: LexicalEnvironment)
  - [[TemplateMap]] (List of { [[Site]]: Parse Node, [[Array]]: Object })
  - [[HostDefined]] 保留给宿主环境添加附加信息

- 参考资料
  - https://www.ecma-international.org/ecma-262/#sec-code-realms
  - https://brionv.com/log/2019/01/17/defender-of-the-realm/
  - https://github.com/tc39/proposal-realms#readme
  - https://github.com/Agoric/proposal-realms
