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

    let current = 0;
    setInterval(() => {
      current = ++current % this.root.children.length;
      for (const child of this.root.children) {
        child.style.transform = `translateX(-${current * 100}%)`;
      }
    }, 3000);

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
