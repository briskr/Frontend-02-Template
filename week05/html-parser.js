const css = require('css');

const EOF = Symbol('EOF');
const REGEXP_LETTERS = /^[a-zA-Z]$/;
const REGEXP_WHITE_SPACE = /^[ \t\n\f]$/;

// 词法分析阶段
let currentToken = null;
let currentAttribute = null;

// DOM 树构造阶段
let currentTextNode = null;
let stack = [
  {
    type: 'document',
    children: [],
  },
];

let rules = [];
/** 解析<style>标签内的文本(在 head 内定义) */
function addCSSRules(content) {
  var ast = css.parse(content);
  rules.push(...ast.stylesheet.rules);
}

/** 根据已有的 CSS 规则集，计算当前元素的 style 内容 */
function computeCSS(element) {
  //console.debug(rules);
  console.debug(`-- computing CSS for element ${element.tagName} --`);
  //console.debug(element);
}

function emit(token) {
  if (!token) debugger;
  //console.debug('emit:', token);

  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;

    for (let attrName of Object.getOwnPropertyNames(token)) {
      if (
        attrName === 'type' ||
        attrName === 'tagName' ||
        attrName === 'isSelfClosing'
      ) {
        continue;
      }
      element.attributes.push({
        name: attrName,
        value: token[attrName],
      });
    }

    computeCSS(element);

    top.children.push(element);
    //element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw Error('End tag do not match the Open tag');
    } else {
      if (top.tagName === 'style') {
        //console.debug(top.children[0].content);
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: EOF.description,
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(REGEXP_LETTERS)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(REGEXP_LETTERS)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {
    // Error
  } else if (c === EOF) {
    // Error
  } else {
    // Error
    //return bogusComment(c);
  }
}

function tagName(c) {
  if (c.match(REGEXP_WHITE_SPACE)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(REGEXP_LETTERS)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    //Error
  } else {
    //Error
  }
}

function beforeAttributeName(c) {
  // 暂不处理 attribute 内容
  if (c.match(REGEXP_WHITE_SPACE)) {
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(REGEXP_WHITE_SPACE) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(REGEXP_WHITE_SPACE)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    return data;
  } else if (c === EOF) {
  } else {
    return beforeAttributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(REGEXP_WHITE_SPACE)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
    return data;
  } else {
    return unquotedAttributeValue(c);
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(REGEXP_WHITE_SPACE)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    return beforeAttributeName(c);
  }
}

function unquotedAttributeValue(c) {
  if (c.match(REGEXP_WHITE_SPACE)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);

  //console.log('-- result --');
  //console.log(JSON.stringify(stack[0], null, '  '));
};
