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

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
  constructor() {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  mountTo(parent) {
    if (!this.root) this.render();
    parent.appendChild(this.root);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
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
