学习笔记

## Proxy 与双向绑定

- 降低代码行为的可预期性，不适合用来写业务代码，适合用于实现底层框架
- Proxy handler 可截获的行为列表见 [Proxy constructor 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#Handler_functions)
- Proxy 的 handler 可以只改变特定情形下的行为，对其余情形配合使用 [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 上的方法把操作转发回原对象

- 实现 reactive
  - 第一步 - 实现在 set 操作时通知经过 effect() 注册过的 callback
    - effect() API - 替代事件监听机制，传入回调函数。当 proxy 对象被访问时触发回调。
    - 初版实现在对象属性 set 时调用所有已注册的回调函数 - 可能调用了调用了无关的函数，存在潜在的性能问题。
  - 第二步 - 在 set 时只通知用到该属性的 callback 来获取新值
    - 改进的实现要求能够辨别哪些回调函数会受到这一次对象属性访问的影响，从而只通知这一部分回调函数。
    - 如何判断一个回调函数用到了哪些属性，从而需要在这些属性改变的时候收到通知？
    - 在 reactive 对象的 get 方法中监听回调函数访问了原 object 的哪些 prop，以 obj, prop 作为两级索引构造 Map，把 callback 记入一个数组，数组中保存历次 effect() 调用传入的、需要访问某个 obj 的 某个 prop 的 callback。
    - 根据上一步构造的 Map，在发生 set 时，只提取关心此 [obj, prop] 的 callback ，对它们进行通知。
  - 第三步 - 支持对多层嵌套的对象进行 reactive 包装
    - 在 get 处遇到 `obj[prop]` 的值是对象，则对该对象进行一次 `reactive()` 包装
    - 上一步产生的新的 proxy 包装对象需要保留在内存中，以便后续访问次级对象时，能够触发包装了次级对象的 proxy 对象，因此引入 reactivities Map。
  - [代码](reactive.html)
  - 应用以上 reactive 库 + DOM 事件监听，实现控件与数据的双向绑定
    - [代码](reactive-bind.html)
