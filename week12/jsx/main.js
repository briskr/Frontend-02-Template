function createElement(type, attrs, ...children) {
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

class TextNodeWrapper {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  // appendChild() {}
  // setAttribute() {}
}

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
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

class Div {
  constructor() {
    this.root = document.createElement('div');
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

let a = (
  <Div class="cls1">
    text<span>label1</span>
    <span>label2</span>
  </Div>
);

//document.body.appendChild(a);
a.mountTo(document.body);