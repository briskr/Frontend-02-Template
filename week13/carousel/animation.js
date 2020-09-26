const TICK = Symbol('tick');
const TICK_HANDLE = Symbol('tick-handle');
const ANIMATIONS = Symbol('animations');

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
  }
  set rate(value) {
    this._rate = value;
  }
  get rate() {
    return this._rate;
  }
  start() {
    const startTime = Date.now();
    this[TICK] = () => {
      const t = Date.now() - startTime;
      for (const anim of this[ANIMATIONS]) {
        let t0 = t;
        if (t > anim.duration) {
          this[ANIMATIONS].delete(anim);
          t0 = anim.duration;
        }
        anim.receiveTime(t0);
      }
      this[TICK_HANDLE] = requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }
  pause() {}
  resume() {}
  reset() {}

  add(animation) {
    this[ANIMATIONS].add(animation);
  }
}

export class Animation {
  constructor(obj, prop, startValue, endValue, duration, timingFunction) {
    this.object = obj;
    this.property = prop;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receiveTime(time) {
    const range = this.endValue - this.startValue;
    this.object[this.property] = this.startValue + (range * time) / this.duration;
  }
}
