# 练习

找出 JavaScript 标准里面所有具有特殊行为的对象
特殊行为：不能用普通 JavaScript 对象(属性+原型)来描述的行为

## 答：

- Array

  - 相关特性：下标形式的元素访问; 随内容元素数量变化的 length 属性; 指定长度和/或元素集合构造数组(new Array(), Array.from(), Array.of())
  - [Array Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-array-exotic-objects)

- String

  - 相关特性：[[StringData]]; 下标取单个元素 s[0]; 字符元素数量 length
  - [String Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-string-exotic-objects)

- Integer-Indexed, 包括各种 TypedArray

  - 相关特性：[[ViewedArrayBuffer]], [[ByteOffset]]; 下标形式的元素读、写转化为对数据区地址的操作
  - [Integer-Indexed Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-integer-indexed-exotic-objects)

- Bound Function

  - 相关特性：改用已绑定的对象作为 this
  - [Bound Function Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-bound-function-exotic-objects)

- Arguments (函数实参)

  - 相关特性：可用整数下标形式访问某个实参; [[ParameterMap]]
  - [Arguments Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-arguments-exotic-objects)

- Module namespace

  - 代码模块 export 产生一个 module 对象，包含 [[Module]], [[Exports]], [[Namespace]]
  - [Module Namespace Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-modulenamespacecreate)

- Immutable Prototype
  - Object.prototype 自身不再有 prototype
  - [Immutable Prototype Exotic Objects](https://www.ecma-international.org/ecma-262/#sec-immutable-prototype-exotic-objects)

## 参考资料

[ECMA-262](https://www.ecma-international.org/ecma-262/)

## 相关知识

- [6.1.7.2 Object Internal Methods and Internal Slots]

  - [ordinary object 定义](https://www.ecma-international.org/ecma-262/#ordinary-object) - 同时满足以下 3 条：

    - For the internal methods listed in Table 6, the object use those defined in 9.1.
    - If the object has a [[Call]] internal method, it uses the one defined in 9.2.1.
    - If the object has a [[Construct]] internal method, it uses the one defined in 9.2.2.

  - [exotic object 定义](https://www.ecma-international.org/ecma-262/#exotic-object)

    - 不满足以上条件
    - 解读：具有 Table 6 所列以外的内部行为，或与表内同名行为指向非默认的函数？

  - Table 6 定义的内部行为
    - [[GetPrototypeOf]]
    - [[SetPrototypeOf]]
    - [[IsExtensible]]
    - [[PreventExtensions]]
    - [[GetOwnProperty]]
    - [[DefineOwnProperty]]
    - [[HasProperty]]
    - [[Get]]
    - [[Set]]
    - [[Delete]]
    - [[OwnPropertyKeys]]

- 固有对象

  [6.1.7.4 Well-Known Intrinsic Objects](https://www.ecma-international.org/ecma-262/#sec-well-known-intrinsic-objects)

  - Array
  - ArrayBuffer
  - BigInt
  - Boolean
  - DataView
  - Date
  - Error
    - EvalError
    - RangeError
    - ReferenceError
    - SyntaxError
    - TypeError
    - URIError
    - NativeError
  - Function
    - GeneratorFunction ?
  - Map
  - Number
  - Object
  - Promise
  - Proxy
  - RegExp
  - Set
  - SharedArrayBuffer
  - String
  - Symbol
  - TypedArray
    - Float32Array
    - Float64Array
    - Int8(16, 32)Array
    - Uint8(16, 32)Array...
    - Uint8ClampedArray
  - WeakMap
  - WeakSet

  - 以下对象属于 ordinary object

    - Atomics
    - Math
    - JSON
    - Reflect

* [19 Fundamental Objects](https://www.ecma-international.org/ecma-262/#sec-fundamental-objects)

  - Object
  - Function
  - Boolean
  - Symbol
  - Error
