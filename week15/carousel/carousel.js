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

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
