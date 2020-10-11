const elem = document.documentElement;

const flickThreshold = 1.5;
let isListeningMouse = false;

const contextMap = new Map();

elem.addEventListener('mousedown', (event) => {
  const calcButtonShift = (button) => {
    // mousedown 事件参数的 button 值 - 1 中键, 2 右键
    // mousemove 事件参数的 buttons 值 - 2 右键, 4 中键,
    let shift;
    if (button === 2) shift = 1;
    else if (button === 1) shift = 2;
    else shift = button;
    return shift;
  };

  const context = Object.create(null);
  // key 的取值 1,2,4,8,16 与 buttons 掩码保持一致
  const key = 'mouse' + (1 << calcButtonShift(event.button));
  contextMap.set(key, context);
  console.debug('new context', key);
  start(event, context);

  const mousemove = (event) => {
    let button = 1;
    while (button <= event.buttons) {
      if (event.buttons & button) {
        const context = contextMap.get('mouse' + button);
        move(event, context);
      }
      button = button << 1;
    }
  };

  const mouseup = (event) => {
    console.debug('mouseup', event.button, calcButtonShift(event.button));

    const key = 'mouse' + (1 << calcButtonShift(event.button));
    const context = contextMap.get(key);

    end(event, context);
    //console.debug('after end, deleting', key);
    contextMap.delete(key);

    if (event.buttons === 0) {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    isListeningMouse = true;
  }
});

elem.addEventListener('touchstart', (event) => {
  for (const touch of event.changedTouches) {
    const context = Object.create(null);
    contextMap.set(touch.identifier, context);
    start(touch, context);
  }
});

elem.addEventListener('touchmove', (event) => {
  for (const touch of event.changedTouches) {
    const context = contextMap.get(touch.identifier);
    move(touch, context);
  }
});

elem.addEventListener('touchend', (event) => {
  for (const touch of event.changedTouches) {
    const context = contextMap.get(touch.identifier);
    end(touch, context);
    contextMap.delete(touch.identifier);
  }
});

elem.addEventListener('touchcancel', (event) => {
  for (const touch of event.changedTouches) {
    const context = contextMap.get(touch.identifier);
    cancel(touch, context);
    contextMap.delete(touch.identifier);
  }
});

const start = (point, context) => {
  console.debug('start', point.clientX, point.clientY);
  (context.startX = point.clientX), (context.startY = point.clientY);
  context.points = [
    {
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    },
  ];

  context.isTap = true;
  context.isPan = false;
  context.isPress = false;

  context.pressTimeoutHandle = setTimeout(() => {
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;
    //console.log('press');
    dispatch('press', { point: { x: context.startX, y: context.startY } });
    context.pressTimeoutHandle = null;
  }, 500);
};

const move = (point, context) => {
  let dx = point.clientX - context.startX,
    dy = point.clientY - context.startY;
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false;
    context.isPan = true;
    context.isPress = false;
    clearTimeout(context.pressTimeoutHandle);
  }
  if (context.isPan) {
    //console.debug('pan', dx, dy);
    dispatch('panstart', {});
  }
  // 只保留最近 .5s 时间内的点
  context.points = context.points.filter((point) => Date.now() - point.t < 500);
  context.points.push[
    {
      d: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }
  ];
  //console.log('move', point.clientX, point.clientY);
};

const end = (point, context) => {
  if (context.isTap) {
    //console.log('tap');
    dispatch('tap', {});
    clearTimeout(context.pressTimeoutHandle);
  }
  if (context.isPan) {
    //console.log('panend');
    dispatch('panend', { point: { x: point.clientX, y: point.clientY } });
  }
  if (context.isPress) {
    //console.log('pressend');
    dispatch('pressend', {});
  }

  // 计算移动速度
  context.points = context.points.filter((point) => Date.now() - point.t < 500);
  let v;
  if (!context.points.length) {
    v = 0;
  } else {
    let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
    v = d / (Date.now() - context.points[0].t);
  }
  // 速度大于门限时发出 flick 事件
  if (v > flickThreshold) {
    //console.log('flick');
    context.isFlick = true;
    dispatch('flick', { point: { x: point.clientX, y: point.clientY } });
  } else {
    context.isFlick = false;
  }
  //console.log('end', point.clientX, point.clientY);
};

const cancel = (point, context) => {
  clearTimeout(context.pressTimeoutHandle);
  console.debug('cancel', point.clientX, point.clientY);
};

/** 构造事件 */
function dispatch(type, properties) {
  const event = new Event(type);
  for (const name in properties) {
    event[name] = properties[name];
  }
  elem.dispatchEvent(event);
}
