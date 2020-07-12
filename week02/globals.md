全局环境

- globalThis
- undefined

以下常量推荐改用 Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY

- Infinity
- NaN

全局函数

- eval()
- decodeURI()
- decodeURIComponent()
- encodeURI()
- encodeURIComponent()

以下函数推荐改用 Number 内的版本

- isFinite()
- isNaN()
- parseFloat()
- parseInt()

全局对象：内置对象

- Array
- ArrayBuffer
- BigInt
- Boolean
- DataView
- Date
- Error
- Function
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
- WeakMap
- WeakSet

全局对象：静态函数封装类的内置对象

- Atomics
- JSON
- Math
- Reflect

### Error subclasses

- EvalError
- RangeError
- ReferenceError
- SyntaxError
- TypeError
- URIError

### TypedArray subclasses

- BigInt64Array
- BigUint64Array
- Float32Array
- Float64Array
- Int8Array
- Int16Array
- Int32Array
- Uint8Array
- Uint16Array
- Uint32Array
