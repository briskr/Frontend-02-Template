学习笔记

# 学习总结

- 浏览器从输入 URL 到展示页面过程中的各主要阶段

- 引入有限状态机的概念 - Moore, Mealy

- 不使用 FSM 的情况下，实现子串查找

  - 多字符的查找内容，需要记录连续匹配状态，匹配序列中断后需要重置匹配状态
  - 简单查找算法时间复杂度 O(m(n-m+1))
  - KMP 算法时间复杂度 O(n) - **TODO 这个选作作业没做**

- FSM 可采用一组 JS 函数表示一组状态，函数内可以根据输入进行分支，选择下一步进入哪个状态，（并可以通过副作用记录更多信息）

- TCP / IP 协议基础知识，及 HTTP 协议的 请求 / 响应 交互流程

- 在 NodeJs 的 http 包之上实现一个简单的 HTTP Server

- 在 NodeJs 的 tcp 包之上实现 HTTP 请求发送和响应接收

  - HTTP 请求的格式 - 文本型 - request line, headers, body
  - 发送请求内容，随后接收响应内容 - 响应的格式 - status line, headers, body
  - 采用状态枚举实现 FSM，实现对请求体头部信息的解析
  - Transfer-Encoding: chunked 的编码结构
  - 采用另一个 FSM 用于解析 chunked 格式的 body 内容

- 解析从响应中获得的 HTML 内容，转化成 DOM 树结构

  - 实现 HTML 标准中定义的状态机，完成词法分析，形成 token 序列
  - 用栈记录尚未收到 end tag 的 element，加入 child element 和 text node

- 参考资料
  - [KMP 算法](https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/)
  - [HTML 语法](https://html.spec.whatwg.org/multipage/syntax.html)

# 随堂笔记

## 浏览器工作原理

- 打开页面完成渲染的 5 个主要步骤：
  - HTTP 请求/应答 - 主要得到 HTML
  - HTML 解析 - 主要得到 DOM 数据结构
  - CSS 计算 - 得到 DOM with CSS
  - layout 计算 - 得到 DOM with position
  - render - Bitmap

## 有限状态机

- 概念

  - 每个状态是一个机器，可以进行计算、存储、输出等
  - 每个状态是独立的、解耦的，忽略其他状态的逻辑，只关心本状态要处理的逻辑
  - 所有机器接受相同的输入
  - 每个状态机内部没有状态信息(规则固定)，可以输出信息，但是构建完成后，(除接口规定的输入外)不能再读入其他状态信息

- 根据下一状态的决定方式分类

  - Moore 型：静态确定的下一状态
  - Mealy 型：根据输入选择分支，决定下一状态

- JS 中实现 Mealy 型状态机
  - 一个状态：函数参数：输入；返回值：输出
  - 有限状态机由一组这样的函数组成

### 不使用状态机处理字符串

- 实现连续多字符的匹配，逐个读取字符，需要记录前缀判别状态

### 使用状态机处理字符串

- 逐个字符输入驱动状态转换

- re-consume
  - 判别失败的字符，交还给 start(c)

## HTTP 协议解析

- 网络分层模型，HTTP 协议的位置

- TCP 提供流通讯服务，IP 提供数据包传递服务

- Node.js 中 IP 协议依赖 libnet (构造 IP 包), libpcap(网卡数据抓取) 实现

- HTTP 请求 / 响应 过程模型 - 客户端 / 服务端 角色 - (不同于 TCP 全双工通信)

- 基于 Node.js http 包构造调试用的 HTTP Server

- HTTP 协议的文本格式

  - Method path HTTP 协议版本
  - Headers - 键值对，多行，空行结束
  - Body - 正文内容
  - 换行符规定为 \r\n
  - Content-Type 是必要字段，告知对方应当如何解析 body

- 编写代码实现 HTTP 的文本协议解析

### 编写演示用的 server

- 用 Node.js 内置 http 库实现 server.js，负责接收请求，和发回响应

### send 函数

- 客户端 send 函数负责发出请求并等待响应接收完成，解析成字符串后返回

### HTTP 发送请求

- 支持已有的 connection 或新建 connection

- 发送请求后，接收服务端发回的响应内容，传递给 parser 处理

- 根据 parser 是否完成的状态，resolve Promise

### HTTP response 接收和解析

- Header 解析

  - 用状态机实现
  - 分割 key value - `:`
  - 分割多个 header 行 - `\r\n`
  - 分割 header 块与 body 块 - `\r\n\r\n`

- Body 解析

  - 根据 header 中 Content-Type 和 Transfer-Encoding 信息确定 body 如何解析
  - chunked 格式
    - 16 进制数表示的 chunk 长度 + '\r\n' + chunk 内容 + '\r\n' + '\r\n'

## HTML 内容解析

- parseHTML 函数负责把 HTML 内容解析成 DOM 树
- HTML spec (WHATWG) 定义了状态机
  - 课程中的实现有所简化
- 解析 标签 Tag
  - 类型分为 startTag `<html>` (含 self-closing `<br/>` ), endTag `</div>`
- 在状态机中加入 emit 动作，输出 token 内容
  - 标签语法处理结束前暂存，完成后 emit
- 处理属性
  - 单、双引号和无引号三种格式，状态转换路径不同
  - 属性声明语法结束前暂存，完成后把信息保存到上一步暂存的 token 上
- 利用 栈 数据结构，根据 token 构建 DOM 树
  - 遇到 startTag (非自封闭) token 时创建元素，加入栈顶元素的 children ，将新元素入栈；遇到 endTag token 时出栈
  - 自封闭 tag token 视为入栈后立即出栈；有效动作只是将自己加入栈顶元素的 children
  - 当前栈顶元素是新建元素的父元素
- 提取元素内的文本节点
  - 文本节点为空的情况下，收到新的文本 token，则新建暂存文本节点，加入到当前栈顶元素的 children
  - 每次 startTag, endTag 处理完之后清空暂存的文本节点 (后续的文本 token 将被加入后续新建的元素，或本次完成元素的父元素)
