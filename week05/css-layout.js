/** CSS 样式预处理：
 * 数值类属性值转换成 number 类型
 * 其他属性原值复制
 * TODO CSS 属性 kebab-case 命名转为 camelCase 命名 */
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (const prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
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
    .sort((a, b) => a.order || 0 - (b.order || 0));
  // 对子元素进行样式预处理
  items.forEach((e) => {
    getStyle(e);
  });

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

  // 收集子元素到若干个 flexLine 里
  let flexLine = []; // 当前行
  const flexLines = [flexLine]; // 收集结果
  let mainSpace = style[mainSize]; // 主轴方向剩余空间
  let lineCrossSize = 0; // 当前行在交叉轴方向的高度(由最高的子元素决定)

  for (const item of items) {
    const itemStyle = item.style;
    if (itemStyle[mainSize] === null || itemStyle[mainSize] === undefined) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex && itemStyle.flex !== 'none') {
      // 是否需要更新剩余宽度？
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' || isAutoMainSize) {
      // 不会多于一行，加入所有子元素
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        lineCrossSize = Math.max(lineCrossSize, itemStyle[crossSize]);
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
        flexLine.lineCrossSize = lineCrossSize;
        // 记录折行前子元素实际占用的高度，和剩余的宽度

        flexLine = [item];
        flexLines.push(flexLine); // 新建一行容纳当前子元素
        mainSpace = style[mainSize];
        lineCrossSize = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        lineCrossSize = Math.max(lineCrossSize, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  } // for item

  flexLine.mainSpace = mainSpace;
  // 最后一行的 lineCrossSize，优先取元素上指定的 crossSize，未指定则取分配完前面所有行后剩余的 lineCrossSize
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.lineCrossSize =
      style[crossSize] !== undefined ? style[crossSize] : lineCrossSize;
  } else {
    flexLine.lineCrossSize = lineCrossSize;
  }

  console.debug('-- finished flexLine collection --');
  console.debug(JSON.stringify(flexLines));
  // 完成各行元素收集

  // 计算主轴 - 得到所有子元素的宽度、起止位置
  if (mainSpace < 0) {
    // 只发生在单行情况下
    // 计算缩小比例
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase; // 当前已分配的子元素末尾位置，作为下一个元素分配的起始位置
    for (const item of items) {
      const itemStyle = item.style;

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      } else {
        itemStyle[mainSize] = itemStyle[mainSize] * scale;
      }

      // 计算子元素实际占用的起止位置
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // mainSpace >= 0
    for (const flexLine of flexLines) {
      let mainSpace = flexLine.mainSpace;
      let flexTotal = 0;

      for (const item of flexLine) {
        const itemStyle = item.style;

        if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
          flexTotal += itemStyle.flex;
        }
      }

      if (flexTotal > 0) {
        // 存在至少一个需要动态分配剩余空间的子元素
        let currentMain = mainBase;
        for (const item of flexLine) {
          const itemStyle = item.style;
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          // 计算子元素实际占用的起止位置
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // 不存在动态分配剩余空间的子元素
        // 此时应当应用 `justify-content` 控制子元素的位置
        let currentMain = mainBase;
        let spacing = 0; // 子元素间的间隔宽度
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase;
          spacing = 0;
        } else if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase;
          spacing = 0;
        } else if (style.justifyContent === 'center') {
          currentMain = (mainSpace / 2) * mainSign + mainBase;
          spacing = 0;
        } else if (style.justifyContent === 'space-between') {
          currentMain = mainBase;
          spacing = (mainSpace / (items.length - 1)) * mainSign;
        } else if (style.justifyContent === 'space-around') {
          spacing = (mainSpace / items.length) * mainSign;
          currentMain = spacing / 2 + mainBase;
        }
        for (const item of flexLine) {
          const itemStyle = item.style;
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + spacing;
        }
      }

      // finished current flexLine
    } // for flexLines
  } // if mainSpace < 0 else
  // 完成主轴计算

  // 开始交叉轴计算

  let crossSpace; // 交叉轴上的剩余未分配空间
  if (!style[crossSize]) {
    // 父元素未指定高度，剩余空间为0
    crossSpace = 0;
    // 计算所有行总高度作为父元素高度
    style[crossSize] = 0;
    for (const flexLine of flexLines) {
      style[crossSize] += flexLine.lineCrossSize;
    }
  } else {
    // 父元素指定了高度，计算扣除各行合计高度之后剩余的空间
    crossSpace = style[crossSize];
    for (const flexLine of flexLines) {
      crossSpace -= flexLine.lineCrossSize;
    }
  }

  // 反向折行，从底部开始
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
    // 此时 crossSign = -1
  } else {
    crossBase = 0;
  }

  //let lineSize = style[crossSize] / flexLines.length;

  // 计算排列 flexLine 的初始位置
  let vspace;
  if (style.alignContent === 'flex-start') {
    //crossBase += 0
    vspace = 0;
  } else if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    vspace = 0;
  } else if (style.alignContent === 'center') {
    crossBase += (crossSign * crossSpace) / 2;
    vspace = 0;
  } else if (style.alignContent === 'space-between') {
    //crossBase += 0;
    vspace = crossSpace / (flexLines.length - 1);
  } else if (style.alignContent === 'space-around') {
    vspace = crossSpace / flexLines.length;
    crossBase += (crossSign * vspace) / 2;
  } else if (style.alignContent === 'stretch') {
    //crossBase += 0;
    vspace = 0;
  }

  // 逐行完成 cross 方向排版
  for (const flexLine of flexLines) {
    let lineCrossSize = flexLine.lineCrossSize;
    if (style.alignContent === 'stretch') {
      lineCrossSize = flexLine.lineCrossSize + crossSpace / flexLines.length;
    }

    for (const item of flexLine) {
      const itemStyle = item.style;
      let align = itemStyle.alignSelf || style.alignItems;

      // 子元素未指定高度，若 stretch 设为行高，非 stretch 则设为0
      if (itemStyle[crossSize] === null || itemStyle[crossSize] === undefined) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      } else if (align === 'center') {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        // itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * ( (itemStyle[crossSize] !== null && itemStyle[crossSign]) );
      } // TODO 未实现 baseline
    } // for each item in flexLine

    // finish current flexLine
    // 计算下一行的起始位置
    crossBase += crossSign * (lineCrossSize + vspace);
  } // for each flexLine

  console.debug('-- finished calculation --');
  console.debug(JSON.stringify(flexLines));
}

module.exports = layout;
