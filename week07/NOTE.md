学习笔记

> 作业：对 CSS 的属性进行分类

[以 markdown 格式整理](CSS-properties.md) ，没来得及转换成 xmind 脑图，请在 vscode 里折叠全部区块，再逐层展开查看层次结构。

# 学习总结

- 排版部分
  - box 模型的概念
  - 梳理 Normal Flow 当中重要概念
    - line-box, inline-box, block-level box
    - IFC, BFC
  - 行内排版的规则
    - 西文字形概念
    - 西文行基线，中西混排时默认也是在 baseline 上加偏移
  - 块级排布的规则
    - float 和 position: absolute 造成块脱离正常流
    - 位于 BFC 内，和自身包含 BFC，两个属性区分参与块级排版的 3 类不同行为
      - block-level box
      - block container
      - block-level box && block container
    - 难点: BFC 合并规则
      - 思路: 不满足新设立 BFC 的条件，则进行合并
      - 结合实例理解
  - 复习 flex 排版规则
- 绘制部分：
  - 动画定义的语法
  - timing function 和用 贝塞尔曲线 定义随时间变化的模式
  - 色彩理论，HSL 的应用场景
  - 三类需要绘制的元素
  - 绘制的实现: 图形库, 可利用 GPU 加速的 API

# 随堂笔记

## CSS 排版: Box

- DOM 树中包括

  - 元素
  - 其他类型节点 (如文本、CDATA、注释、Process Instruction、DTD 等)

- CSS 选择器选中元素，排版时产生 box (1 个或多个)
- 一个元素，多个 box 的情况：如 inline 折行，或伪元素 ::before ::after
- Box 是排版的基本单位
- Box model
  - margin
  - border
  - padding
- box-sizing 属性影响计算方式
  - box-sizing: border-box; - box 的 width/height 是指 border(含) 以内的部分
  - box-sizing: content-box; - box 的 width/height 是指 content 部分的尺寸

## CSS 排版: Normal Flow

- 排版模式断代：Normal Flow, flex, grid, CSS Houdini
- CSS 排版的对象：文字 和 box
- 正常流对应的隐喻：纸面印刷品

  - 从左到右
  - 一行内的内容对齐
  - 行满后换新行

- 正常流排版过程步骤

  - 收集文字和盒，放进“行”
  - 计算 行 内容的排布
  - 计算 行 的排布

- 主要元素

  - line-box - 行内部产生 inline-level formatting context
  - inline-box
  - block-level box - 盒内部产生 block-level formatting context

## CSS 排版: 正常流的行级排布

- baseline 概念 - 四线本从下往上第二条线
  - 汉字混排时需要在基线上加偏移
- 西文文字字体结构
  - 参考 freetype 库文档 [Glyph Metrics](https://www.freetype.org/freetype2/docs/glyphs/glyphs-3.html)
  - 在基线方向占用的尺寸(包含边距): advance
- 行模型
  - baseline
  - text-bottom, text-top - 容纳行内文字内容所需的空间
  - line-bottom, line-top - 行高高于文字所需，文字之外的空余空间的边界
  - subscript, superscript 位置
  - 与 inline-box 混排时涉及到 line-top / line-bottom 偏移
    - 默认 baseline 对齐
    - inline-block 内有文字时以内部文字基线参与对齐
    - inline-block 内无文字时以 block 底部参与基线对齐
    - vertical-align 设置其他值的效果

## CSS 排版: 正常流的块级排布

- float 与 clear

  - float 元素实际脱离正常流，但依附于正常流
  - 影响附近行盒的宽度，缩减为足够容纳 float 元素
  - float 元素占据的高度范围内，各行都会缩减、绕排
  - float 移动到的位置受到前面其他 float 的限制
  - 加入 clear: right ，下移找到未被占据的位置

- margin collapse - 在 BFC 正常排布方向，连续的 margin 合并，保留其中较大者的要求

## CSS 排版: BFC 合并

- 基本概念

  - block container - 内部容纳 BFC, 子元素进行正常流排版
  - block-level box - 身处于一个 BFC 内的 box
  - block box = 内外都有 BFC - 既是 BFC 的容器，自身也位于 BFC 内

- Block Container

  - display: block | inline-block | table-cell
  - flex item
  - grid cell
  - caption `<caption style="caption-side: bottom;">Table 1</caption>`

- Block-level Box

  - display: block | flex | table | grid
  - 相应的非 block-level 版本: inline-block | inline-flex 等
  - 特殊类型: display: run-in, 随前面元素而定

- 设立 BFC 的条件
  - float, position: absolute - 脱离所在的流
  - block container - 自身不在 BFC 内，但内部设立 BFC
    - inline-block, table-cell, caption
    - flex item, grid cell
  - 带有 非 visible 的 overflow 属性值
- 发生 BFC 合并的情形
  - 与前一节所述相反: 是 block-box (内外均有 BFC), 但 overflow: visible 的元素

## CSS 排版: Flex 排版

- flex 排版过程步骤

  - 收集 box，放进“行”
    - no-wrap 不允许折行，一律放进第一行
    - 允许折行且当前行有剩余空间，则放在当前行，空间不够则新建一行
  - 计算 box 在主轴方向的排布
    - 在主轴上，除去指定宽度的元素所占用之外，还有剩余空间时，按子元素要求的 flex 比例进行分配
    - 若行内空间已经不够，把允许压缩的元素按比例压缩
    - 老师只讲解了 flex 属性值为单一数值的情况
    - flex 属性还可以包含 2 或 3 个值， grow, shrink, basis， 默认的 shrink 比例为 1, basis 为 auto
    - 详细规则见 [flex on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex)
    - flex-basis 值 Firefox 支持 min-content, fill 等，Chrome 不支持
  - 计算 box 在交叉轴方向的排布
    - 行内高度最大元素的高度作为行的高度
    - 根据 align-content 决定各行在交叉轴方向如何分布
    - 根据 align-items 或子元素上的 align-self 决定子元素在行内交叉轴方向如何对齐

## CSS 动画与绘制: 动画

- CSS 样式表现属性分类

  - 控制位置、尺寸
  - 控制绘制、渲染
  - 交互与动画

- Animation

  - 用 `@keyframes` 定义
  - `animation:` 属性
    - `animation-name` - 引用 keyframes ，并包含其他参数
    - `animation-duration` - 时长
    - `animation-timing-function` - 时间曲线
    - `animation-delay` - 开始前的延迟
    - `animation-iteration-count` - 循环次数
    - `animation-direction` - 方向

- Transition

  - `transition-property` - 要变换的属性
  - `transition-duration` - 时长
  - `transition-timing-function` - 时间曲线
  - `transition-delay` - 延迟

- 时间曲线
  - [cubic-bezier](https://cubic-bezier.com/)
  - 演示用 bezier 曲线拟合抛物线
  - 可用于模拟摩擦、回弹等视觉效果

## CSS 动画与绘制: 颜色

- 色彩理论
  - 3 种视锥细胞分别负责感受 3 原色的强度
  - 自然界混合色光，被视锥细胞分解成 RGB 3 个强度的组合来感知
  - C, M, Y 分别是 R, G, B, 的补色，颜料 3 原色是减色混合
  - HSL - Lightness 有符号，负值变暗，正值变亮
  - HSV - Value 无符号，0 是最暗，最大值是最亮

## CSS 动画与绘制: 绘制

- 三类图形元素

  - 几何图形
    - `border`
    - `box-shadow`
    - `border-radius`
  - 文字
    - `font-*` - 根据字体绘制 glyph
    - `text-decoration`
  - 位图
    - `background-image` - 含渐变等

- 实现依赖图形库

  - Android 等平台 - google/skia
  - Windows - GDI
  - 演示实例 - Fragment Shader, [vue-logo.frag](https://github.com/wintercn/glsl-vue-loader/blob/master/samples/vue-cli-example/src/components/vue-logo.frag)

- 推荐用 SVG 绘制矢量图形，data uri 格式嵌入 SVG 代码
