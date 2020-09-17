function createElement(tag, attrs, ...children) {
  const elem = document.createElement(tag);
  for (const key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
  for (const child of children) {
    /* if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    elem.appendChild(child); */
    // append 方法可接受 DOMString 或 Node
    elem.append(child);
  }
  return elem;
}

let a = (
  <div class="cls1">
    text<span>label1</span>
    <span>label2</span>
  </div>
);

document.body.appendChild(a);