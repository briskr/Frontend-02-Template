/** CSS 样式预处理：数值类属性值转换成 number 类型，其他属性原样复制 */
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (const prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/$[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }

  ['width', 'height'].forEach((size) => {
    if (element.style[size] === 'auto' || element.style[size] === '') {
      element.style[size] = null;
    }
  });

  return element.style;
}

/** 根据 element 上的 CSS 信息，计算元素的位置信息 */
function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  // 样式内容预处理
  const style = getStyle(element);
  if (style.display !== 'flex') {
    return;
  }
  // 提取子元素，去掉文本节点
  var items = element.children
    .filter((e) => e.type === 'element')
    .forEach((e) => {
      getStyle(e);
    });
  items.sort((a, b) => a.order || 0 - (b.order || 0));

  // 补全未指定或 auto 的 flex 布局属性
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }

  // flex 布局计算
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  } else if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  // 反向折行
  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
    crossBase = style.height; //?视频中无此行
  } else {
    crossSign = +1;
    crossBase = 0;
  }

  // 组装 row

  // 1. 特殊情况，父对象 mainSize 未指定，自动把所有子元素加入同一行
  let isAutoMainSize = false;
  if (!style[mainSize]) {
    style[mainSize] = 0;
    for (const item of items) {
      const itemStyle = item.style;
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        style[mainSize] += itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  // 多行
  const flexLine = [];
  const flexLines = [flexLine];
  let mainSpace = style[mainSize];
  let crossSpace = 0;

  for (const item of items) {
    const itemStyle = item.style;
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push[item];
    } else if (style.flexWrap === 'nowrap' || isAutoMainSize) {
      // 不会多于一行
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      // 限定子元素宽度不超过父元素，截断 overflow
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 剩余空间已不足以容纳当前子元素，需要折行
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        // 记录折行前子元素实际占用的高度，和剩余的宽度

        flexLine = [item];
        flexLines.push(flexLine); // 新建一行容纳当前子元素
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push[item];
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  } // for item

  flexLine.mainSpace = mainSpace;
  flexLine.crossSpace = crossSpace;

  console.debug(flexLines);
}

module.exports = layout;
