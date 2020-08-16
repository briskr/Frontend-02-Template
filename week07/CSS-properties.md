# CSS 属性分类目录

## layout 相关

  - box model

    - margin 相关

      - margin : shorthand
        - margin-top
        - margin-right
        - margin-bottom
        - margin-left
      - margin-block : shorthand - 独立于方向
        - margin-block-start
        - margin-block-end
      - margin-inline: shorthand
        - margin-inline-start
        - margin-inline-end

    - padding 相关

      - padding: shorthand
        - padding-top
        - padding-right
        - padding-bottom
        - padding-left
      - padding-block: shorthand - 独立于方向
        - padding-block-start
        - padding-block-end
      - padding-inline: shorthand
        - padding-inline-start
        - padding-inline-end

    - box-sizing - box 尺寸计算模式
    - height
    - max-height, min-height
    - width
    - max-width, min-width
    - block-size - 相当于 width 或 height，视 writing mode 而定
    - inline-size - 相当于 width 或 height，视 writing mode 而定

  - display : shorthand

    - display-outside
    - display-inside
    - display-listitem
    - display-internal
    - display-box
    - display-legacy

  - 正常流排版

    - direction - 书写方向 ltr, rtl
    - unicode-bidi
    - writing-mode - 横向 / 纵向 , 左右 / 上下
    - text-orientation
    - text-combine-upright - 纵中横, 竖行文字中少量数字横向书写
    - text-align
    - text-align-last
    - vertical-align - inline-block 在行内对齐的方式
    - text-indent - 段首缩进
    - text-justify
    - text-overflow - 超出 box 时加省略号(配合 white-space 使用)
    - white-space - 文字内容中的空白是否保留
    - word-break - 超长单词是否断开折行
    - line-break - CJK 文字与标点连接时如何断行
    - hyphens - 加入连字符的规则
    - overflow-wrap - 文字折行选项
    - tab-size - 通常用于 pre
    - letter-spacing
    - word-spacing

    - 多栏文字排版相关
      - columns : shorthand
        - column-count
        - column-width
      - column-fill
      - column-span
      - column-gap
      - column-rule : shorthand 栏分隔线
        - column-rule-width
        - column-rule-style
        - column-rule-color

    - 特殊形状绕排
      - shape-outside
      - shape-margin
      - shape-image-threshold

  - 控制 BFC 定位元素

    - overflow : shorthand
      - overflow-x
      - overflow-y
    - overflow-block - 方向视 writing mode 而定
    - overflow-inline - 方向视 writing mode 而定
    - overflow-anchor
    - float
    - clear
    - `position: absolute;`, `position: fixed;`, `position: relative;`
    - inset : shorthand - 同时指定以下属性中的一个或以上
      - top
      - left
      - bottom
      - right
    - inset-block : shorthand - 方向视 writing mode 而定
      - inset-block-start
      - inset-block-end
    - inset-inline : shorthand - 方向视 writing mode 而定
      - inset-inline-start
      - inset-inline-end
    - z-index - 分层
    - clip - 对绝对定位元素的可视范围进行剪切

  - flex 排版相关

    - `display-inside: flex;`
    - 容器属性
      - flex-flow: shorthand
        - flex-direction - 方向
        - flex-wrap - 折行
      - justify-content - 主轴方向行内排布
      - align-items - 交叉轴方向行内对齐
      - align-content - 交叉轴方向, 多行的排布
    - 子元素属性
      - flex - shorthand
        - flex-grow
        - flex-shrink
        - flex-basis
      - order
      - align-self

  - grid 排版相关

    - `display-inside: grid;`
    - grid : shorthand
      - grid-auto-columns
      - grid-auto-flow
      - grid-auto-rows
      - grid-template: shorthand
        - grid-template-areas
        - grid-template-columns
        - grid-template-rows
    - grid-row : shorthand
      - grid-row-start
      - grid-row-end
    - grid-column: shorthand
      - grid-column-start
      - grid-column-end
    - grid-template
    - grid-auto-rows
    - grid-auto-columns
    - grid-auto-flow
    - gap : shorthand
      - row-gap
      - column-gap
    - grid-area
    - justify-items - 应用于 grid 容器，规定如何对齐子元素
    - justify-self - 单个 grid 子元素指定不同于默认的对齐方式
    - place-content: shorthand - 适用于 flex 和 grid，同时指定容器在两个方向的行/列对齐模式
      - align-content
      - justify-content
    - place-items: shorthand - 适用于 flex 和 grid，同时指定容器在两个方向的行/列内子元素对齐模式
      - align-items
      - justify-items
    - place-self : shorthand - 适用于 flex 和 grid，同时指定单个子元素在行/列内两个方向上的对齐模式
      - align-self
      - justify-self

  - table 相关

    - `display-inside: table;`
    - table-layout
    - caption-side


  - 嵌入对象排版相关 (含 iframe, video, embed, img 等)
    - object-fit - 调整嵌入对象模式
    - object-position
    
  - 列表样式

    - list-style : shorthand
      - list-style-image
      - list-style-position
      - list-style-type



  - page 媒体相关
    - orphans
    - widows

## render 相关

  - 几何图形

    - 边框
      - border : shorthand
        - border-width
        - border-style
        - border-color
      - 单个边的边框 shorthand
        - 含 border-_-width, border-_-style and border-\*-color
        - border-top
        - border-right
        - border-bottom
        - border-left
      - border-radius - 圆角边框
        - bottom-bottom-left-radius
        - bottom-bottom-left-radius
        - bottom-top-left-radius
        - bottom-top-right-radius
      - border-image - 图片边框
        - border-image-outset
        - border-image-repeat
        - border-image-slice - 九宫格切图
        - border-image-source
        - border-image-width

    - outline : shorthand - 类似 border 但不占空间
     - outline-color
     - outline-style
     - outline-width

  - 文字相关

    - color
    - text-decoration : shorthand
      - text-decoration-line
      - text-decoration-color
      - text-decoration-style
      - text-decoration-thickness
    - text-decoration-skip-ink - 下划线避开字脚
    - text-underline-offset - 下划线下移
    - text-underline-position - 下划线位置
    - text-emphasis : shorthand
      - text-emphasis-color
      - text-emphasis-style
    - text-emphasis-position
    - text-shadow
    - text-transform - 改变大小写
    - font : shorthand
      - font-family
      - font-size
      - font-stretch
      - font-style
      - font-variant - 连笔字母等
      - font-weight
      - line-height
    - font-kerning
    - font-language-override
    - font-optical-sizing
    - font-size-adjust - 非默认启用
    - hanging-punctuation - 仅 Safari

  - 位图绘制相关

    - background 相关

      - background : shorthand
        - background-attachment
        - background-clip
        - background-color
        - background-image
        - background-origin
        - background-position
        - background-repeat
        - background-size

    - mask : shorthand - 图层叠加运算

      - mask-clip
      - mask-composite
      - mask-image
      - mask-mode
      - mask-origin
      - mask-position
      - mask-repeat
      - mask-size

    - box-shadow

    - opacity

    - box-decoration-break - IFC 折行时的样式处理

    - clip-path

    - transform - 图像变形

      - 可使用多种 <transform-function>
      - transform-box - 变形时采用的基准区域
      - transform-origin - 旋转等操作的固定点
      - transform-style - 是否 3D 旋转
      - translate - 声明元素在 transform 时使用的移动参数
      - rotate - 声明在 transform 时使用的旋转参数
      - scale
      - backface-visibility
      - perspective
      - perspective-origin

    - filter - 图像滤镜处理

    - mix-blend-mode - 与父元素混色

  - SVG 相关
    - fill
    - stroke
    - paint-order - fill 和 stroke 绘制顺序

## 交互与动画 相关

  - animation : shorthand

    - animation-name
    - animation-duration
    - animation-timing-function
    - animation-delay
    - animation-iteration-count
    - animation-direction
    - animation-fill-mode
    - animation-play-state

  - offset : shorthand - 按路径移动动画对象
    - offset-anchor
    - offset-distance
    - offset-path
    - offset-position
    - offset-rotate

  - transition : shorthand

    - transition-property
    - transition-duration
    - transition-timing-function
    - transition-delay

  - 交互界面类
    - cursor - 鼠标指针形状
    - caret-color - 文字插入光标颜色
    - pointer-events - SVG 图元得 fill/stroke 部分是否响应点击
    - resize - 是否允许用户调整元素大小
    - touch-action - 触摸屏操作
    - scroll-behavior - 平滑滚动
    - scroll-margin : shorthand
      - scroll-margin-bottom
      - scroll-margin-left
      - scroll-margin-right
      - scroll-margin-top
    - scroll-padding : shorthand
      - scroll-padding-bottom
      - scroll-padding-left
      - scroll-padding-right
      - scroll-padding-top
    - overscroll-behavior - 滚动到底时的行为

## 其他类型属性

  - contain - 父元素限定内容排版、样式等属性不受外界影响，避免重排，提高性能

  - 绘图选项
    - text-rendering - 文字渲染优化选项
    - color-adjust - 是否允许颜色替代
    - image-rendering - 图片缩放算法

  - content - 伪元素内容
    - quotes -  伪元素上定义 `content: open-quote;` `content: close-quote;` 时自定义引号字符

  - 样式重置
    - all - 用于重置全部样式
    - revert
    - unset
