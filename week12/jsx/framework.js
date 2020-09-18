export function createElement(type, attrs, ...children) {
  let elem;
  if (typeof type === 'string') {
    elem = new ElementWrapper(type);
  } else {
    elem = new type();
  }

  for (const name in attrs) {
    elem.setAttribute(name, attrs[name]);
  }
  for (const child of children) {
    if (typeof child === 'string') {
      child = new TextNodeWrapper(child);
    }
    elem.appendChild(child);
  }
  return elem;
}

export class Component {
  constructor() {
    this.root = this.render();
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(this.type);
  }
}

class TextNodeWrapper extends Component {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
}
