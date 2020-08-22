学习笔记

# 学习总结

- HTML 语言部分
  - 语法发展历史及要点
    - DTD 概念
    - 实体概念
    - XML namespace 概念
  - 应用语义化标签编写页面
  - 语法规范中的要素总结

- DOM API 部分
  - Node 体系
    - 各节点类型的继承关系
    - DOM 树上的节点访问导航
    - 树上节点修改
    - 高级操作：节点比较及复制等
  - Event 机制
    - capture 阶段和 bubble 阶段
    - 若末端节点上同时添加两个阶段的事件响应函数，不是先激活 capture 阶段响应函数，而是依照添加顺序激活
  - Range API
    - 可以跨元素选定内容
    - 从 DOM 树摘除 fragment，再进行操作，减少无必要的重排

- CSSOM 部分
  - 页面内所有 CSS 定义信息的对象模型，了解层级结构
  - `window.getComputedStyle()` 可获取/设置元素(含伪元素) 的当前样式
  - CSSOM View - 获取/设置窗口、视口当前尺寸信息, 滚动位置, 获取实际产生的 layout 矩形集合

- 其他 API
  - 介绍浏览器各类 API 规范的主要来源
  - 从浏览器内全局类型出发，查找所有相关规范

# 随堂笔记

## HTML 定义

- HTML 语言源流

  - 最初作为 SGML 子集定义 (具有 DTD 概念)
  - XML 化，引入 XHTML 规范，v2 未被社区接受
  - HTML5 与两者关系有一定继承关系

- 从 XHTML1 规范了解的知识点

  - DTD 语法定义 - https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
    - 定义元素允许的内容、允许的嵌套关系等
  - Entities
    - xhtml-lat1.ent - `&nbsp;` 造成前后单词连接，避免滥用 - 应用 CSS 属性 whitespace 替代
    - xhtml-symbol.ent - 符号,
    - xhtml-special.ent - 注意应用 `&amp;` `&lt;` 等转义表示 HTML 语法中有含义的符号

- XML namespace
  - 标识 https://www.w3.org/1999/xhtml
  - 在 HTML5 中可原则 XHTML 语法(要求严格闭合)，或松散语法

## HTML 语义化标签

- 实例演示语义化标签的应用
  - aside, main, header, footer, nav
  - article
  - hgroup
  - abbr - 缩略语
  - strong (strong importance, 表示重要性) / em (stress emphasis, 重音, 语气强调)
  - figure > figurecaption
  - dfn, samp, code

## HTML 语法总结

- HTML 节点类型

  - Element
  - Text
  - Comment `<!-- -->`
  - DocumentType `<!doctype html>`
  - ProcessingInstruction `<?any content ?>` 预处理
  - CDATA - `<![CDATA []]>`

- 字符引用
  - `&#161;` `&#x000A1;`
  - `&amp;` `&lt;` `&gt;` `&quot;` `&apos;`
  - `&plusmn` `&sup2` `&sup3` `&frac14`
  - https://dev.w3.org/html5/html-author/charref

## DOM API

- DOM API 的四个组成部分

  - Node
  - Event
  - Range
  - traversal / iterator - 不好用，废弃

- Node 继承关系

  - DocumentType
  - Document
  - Element
    - HTMLElement
    - SVGElement
  - CharacterData
    - Text
    - Comment
    - ProcessingInstruction
  - DocumentFragment - 结合 Range 使用

- 导航类操作

  - Node 类
    - parentNode - 实际上总是等于 parentElement (只有 Element 才会有子节点)
    - childNodes
    - firstChild
    - lastChild
    - nextSibling
    - previousSibling
  - Element 类
    - parentElement
    - children
    - firstElementChild
    - lastElementChild
    - nextElementSibling
    - previousElementSibling

- 修改类操作

  - appendChile
  - insertBefore
  - removeChild - 在 parentElement 上进行
  - replaceChild

- 高级操作
  - compareDocumentPosition - 比较两个节点先后关系
  - contains
  - isEqualNode
  - isSameNode
  - cloneNode - 参数选择是否 deep copy

## 事件 API

- addEventListener

  - addEventListener( type, listener, [, options] )
  - addEventListener( type, listener, useCapture )

- option 参数对象

  - capture
  - once - 发生一次之后就被移除
  - passive - 不产生副作用，禁止 preventDefault()
    - 可用于 scroll 事件处理提高性能
    - 移动端默认为 false, 需要阻止时设置成 true

- 冒泡与捕获
  - 默认是在冒泡阶段监听，子节点先接收到，父节点晚接收到
  - 若监听函数加在 capture 阶段，事件到达最内层目标节点之前就会触发
  - 最内层的目标节点上，无论监听函数是否带 capture 选项，都是依照添加顺序执行

## Range API

- 创建 Range 及指定起止位置

```javascript
// 指定 DOM 树上的起止位置
const range1 = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
// 从 selection 创建
const range2 = document.getSelection().getRangeAt(0);
```

每个 Range 对象代表 DOM 里面连续的一段内容，可以不是整个节点

element 的偏移值是元素个数

文字元素的偏移值是字符数

```javascript
range.setStartBefore();
range.setEndBefore();
range.setStartAfter();
range.setEndAfter();
range.selectNode();
range.selectNodeContents();
```

通过 window.getSelection() 获取的 Selection 对象可包含多个 Range

- 对 Range 进行操作

```javascript
// 从 DOM 树摘除
const fragment = range.extractContents();
// 在 range 上操作
range.insertNode(document.createTextNode('text'));
```

- 实例
  - 构造 range 对象，指定起止范围
  - 翻转 DOM 元素的子节点 [6-reverse-children.html](6-reverse-children.html)

### CSSOM

对文档当中 CSS 代码内容的抽象

- 访问入口 document.styleSheets : StyleSheetList

  - cssRules : CSSRuleList
  - CSSStyleSheet::insertRule(rule [, index] ) - 含 普通规则 和 @规则; index 默认值是 0
  - CSSStyleSheet::deleteRule(index)
  - 不鼓励用 addRule() 和 removeRule()

- Rule 子类

  - CSSStyleRule
  - CSSMediaRule
  - CSSFontFaceRule
  - CSSKeyFramesRule
  - CSSKeyFrameRule
  - …… 对应于 CSS 语法定义的规则类型

- CSSStyleRule
  - parentStyleSheet - 指向所在的 StyleSheet
  - selectorText - selector
  - cssText - 含 selector 和 `{}` 的规则内容
  - style : CSSStyleDeclaration
    - 作为数组 - 访问 rule 内容定义了的属性 key 名称 (kebab-case)
    - object keys - 所有 CSS 属性的文本值 (属性名为 camelCase)
    - cssText - `{}` 内包含的定义内容原文
    - parentRule - 指向所在的 Rule

实例：通过 CSSOM API 修改伪元素样式

- window.getComputedStyle(elem, pseudo) : 返回 CSSStyleDeclaration

  - 其中作为数组包含 316 个 kebab-case 属性名 (Edge v84), getOwnPropertyNames 得到 844 项，排除 webkit 前缀属性剩下 689 项

  - 可以用来获取/变更运行时元素的当前属性值, 包括伪元素
    - transform 后的状态
    - 拖拽期间的状态
    - 动画运行期间的当前状态

## CSSOM View

对 render 之后的视图样式属性的抽象

- window 上的视图相关属性

  - innerHeight, innerWidth - 可用于呈现内容的视口
  - outerHeight, outerWidth
  - devicePixelRatio - DPR, 高分屏的值大于 1, 表示文档的 1 个 px 实际占用多少物理像素
  - window.screen
    - .width, .height
    - .availWidth, .availHeight - 除去任务栏等, 剩余可用的尺寸

- 新开 window 相关

  ```javascript
  // 第 3 参数可指定 screenX, innerWidth 等
  const w1 = window.open(url, target, 'width=100,height=100,left=100,top=100');
  w1.moveTo(x, y);
  w1.moveBy(dx, dy);
  w1.resizeTo(w, h);
  w1.resizeBy(dx, dy);
  ```

- scroll 相关

  - Element 内容可滚动(overflow: scroll)的元素
    - scrollTop, scrollLeft, scrollWidth, scrollHeight
    - scroll(x, y) / scrollTo(x, y)
    - scrollBy(dx, dy)
    - scrollIntoView()
  - Window
    - scrollX, scrollY
    - scroll(x, y) / scrollTo(x, y)
    - scrollBy(dx, dy)

- layout 相关 (Range::, Element::)
  - getClientRects() - 包含伪元素内容产生的 box
  - getBoundClientRect()
  - 取得完成布局之后实际占用的空间

## 其他 API

- 来源

  - W3C
    - WebAudio, WebAnimation
    - 工作机制: WorkingGroup / CommunityGroup / InterestGroup
  - WHATWG - HTML
  - ECMA - ECMAScript
  - Khronos Group - OpenGL, WebGL

- 从 window 的属性开始动手整理
