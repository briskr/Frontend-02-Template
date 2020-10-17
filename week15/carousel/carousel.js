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
    // 当前视口显示的图片的下标
    let position = 0;

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX;
      let current = position - (x - (x % imgw)) / imgw;
      // 找出主体图片的前一帧和后一帧，移动到前后相邻的位置
      for (const offset of [-1, 0, 1]) {
        // pos: 本轮循环被移动的帧的下标
        // 考虑到 current + offset 可能为负，加上 length 再取余，以保证 pos 落在下标允许范围内
        const pos = (((current + offset) % children.length) + children.length) % children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${(-pos + offset) * imgw + (x % imgw)}px)`;
      }
    });

    this.root.addEventListener('panend', (event) => {
      // 拖拽结束时，若向左拖动距离(x为负)超过图片宽度的一半，则 position 加一；向右拖动过半则 position 减一
      const x = event.clientX - event.startX;
      position = (position - Math.round(x / imgw)) % children.length;

      // 移动下标为 position 的图片，及 move 期间被局部露出的图片
      for (const offset of [0, Math.sign(x - (Math.sign(x) * imgw) / 2 - Math.round(x / imgw))]) {
        const pos = (position + offset + children.length) % children.length;
        children[pos].style.transition = '';
        children[pos].style.transform = `translateX(${(-pos + offset) * imgw}px)`;
      }
    });

    setInterval(() => {
      // nextIndex 的值可以表示平移后的位置应当向左偏移几个 100%, 按 1, 2, 3, 0, 1,... 循环变化
      // 即平移动作的目标位置是 -nextIndex * 100%, 由此反推平移动作的起始位置是 (-nextIndex + 1) * 100%
      if (position < 0) {
        position = (position + children.length) % children.length;
      }
      const nextIndex = (position + 1) % children.length;

      const currentElm = children[position];
      const nextElm = children[nextIndex];

      // 禁用 transition 滑动效果，先把下一帧图片放置到平移动作的起始位置
      nextElm.style.transition = 'none';
      nextElm.style.transform = `translateX(${(-nextIndex + 1) * imgw}px)`;

      // 由此改用 Animation 进行滑动
      timeline.add(
        new Animation(
          currentElm.style,
          'transform',
          -position * imgw,
          (-position - 1) * imgw,
          500,
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
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      position = nextIndex;
    }, 3000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
