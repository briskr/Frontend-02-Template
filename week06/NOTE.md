学习笔记

# 本周学习总结

- CSS 总论

  - 借助 CSS 规范 2.1 版本文档整理语法层级
  - 根据最新文档整理常用的 at_rules 类型列表，和 rules 的语法结构
    - at_rules 实践中主要需要掌握的有 `@media`, `@fontface`, `@keyframes`
    - 普通规则 的结构分为 selectors, key, value. selector 下一课着重讲解.
      - key - 主要是各类样式属性，和 shorthand；新扩展的有 CSS variables
      - value - 包括长度、百分比等数值，颜色，枚举性质的属性值等等，还可以是函数调用
  - 借助工具脚本从 W3C 网站上批量查找某一类页面内容块 [4-css-specs.js](4-css-specs.js)

- CSS 选择器

  - 讲解选择器语法，引入简单选择器、复合选择器、复杂选择器等概念
  - specificity 计算
  - 列举了常用的伪类和伪元素，分别讲解其语义

## 作业

- 第 7 节随堂作业

  [specificity 计算](7-specificity.md)

- 第 9 节随堂作业

  [CSS selector 匹配函数](9-match.html) (未调试完成，有总体思路)

- 思考题

> 为什么 `first-letter` 可以设置 `float` 之类的，而 `first-line` 不行呢？

- 查阅目前的规范文档，[CSS Pseudo-Elements Module Level 4](https://www.w3.org/TR/2019/WD-css-pseudo-4-20190225/#first-line-styling) (Working Draft, 2019 年 2 月)
  中 #first-line-styling 这一节的表述，除了其中列出的，要求实现的文字颜色、字体、字体排版等 inline 样式，还有下面这句话：

  > User agents may apply other properties as well.

  据此，我的理解是，如果浏览器不对 `::first-line` 实现 `float` 等样式，应该不是基于规范的限制，那么主要可能是基于这些样式会对排版的实现带来困难，或者实现这些样式带来的价值太小。

- 规范中规定， `first-line` 和 `first-letter` 都要求应用于块级元素上，控制块级元素或作为子元素的块级元素的内容。不过文档中对于 `::first-letter` 的说法留了一个口子，说未来可能支持其他显示类型(的元素)。

  > In CSS, the `::first-line` pseudo-element can only have an effect when attached to a **block container**. The first formatted line of an element must occur **inside a block-level descendant** in the **same flow** (i.e., a block-level descendant that is not out-of-flow due to floating or positioning).

  > In CSS, the ::first-letter pseudo-element only applies to block containers. **A future version of this specification may allow this pseudo-element to apply to more display types.**

- `first-letter` 只控制首字符(最多包含前面的标点符号)的样式，其宽度不会超过一行。

  - 如果没有定义 `float` 属性，但给字符加上 `margin` 等适用于块级元素的属性，可以通过在行内加一个 inline-block 作为首字符的容器来实现，后续文字位于 normal flow 的同一行上。
  - 如果定义了 `float` 属性，则首字符的“块”会脱离段落内后续文字的 normal flow，独立出来。如果给首字符伪元素定义的高度高于正文的行高，后续的正文还会围绕首字符进行折行。

- 规范中关于 User agent 实现 `::first-line` 伪元素时，如何确定一个具体的元素的内容的哪些部分要应用该样式(文档中的 #first-text-line 这一节)，给出的建议是找到 "First Formatted Line" ，即在块内进行文字排版之后，对其中位于首行的内容外面包上一对虚拟的 tag，再在这个新元素上应用 `::first-line` 选择器定义的 CSS 样式规则。由此，User agent 应该先对块内文字进行排版，根据所在区域宽度、字体大小、字间距等，处理完折行的情况，然后再对其中的首行应用 `::first-line` 伪元素指定的样式。

  ```
  <P><P::first-line>First line of this paragraph</P::first-line> and the rest of the paragraph.</P>
  </DIV>
  ```

- 对于老师提出的问题，分成两部分来讨论：

  1. 如果允许给 `::first-line` 设置 `margin` `padding` `border` `box-shadow` 属性，也就是把首行内容看作一个块元素。那么浏览器程序实现当中，首先需要对文字内容进行上一段讨论过的排版操作，确定哪些文字属于首行，然后把这些文字装入一个块元素。但由于边距和填充等属性会影响块元素内空间的大小，可能造成这个新建的块内部无法容纳准备装进其中的文字内容，从而需要重新排版，增减原先位于行末的字词，直到上级块元素所在的空间内能够容纳这个新建的块。这个逻辑实现起来可能比较复杂，运行时可能需要来回计算几轮，影响效率。

  2. 如果允许给 `::first-line` 设置 `float` 属性，则首行内容不仅变成了一个块元素，还脱离了后续文字所属的 normal flow。另外，`float` 属性通常意味着限定浮动元素的宽度，在其浮动方向的另一测留出空间，容纳后续内容。在以上假定之下，再假定文字方向是从左到右：

     - 如果 `float: left`，且 `::first-line` 定义的样式属性增大字体，或增加行高到原行高的两倍以上，则后续文字会被挤个新建的块右边进行排版。想象一下，左半边是连续几个大字，右半边是两行以上小字，这样明显搅乱了段落的整体阅读流向，增加阅读的困难。

     - 如果 `float: right`，且 `::first-line` 缩减了宽度，那么首行内容浮动到右边，左边又有空间能够容纳后续的文字，这个场景更是违反了人们习惯的文字流向。

  从以上讨论可见，对 `::first-line` 伪元素引入块级元素的样式和 `float` 样式，并没有带来什么实质性的价值，反而会带来更多的麻烦。

# 随堂笔记

先以 CSS 2.1 版本文档来看 CSS 基础语法定义

## CSS 总论

### 总体结构

```css
  <!-- 头部信息 -->

  @charset ;
  @import ;

  <!-- 规则定义 -->

  @media media_a {
    rule_set
  }

  @page {
    declarations;
  }

  tag.class {
    declarations;
  }
```

总体来看，分为 at_rule 和 rule 两大类

### @规则

- 常用 at_rules 清单
  - @charset - css-syntax-3
  - @import - css-cascade-4
  - **@media** - css3-conditional
  - @page - css-page-3
  - @counter-style css-counter-styles-3
  - **@keyframes** css-animations-1
  - **@fontface** css-fonts-3
  - @supports css3-conditional
  - @namespace css-namespaces-3

### 普通规则

- 语法

  - selectors
  - declarations
    - key, value pair

- selector
  - 目前主流是 level-3
- key
  - properties
  - [variables](w3.org/TR/css-variables)
- value
  - 值
  - 函数

### 样式规则的语法元素分析

- selectors 部分

  - selectors_group: 由逗号分隔的多个 selector
  - selector: 由 combinator ( `+`, `>`, `~`, 空白 ) 分隔的多个 简单选择器序列
  - 简单选择器序列
    - 1 个以上的简单选择器组成序列，如果含有 type_selector 或 universal`*`，放在最前
    - 简单选择器类型还包括 HASH`#`, class`.`, `[attrib]`, `::pseudo-element` or `:pseudo-class`, `:not(simple_selector)`

- key 部分

  - 普通 property
  - 变量 `--variable`
    - 在样式值中以 `var(--variable[, defaultValue])` 形式调用，可传入 `calc` 等函数参与计算
    - 即使变量值在调用处无效，也会作为一个无效值应用该声明

- value 部分
  - css-values-4
  - 数值的类型
  - 相对长度、绝对长度单位
  - color, image, position
  - 函数 `calc()` `min()` `max()` `clamp()` 等
  - `toggle()`
  - `attr(name type?[, fallback])` 引用 attr 值

### 抓取规范内容

由于 CSS 属性定义散布在多个规范文档当中，编写了一个脚本工具，提取 w3 网站上所有关于 CSS 的规范页面信息，逐个在其 HTML 内容中查找 class = '.propdef' 的信息块。

## CSS 选择器

### 选择器语法

- 简单选择器

  - universal `*` `namespace|*`
  - type_selector `tag`, `namespace|type` (配合 `@namespace` 声明)
  - class `.cls.cls2` 匹配 class 属性值中包含多个 class 名，空格分隔
  - HASH `#id`
  - attrib
    - `[attr=val]`属性值等于 val
    - `[attr|=val]`属性值等于，或其中以`-`分隔的前缀匹配 val，例如 `[lang|=en` 可以匹配 'en' 和 'en-US',
    - `[attr~=val]`属性值当中空格分隔的多个部分中有一个匹配 val
    - 子串匹配类
      - `[attr^=val]` val 出现在前缀
      - `[attr$=val]` val 出现在后缀
      - `[attr*=val]` val 出现在值的任何位置
  - pseudo-class `:hover`
  - pseudo-element `::after`

- 复合选择器

  - 若干 简单选择器 直接连接
  - `*` 或 type 必须放在最前
  - 伪类 或 伪元素 必须放在最后

- 复杂选择器
  - 由 combinator 连接
  - space 后代
  - `A > C` 直接父子元素
  - `a ~ p` 同层级的兄弟元素，选中前者之后出现的所有后者
  - `a + b` 相邻的兄弟元素，选中后者
  - `||` (leve-4 定义，表格中的列)

### 选择器优先级 specificity

MDN 表述：

Universal selector (`*`), combinators (`+`, `>`, `~`, ' ', `||`) and negation pseudo-class (`:not()`) have no effect on specificity. (The selectors declared inside `:not()` do, however.)

通配选择符（universal selector）（`*`）关系选择符（combinators）（`+`, `>`, `~`, ' ', `||`）和 否定伪类（negation pseudo-class）（`:not()`）对优先级没有影响。（但是，在 `:not()` 内部声明的选择器会影响优先级）。

参考资料:

- 概述 https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#Specificity_2
- 详解 https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

### 伪类

- 链接/行为相关
  - :any-link 任何超链接
  - :link 尚未访问; :visited 已访问
  - :hover 鼠标指向
  - :active 正在点击
  - :focus 获得焦点
  - :target `#hash` 导航定位到达的 anchor

:visited 只允许改变文字颜色等基本属性，忽略非 0 的 alpha 值，且无法通过 window.getComputedStyle 获取真实的值。[参考资料](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited)

- 树结构

  - `:empty`
  - `:nth-child()`
    - even | odd
    - 3n+2
  - `:nth-last-child()`
  - `:first-child`; `:last-child`; `:only-child`

- 逻辑型

  - `:not()` - 表达式不支持带 combinator 的复杂选择器
  - `:where()`; `:has()` - level-4

### 伪元素

- `::before`, `::after`
  - 增加元素，可含 `content`
  - 增加到所在元素的 children 当中，作为第一个/最后一个子元素
- `::first-line`; `::first-letter` - 应用在排版之后的内容上
  - 可控制的样式受限制
    - 字体和文字版式类，字间距、行高等
    - `::first-letter` 增加 box 模型相关, `float`, `vertical-align`

# 延伸学习

## 简单选择器、复合选择器、复杂选择器 概念与规范中的语法元素对照

<img src="selectors.png" alt="selector结构示意图" width="400"/>

[CSS3](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#grammar) 中的 selector 语法定义：

```
selector
  : simple_selector_sequence [ combinator simple_selector_sequence ]*
  ;
combinator
  /* combinators can be surrounded by whitespace */
  : PLUS S* | GREATER S* | TILDE S* | S+
  ;
simple_selector_sequence
  : [ type_selector | universal ]
    [ HASH | class | attrib | pseudo | negation ]*
  | [ HASH | class | attrib | pseudo | negation ]+
  ;
```

其中 `simple_selector_sequence` 相当于不含 combinator 的 "复合选择器"。
用 `combinator` 连接起来成为 `selector`，称为 "复杂选择器"

[CSS2](https://www.w3.org/TR/2011/REC-CSS2-20110607/grammar.html) 中的 selector 语法定义：

```
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
```

这里面的 simple_selector 概念相当于 CSS3 规范里面说的 simple_selector_sequence

## 伪元素相关

- [这篇文章](https://css-tricks.com/almanac/selectors/f/first-line/) 提到，`::first-line` 伪元素的样式能够覆盖其他任何 specificity 级别的规则，原理是伪元素相当于是一个新建的子元素，因此不直接继承所在元素的样式。
