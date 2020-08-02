学习笔记

# 学习总结

- 在上周完成 DOM 树解析的基础上，继续编码完成 toy-browser 的 CSS 排版和 DOM 元素绘制阶段
- CSS 语法的解析和最后的图形绘制使用了外部库
- CSS 计算阶段
  - 收集 CSS 规则
  - 对逐个元素查找能够匹配的 CSS 规则
  - 一个元素上的多个规则需要依据 specificity 顺序判断优先级
- CSS 排版阶段
  - 根据元素上的 computedCSS 信息，根据 CSS 规则的语义计算能够用于绘图的具体数值
  - 只实现了 flexbox 排版，具体各项语义的实现详见代码
- 根据排版阶段计算得到的 style 信息，简单调用 2D 绘制库实现

# 随堂笔记

## 收集 CSS 规则

- 在上周代码基础上，增加遇到 `</style>` 关闭标签时的处理，提取其中的 CSS 规则内容

  - 引入 npm 模块 `css` 实现 CSS 内容解析
  - 忽略 `<link rel="stylesheet" src="">` 和 `@import` 等需要发起更多请求的方式
  - 解析结果是 rules 数组；每条 rule 主要内容是 selectors 数组和 declarations 数组

## CSS 计算

- 添加 computeCSS 调用

  - 在 startTag 完成后，当前 startTag 所属 HTML 元素的所有父元素已确定
  - 只支持 HEAD 中出现的 style 定义
  - 多数 selector 的语义在元素的 startTag 确定之后即可进行计算，课程作业中只支持这类
    - 反例: `last-child` 需要等到父元素关闭时才确定

- 获取父元素

  - 在当前 element 入栈之前，获取当前 stack 的快照(副本)
  - 反序，以便逐级向上进行匹配

- 对当前元素查找能够匹配的 CSS 规则 - (`match()` 函数)

  - 对每一条规则，把其中(空格分隔)的复杂选择器项反序排列，与当前元素的父元素队列逐一 match，全部 match 成功才算这条规则与当前元素 match
  - 简单选择器与元素进行匹配
    - 区分 selector 属于 `#id`, `.class`, tag 当中的哪一类
    - 按照该 selector 的语义判断 element 是否具有匹配的 attribute 值

- 将选择器应用到元素 - (`computeCSS()` 函数中 `if(matched)` 分支)
  - 把已判定为匹配的 rule 内的 declarations 逐条应用到 `element.computedStyle` 上
  - specificity - selector 的"专指"程度高低
    - 四元组 [ inline, `#id` `.class` tag ]
    - 多个 rule 均能匹配某 element 时，按各自的 selector 计算 specificity 值，最高者胜出
    - 比较大小的规则是从高到底逐级比较，有结果后忽略更低级别的数值
    - 参考资料 [specifishity.com](https://specifishity.com/)

## CSS 排版

根据 DOM with CSS 计算各元素的位置

- CSS 中三代排版模式

  1. Normal Flow - 正常流，来自印刷页面排版的隐喻，含 `position`, `display`, `float` 等 CSS 属性定义
  2. Flexbox - 引入主轴/交叉轴概念，适合于窗口界面元素的布局，具有按比例分配空间、填充剩余空间、子元素折行等概念
  3. Grid - 网格形式分配二维版面内的空间
  4. CSS Houdini - 开放 API 给开发者直接控制 CSSOM

- css layout 函数

  - 课程中仅实现 flexbox 排版
  - 对从 computedStyle 对象中拿到的样式信息进行预处理
    - 数值字符串转成 number
    - ? flex-flow 属性名改为 flexFlow
  - 抽象出 main 轴和 cross 轴，把 width, height 等字段名对应到抽象的 `main...` `cross...` 属性上
  - 把 元素 收集进 row (以 `flex-direction: row;` 模式为例表述)
    - 循环处理带有 `display: flex` 属性的父元素之下的所有子元素
    - `nowrap` 或未限定父元素宽度的情况下，所有元素加入同一行
    - 支持缩放的子元素(带 `flex: 1 1 auto;` 属性)一定可以加入行
    - 普通子元素加入后扣除父元素剩余宽度空间，并更新实际行高(一行内子元素的最大高度)
    - 若剩余宽度空间不足以容纳当前子元素，则新开一行，加入当前子元素
    - 每完成一行，在行信息对象上记录该行的剩余未分配宽度，和实际行高
  - 计算主轴(所有子元素的宽度、起止位置)
    - 确定宽度的子元素分配完成后，剩余的宽度按照子元素的 `flex` 属性按比例分配
    - 若剩余空间为负(父元素带`flex: nowrap;`，且填充的子元素总宽度已超出父元素宽度)，则带 `flex` 元素压缩为 0，再按比例压缩不带 `flex` 元素
  - 计算交叉轴(各元素在纵向的起止位置)
    - 依据：(老师幻灯里写成 flex-align 和 item-align)
      - 父元素的 align-content 决定多条主轴在交叉方向的分布模式
      - 父元素的 align-items 决定子元素在行内的默认对齐方式
      - 子元素的 align-self 决定单个子元素在行内的对齐方式

## DOM 渲染绘制

- 单个元素的绘制

  - 引入 2D 绘图环境(images 包)，根据元素的 style 内容进行绘制
  - 忽略不带 style 属性的元素

- DOM 树的绘制

  - 对元素的 children 递归调用 render
  - 未实现 border，文字绘制等
