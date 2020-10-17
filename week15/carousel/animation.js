const TICK = Symbol('tick');
const TICK_HANDLE = Symbol('tick-handle');

/** 现有的被 Timeline 驱动的 anim 对象集合 */
const ANIMATIONS = Symbol('animations');

/** 记录每个 anim 对象被 add 的时间 */
const START_TIME = Symbol('start-time');

const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

/** 负责周期性调用 RAF推进时间线; 持有 Animation 对象集合, 驱动它们随时间变化更新状态 */
export class Timeline {
  constructor() {
    this.state = 'Init';
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  /** 播放速率倍数 */
  set rate(value) {
    this._rate = value;
  }
  get rate() {
    return this._rate;
  }

  start() {
    if (this.state !== 'Init') return;
    this.state = 'Started';

    const startTime = Date.now();
    this[PAUSE_TIME] = 0;

    this[TICK] = () => {
      const now = Date.now();
      for (const anim of this[ANIMATIONS]) {
        let t;

        // 调用 start() 之前已 tl.add(anim) 添加进来, 则从 start() 调用开始运行; start() 之后才 add() 的 anim 从 add 的时刻开始执行
        if (this[START_TIME].get(anim) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - anim.delay;
        } else {
          t = now - this[START_TIME].get(anim) - this[PAUSE_TIME] - anim.delay;
        }
        if (t > anim.duration) {
          this[ANIMATIONS].delete(anim);
          t = anim.duration;
        }
        if (t > 0) anim.receiveTime(t);
      }
      this[TICK_HANDLE] = requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }

  /** 暂停运行动画 */
  pause() {
    if (this.state !== 'Started') return;
    this.state = 'Paused';
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLE]);
    this[TICK_HANDLE] = null;
  }
  /** 暂停后继续运行动画 */
  resume() {
    if (this.state !== 'Paused') return;
    this.state = 'Started';

    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  /** 重置: 清空已加入的 anim 对象, 仍保持已 start 的状态, 可以重新 add() */
  reset() {
    this.state = 'Init';
    this.pause();
    this[PAUSE_START] = 0;

    //const startTime = Date.now(); //视频中复制了这行，实际不需要
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_TIME] = 0;
  }

  add(anim, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(anim);
    this[START_TIME].set(anim, startTime);
  }
}

/** 负责随着时间流逝，持续变更一个 object 的 property 的值 */
export class Animation {
  constructor(obj, prop, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = obj;
    this.property = prop;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || ((v) => v);
    this.template = template || ((v) => v);
  }
  /**
   * 根据从启动动画时刻算起，已流逝的时长，变更 this.object 的 this.property 属性值
   */
  receiveTime(time) {
    // 计算属性值
    const range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration);

    let v = this.startValue + range * progress;

    // 应用计算结果值, 和套用 template
    this.object[this.property] = this.template(v);
  }
}
