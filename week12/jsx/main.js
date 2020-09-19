import { Component, createElement } from './framework.js';

class Carousel extends Component {
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

    // 图片宽度
    const imgw = 571;
    // 当前视口显示的图片的下标
    let position = 0;
    this.root.addEventListener('mousedown', (event) => {
      const children = this.root.children;
      const startX = event.clientX;

      const move = (event) => {
        const x = event.clientX - startX;
        // 找出当前视口中占多数面积的图片的下标
        let current = position - (x - (x % imgw)) / imgw;
        //console.debug('in mousemove, current', current);
        // 找出主体图片的前一帧和后一帧，移动到前后相邻的位置
        for (const offset of [-1, 0, 1]) {
          // pos: 本轮循环被移动的帧的下标
          // 考虑到 current + offset 可能为负，加上 length 再取余，以保证 pos 落在下标允许范围内
          const pos = (current + offset + children.length) % children.length;
          // 调试中遇到持续 current 变小到 -4 ，造成 pos == -1
          //if (current > 2 || current < -3) debugger;
          // if (pos < 0 || pos >= children.length) {
          //   console.error('pos', pos);
          //   pos += children.length;
          // }
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${(-pos + offset) * imgw + (x % imgw)}px)`;
        }
      };

      const up = (event) => {
        // 拖拽结束时，若向左拖动距离(x为负)超过图片宽度的一半，则 position 加一；向右拖动过半则 position 减一
        const x = event.clientX - startX;
        position = (position - Math.round(x / imgw)) % children.length;
        // 上一行代码增加 % 运算，否则每次拖拽后连续增长或减小，减小到 -4 后会造成下次 mousemove 计算出来的 current 变负，取图片失败
        //console.debug('in mouseup, position', position);

        // 移动下标为 position 的图片，及 move 期间被局部露出的图片
        for (const offset of [0, Math.sign(x - (Math.sign(x) * imgw) / 2 - Math.round(x / imgw))]) {
          const pos = (position + offset + children.length) % children.length;
          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${(-pos + offset) * imgw}px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    /* 
    let currentIndex = 0;
    setInterval(() => {
      // nextIndex 的值可以表示平移后的位置应当向左偏移几个 100%, 按 1, 2, 3, 0, 1,... 循环变化
      // 即平移动作的目标位置是 -nextIndex * 100%, 由此反推平移动作的起始位置是 (-nextIndex + 1) * 100%
      const nextIndex = (currentIndex + 1) % this.root.children.length;

      const currentElm = this.root.children[currentIndex];
      const nextElm = this.root.children[nextIndex];

      // 禁用 transition 滑动效果，先把下一帧图片放置到平移动作的起始位置
      nextElm.style.transition = 'none';
      nextElm.style.transform = `translateX(${(-nextIndex + 1) * 100}%)`;

      // 随后开始执行滑动平移动作
      setTimeout(() => {
        // 恢复 transition 滑动效果
        nextElm.style.transition = '';
        // 一起移动前后相邻的两帧图片
        // 旧的当前帧，滑动平移目标位置是目前的位置 (-currentIndex * 100%) 再向左 100%
        currentElm.style.transform = `translateX(${(-currentIndex - 1) * 100}%)`;
        nextElm.style.transform = `translateX(${-nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 16 // 大致是浏览器动画帧间隔时间，未采用 requestAnimationFrame 实现，课内未详细分析，只提到那样会需要两次 RAF 动作);
    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

let d = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];

let a = <Carousel src={d}></Carousel>;
a.mountTo(document.body);
