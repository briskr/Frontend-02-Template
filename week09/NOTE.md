学习笔记

## TicTacToe 游戏的实现

- 用 DOM 元素排列棋盘单元格结构

- 利用 let 创建词法作用域的特征，把单元格所在坐标传入对应的响应函数的闭包

- 示例代码编写步骤逐次提交，要点参见提交说明和注释

- 技巧：用 Object.create(pattern) 创建一个以 pattern 为原型的副本，只有修改的下标存在于 clone 结果对象上，访问其他下标将被转回原 pattern 对象。

  ——只适用于副本对象生命期短于原对象的情况。

## 异步编程

- JavaScript 的异步任务执行机制

  - callback
  - Promise - https://promisesaplus.com/
    - 应用 Promise.all, Promise.race 实现多个任务协作
  - async/await - 建立在 Promise 基础上

- Generator 与异步
  - Generator + co 模拟 async / await 执行
  - async generator 异步迭代器

## 寻路

- 实现地图编辑器
  - localStorage 持久保存
  - mousemove 事件响应中结合鼠标键状态执行网格的 set / unset
- 广度优先搜索
  - Array 用作栈 - 配合使用 push / pop (避免组合使用 shift / unshift 用首元素作栈顶，性能不好)
  - Array 用作队列 - 配合使用 push / shift ; 或 unshift / pop
  - 用队列实现广度优先搜索
- 搜索算法总体步骤
  - 待搜索节点集合可采用不同的数据结构 - 换用栈即变成深度优先搜索
  - 提取一个待搜索节点，判断该节点是否结束，是则返回
  - 若未结束，则把当前节点的所有邻接节点也加入待搜索节点集合
  - 循环提取下一个待搜索节点
- 对已搜索到的节点加上样式标记, 引入 async / await 逐步呈现
- 启发式寻路
  - A / [A\* 搜索算法](https://en.wikipedia.org/wiki/A*_search_algorithm)
  - 从待搜索节点当中提取下一个待搜索节点时，优先选择与终点距离最近的
  - TODO 优化搜索路径
  - TODO 改用性能更优的二叉堆数据结构
