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
  - 添加 effect 动作，实现 reactive 对象数据变更时通知 DOM
  - 添加 DOM 元素事件监听，实现 DOM 对象内容变更时更新 reactive 对象
  - [代码](reactive-bind.html)

## 用 Range 对 DOM 进行精确操作

- 实现基本拖拽
  - 在 mousedown 事件响应函数体当中才开始启用 mousemove 和 mouseup 监听
  - mouseup 响应函数体：负责把 move 和 自身 两个事件响应函数从 document 的事件响应函数中移除
  - mousedown 响应函数中记录事件坐标，即此次拖拽动作的起始位置坐标
  - mousemove 响应函数体：把元素 translate 到 (mousemove 事件坐标) 与 (mousedown 事件坐标) 之差
  - 多次发生拖动动作，起始时元素的 translate 值已包含上次拖动后的偏移量，造成被拖动元素脱离鼠标位置
    - 解决办法：在 mouseup 时记录本次拖拽结束的位置(放在事件响应函数作用域外，在多次拖动之间保留值)，下次拖动时 translate 参数改为 (上次结束位置 + (mousemove 事件位置 - mousedown 位置) )
  - [代码](drag-transform.html)

- 实现拖拽元素进入段落内部
  - 列举段落内可以插入元素的位置 - 在段落头尾和每个字符之间创建 Range
  - 应用 CSSOM 的 getBoundingRect() 取到各 Range **当前渲染位置** 对应的矩形 - 坐标在两个字符实际排版位置之间，宽度为0
  - move 事件响应函数中，计算与目标位置距离最近的 Range，调用 range.insertNode() 把拖动中的元素移入
  - [代码](drag-range.html)