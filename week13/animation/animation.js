const TICK = Symbol('tick');
const TICK_HANDLE = Symbol('tick-handle');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

/** 负责周期性调用 RAF推进时间线; 持有 Animation 对象集合, 驱动它们随时间变化更新状态 */
export class Timeline {
  constructor() {
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
    const startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      const now = Date.now();
      for (const anim of this[ANIMATIONS]) {
        let t;
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
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLE]);
  }
  /** 暂停后继续运行动画 */
  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  /** 重启时间线 */
  reset() {}

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
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
    this.timingFunction = timingFunction;
    this.template = template;
  }
  receiveTime(time) {
    const range = this.endValue - this.startValue;
    let v = this.startValue + (range * time) / this.duration;
    if (this.template) {
      this.object[this.property] = this.template(v);
    } else {
      this.object[this.property] = v;
    }
  }
}
