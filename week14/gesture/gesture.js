const elem = document.documentElement;

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
  console.log('new context', key);
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
    console.log('after end, deleting', key);
    contextMap.delete(key);

    if (event.buttons === 0) {
      elem.removeEventListener('mousemove', mousemove);
      elem.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }
  };

  if (!isListeningMouse) {
    elem.addEventListener('mousemove', mousemove);
    elem.addEventListener('mouseup', mouseup);
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
  console.log('start', point.clientX, point.clientY);
  (context.startX = point.clientX), (context.startY = point.clientY);
  context.isTap = true;
  context.isPan = false;
  context.isPress = false;

  context.pressTimeoutHandle = setTimeout(() => {
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;
    console.log('press');
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
    console.log('panstart');
    clearTimeout(context.pressTimeoutHandle);
  }
  if (context.isPan) {
    console.log('pan', dx, dy);
  }
  //console.log('move', point.clientX, point.clientY);
};

const end = (point, context) => {
  if (context.isTap) {
    console.log('tap');
    clearTimeout(context.pressTimeoutHandle);
  }
  if (context.isPan) {
    console.log('panend');
  }
  if (context.isPress) {
    console.log('pressend');
  }

  //console.log('end', point.clientX, point.clientY);
};

const cancel = (point, context) => {
  clearTimeout(context.pressTimeoutHandle);
  console.log('cancel', point.clientX, point.clientY);
};
