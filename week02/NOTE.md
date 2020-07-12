学习笔记

# 学习总结

# 随堂笔记

## 语言分类方式

- 按语法分类

  - 非形式语言 例如自然语言
  - 形式语言 有严格定义

- 形式语言的分类 - 乔姆斯基文法谱系

  - 0 无限制文法
  - 1 上下文相关
  - 2 上下文无关
  - 3 正则文法
  - 类型定义递次加强，外延递减，符合后面类型定义，一定符合之前类型的定义

## BNF 产生式

- 语法：由 复合结构 和 终结符 组成

## 借助产生式理解乔姆斯基文法谱系

- 0 型 无限制 `? ::= ?`
- 1 型 上下文相关 `? <A> ? ::= ? <B> ?`
- 2 型 上下文无关 `<A> ::= ?`
- 3 型 正则 `<A> ::= <A> ?` (被定义的左侧元素只能出现在右侧序列的开头(递归))

- 编程语言通常主体是上下文无关文法，加上少量上下文相关的特例

  `{ get: 1 }` vs `{ get value() { return 1 }}` 上下文相关
  `2 ** 1 ** 3` 右侧结合性

- 词法元素通常可由正则文法表达

- 除 BNF 之外还有其他产生式语法

## 计算机语言的分类

- 现代计算机语言中的特例

  - 上下文相关的特例，甚至与上下文语义相关

- 按文法类型分
- 按用途分

  - 数据描述语言
  - 编程语言

- 按表达方式分

  - 声明式
  - 命令式

## 编程语言性质

- 图灵完备性 - 可计算性

  - 命令式-图灵机

    - goto
    - if, while

  - Lambda 演算
    λ-calculus is a formal system in mathematical logic for expressing computation based on function abstraction and application using variable binding and substitution.
    -- Alonzo Church

    通过递归实现图灵完备

- 动态与静态

  - 动态 在最终用户环境中运行, runtime
  - 静态 开发阶段, compile-time (解释型语言也沿用此概念) 应用例如：代码的静态分析等

- 类型系统
  - 动态类型系统 vs 静态类型系统
    - 动态 (例如 JS, Ruby)
    - 静态 (例如 C 系, TS)
    - 半静态半动态 提供反射能力 (例如 C# Java)
  - 强类型 vs 弱类型
    - 强调类型转换是否自动发生
  - 复合类型
    - 结构体
    - 函数签名
  - 子类型
    - 能用父类型的地方，可以用子类型替换
  - 泛型
    - 泛型类，泛型函数
    - 协变 例：数组定义为包含父类型元素，实际可包含子类型元素
    - 逆变 例：函数定义为接受子类型参数，实际可接受父类型对象

## 命令式语言的设计方式

- 5 个层级

  - Atom (词法元素，正则文法)
  - Expression (级联定义)
  - Statement
    - 表达式, 赋值, 条件, 循环
  - Structure
    - function/procedure, class, namespace
  - Program
    - program, module, package, library

- 教学方法
  - 语法 语义 运行时 的关系
  - 借助语法表达语义，在运行时(按照设计)改变程序的状态

## JS 类型概述

- 底层语法元素 (Atom 层级)

  - Literal
  - Variable
  - Keywords
  - Whitespace
  - Line Terminator

- 运行时

  - 各 type 对应的内部数据编码
  - 执行环境 Execution Context 包含 variable 的值

- 基本类型
  - Number
  - String
  - Boolean
  - Object
  - Null - 表示有值但值为空
  - Undefined - 表示没有定义，不要用来赋值
  - Symbol
  - BigInt

## Number

- IEEE 754 双精度(64 位) 浮点数

  - 符号位 1
  - 指数 11 (-1022 ~ +1023)
  - 有效数字 52(省略打头的 1, 实际值可包含 53 bit)

- Number 字面量语法
  - `0.` | `.1`
  - `0b1011` | `0o10` | `0xfe`

## String

- String 是字符序列

- 字符集

  - ASCII
  - code-page
    - ISO 8859-\*
    - GB2312, GBK(GB13000), GB18030
  - UCS(ISO 10646)
  - Unicode

- 字符编码

  - UTF8
    - 首字节 前缀`11110` 表示 4 字节, `1110` 表示 3 字节, `110`表示 2 字节, 其余是有效位
    - 后续字节 `10`+ 6 bit 有效位

- 字面量语法
  - 单双引号
  - 转义符 \u1fff
  - 反引号，字符串模板 语法结构，相当于字面量和变量值拼接的表达式

## 其他类型

- Boolean
- 区别 null 与 undefined
  undefine 并非关键字，在非全局作用域内可以赋值
- Symbol 用途是 Object 内的属性名

## Object 基础

- 对象的三要素

  - identity(标识)
  - state(状态)
  - behavior(行为)

- 对 对象 的共性 做 抽象

  - 分类(单继承)和归类(多继承)
  - prototype (基于相似性, duck typing)
  - nihilo

- 设计原则
  - 对象的**行为**改变对象的**状态**
  - 保持内聚性

## JS 中的对象

- Object in JavaScript

  - address -- identity
  - property -- state (属性值) & behavior (属性指向函数，且访问 this 下的其他属性)
  - `[[prototype]]` -- 继承行为

- Property

  - key 类型可能为 string 或 Symbol
  - Data property
    - `[[Value]]`
    - `[[Writable]]` -- 是否允许写入 `[[value]]`
    - `[[Enumerable]]` -- 是否在 keys 中出现
    - `[[Configurable]]` -- 锁定其他特性
  - Accessor Property
    - get
    - set
    - enumerable
    - configurable

- Prototype chain

- Object 语法和 API

  - `{}` / `.` / `[]` / `Object.defineProperty` - 属性的定义，访问属性的值，访问属性的特性
  - `Object.create(proto)` / `Object.setPropertyOf()` / `Object.getPrototypeOf()` - 原型的定义和访问
  - `new` / `class` / `extends` - 基于分类的 API，运行时仍然基于原型实现
  - `new function()` / `function.prototype` - 历史包袱，不推荐

- Function 类型

  - 含 `[[call]]` 行为的对象
  - 可以含 `[[construct]]` 行为
  - 创建方式:
    - `function` 关键字
    - `=>`
    - `new Function()`
  - f() 语法，要求 f 具有 `[[call]]` 行为

- 其他特殊对象

  - `Array.length` 自动随内容数量变化
  - `Object.prototype` 指向的对象本身不能被 `setPrototypeOf()`

- Host Object
  - 由宿主环境提供 如 `window`, `setTimeout`
  - 可访问/实现 `[[call]]`, `[[construct]]` 等私有方法
