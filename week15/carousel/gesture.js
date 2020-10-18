export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}

/** 负责构造事件，并向 element 派发 */
export class Dispatcher {
  constructor(element) {
    this.element = element;
  }

  dispatch(type, properties) {
    const event = new Event(type);
    for (const name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

/** 负责监听原生事件，并将事件的相关信息组织成 context 对象，调用 Recognizer 的 start(), move(), end() 等 API */
export class Listener {
  constructor(elem, recognizer) {
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
      recognizer.start(event, context);

      const mousemove = (event) => {
        let button = 1;
        while (button <= event.buttons) {
          if (event.buttons & button) {
            const context = contextMap.get('mouse' + button);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };

      const mouseup = (event) => {
        const key = 'mouse' + (1 << calcButtonShift(event.button));
        const context = contextMap.get(key);
        recognizer.end(event, context);
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
        recognizer.start(touch, context);
      }
    });

    elem.addEventListener('touchmove', (event) => {
      for (const touch of event.changedTouches) {
        const context = contextMap.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });

    elem.addEventListener('touchend', (event) => {
      for (const touch of event.changedTouches) {
        const context = contextMap.get(touch.identifier);
        recognizer.end(touch, context);
        contextMap.delete(touch.identifier);
      }
    });

    elem.addEventListener('touchcancel', (event) => {
      for (const touch of event.changedTouches) {
        const context = contextMap.get(touch.identifier);
        recognizer.cancel(touch, context);
        contextMap.delete(touch.identifier);
      }
    });
  }
}

/** 接收 start, move, end 等信息，并根据一系列事件发生的时序识别用户动作的性质，产生相应的自定义事件 */
export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  start(point, context) {
    (context.startX = point.clientX), (context.startY = point.clientY);

    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.startY,
    });

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
      context.pressTimeoutHandle = null;
      this.dispatcher.dispatch('press', {});
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      clearTimeout(context.pressTimeoutHandle);
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }

    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }

    // 保留最近 .5s 时间内经过的点，用于计算速度
    context.points = context.points.filter((point) => Date.now() - point.t < 500);
    context.points.push[
      {
        d: Date.now(),
        x: point.clientX,
        y: point.clientY,
      }
    ];
  }

  end(point, context) {
    if (context.isTap) {
      clearTimeout(context.pressTimeoutHandle);
      this.dispatcher.dispatch('tap', {});
    }
    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {});
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

    const flickThreshold = 1.5;

    // 速度大于门限时发出 flick 事件
    if (v > flickThreshold) {
      context.isFlick = true;
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      });
    }
  }

  cancel(point, context) {
    clearTimeout(context.pressTimeoutHandle);
    this.dispatcher.dispatch('cancel', {});
  }
}
