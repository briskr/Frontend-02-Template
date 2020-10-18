import { Component } from './framework';
import { enableGesture } from './gesture';
import { ease } from './timing';
import { Animation, Timeline } from './animation';

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const url of this.attributes.src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url('${url}')`;
      this.root.appendChild(child);
    }
    const children = this.root.children;

    const timeline = new Timeline();
    timeline.start();

    enableGesture(this.root);

    // 图片宽度
    const imgw = 571;
    // 一帧画面滑动动画的运行时长
    const slideDuration = 500;

    // ## 响应 gesture 产生的事件 ##

    // 当前视口显示的图片的下标
    let position = 0;
    // 动画运行起始时刻
    let t = 0;
    // 动画运行带来的位移
    let ax = 0;
    // 触发每次画面移动的定时器
    let slideIntervalHandle = null;

    this.root.addEventListener('start', (event) => {
      timeline.pause();
      clearInterval(slideIntervalHandle);

      const dt = Date.now() - t;
      const progress = dt / slideDuration - Math.floor(dt / slideDuration);
      ax = (1 - ease(progress)) * imgw;
      console.debug('start, dt:', dt, 'progress:', progress, 'ax:', ax);
    });

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX + ax;
      let current = position - (x - (x % imgw)) / imgw;
      console.debug('pan, clientX:', event.clientX, 'startX:', event.startX, 'x:', x, 'current:', current);

      // 找出主体图片及其前一帧、后一帧，让这 3 帧图片根据拖拽的当前位置移动到相应的坐标
      for (const offset of [-1, 0, 1]) {
        // pos: 本轮循环被移动的帧的下标
        // 考虑到 current + offset 可能为负，加上 length 再取余，以保证 pos 落在下标允许范围内
        const pos = (((current + offset) % children.length) + children.length) % children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${(-pos + offset) * imgw + (x % imgw)}px)`;
      }
    });

    this.root.addEventListener('end', (event) => {
      console.debug('end');
      timeline.reset();
      timeline.start();

      // 拖拽结束，重新启动周期性滑动动画
      slideIntervalHandle = setInterval(slideIntoNext, 3000);

      let x = event.clientX - event.startX + ax;
      // 根据拖拽结束位置，选出视口露出内容超过一半的图片是哪一帧
      let current = position - (x - (x % imgw)) / imgw;

      // 计算滑动动画的结束位置: x 的绝对值大于 0.5w 则返回 1 或 -1，符号表示滑动方向
      let direction = Math.round((x % imgw) / imgw);

      // 快扫时即使位移不过半也进入下一张
      if (event.isFlick) {
        console.debug('flick, v:', event.velocity);
        // if (event.velocity > 0) {
        //   console.debug('direction prev', direction);
        //   direction = Math.ceil((x % imgw) / imgw);
        //   console.debug('direction after', direction);
        // } else if (event.velocity < 0) {
        //   direction = Math.floor((x % imgw) / imgw);
        // }
        // ???
        console.debug('direction prev', direction);
        if (x > 0) {
          direction = Math.ceil((x % imgw) / imgw);
        } else if (x < 0) {
          direction = Math.floor((x % imgw) / imgw);
        }
        console.debug('direction after', direction);
      }

      // 选择需要滑动出、入视口的 3 帧图片，启动滑动动画
      for (const offset of [-1, 0, 1]) {
        const pos = (((current + offset) % children.length) + children.length) % children.length;

        children[pos].style.transition = 'none';
        //children[pos].style.transform = `translateX(${(-pos + offset) * imgw + (x % imgw)}px)`;
        // 改用 Animation 执行滑动，起始位置同上计算
        timeline.add(
          new Animation(
            children[pos].style,
            'transform',
            (-pos + offset) * imgw + (x % imgw),
            (-pos + offset + direction) * imgw,
            slideDuration,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      // 动画完成后的当前帧
      position = position - (x - (x % imgw)) / imgw - direction;
      // 修正负值
      position = ((position % children.length) + children.length) % children.length;
    });

    // ## 设置定时自动切换到下一帧图片 ##

    // 负责执行一次滑动的函数
    const slideIntoNext = () => {
      // nextIndex 的值可以表示平移后的位置应当向左偏移几个 100%, 按 1, 2, 3, 0, 1,... 循环变化
      // 即平移动作的目标位置是 -nextIndex * 100%, 由此反推平移动作的起始位置是 (-nextIndex + 1) * 100%
      if (position < 0) {
        position = (position + children.length) % children.length;
      }
      const nextIndex = (position + 1) % children.length;

      const currentElm = children[position];
      const nextElm = children[nextIndex];

      // 记录本次开始滑动动画的时间
      t = Date.now(); // 考虑到 delay == 0

      // 由此改用 Animation 进行滑动
      timeline.add(
        new Animation(
          currentElm.style,
          'transform',
          -position * imgw,
          (-position - 1) * imgw,
          slideDuration,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      timeline.add(
        new Animation(
          nextElm.style,
          'transform',
          (-nextIndex + 1) * imgw,
          -nextIndex * imgw,
          slideDuration,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      position = nextIndex;
    };

    // 启动定时执行，记录 handle 以便取消
    slideIntervalHandle = setInterval(slideIntoNext, 3000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
