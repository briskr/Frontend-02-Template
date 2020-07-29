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
  const ast = css.parse(content);
  //console.debug('parsed rules:', ast.stylesheet.rules);
  rules.push(...ast.stylesheet.rules);
}

/**
 * 判断 element 是否匹配 selector
 * 支持 elem .class #id 等形式之一，暂不支持复合选择器
 */
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  // TODO 复合选择器，拆分 selector 结构，满足 selector 要求的所有条件才算匹配

  // TODO 元素的 class 属性有空格分隔的多个值，其中之一与 selector 匹配即可

  if (selector.charAt(0) === '#') {
    let attr = element.attributes.filter((attr) => attr.name === 'id')[0];
    if (attr && attr.value === selector.substring(1)) {
      return true;
    }
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter((attr) => attr.name === 'class')[0];
    if (attr && attr.value === selector.substring(1)) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

/** 根据已有的 CSS 规则集，计算当前元素的 style 内容 */
function computeCSS(element) {
  const parentElements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (const rule of rules) {
    var selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) continue;

    let matched = false;
    let j = 1;
    for (let i = 0; i < parentElements.length; i++) {
      if (match(parentElements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      const computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        computedStyle[declaration.property].value = declaration.value;
      }
      console.debug(element, element.computedStyle);
    }
  }
}

function emit(token) {
  if (!token) debugger;
  // console.debug('emit:', token);

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
      // console.debug('started element:', element);
    } else {
      // console.debug('self-closed element:', element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw Error('End tag do not match the Open tag');
    } else {
      // 收集 CSS 样式规则定义
      if (top.tagName === 'style') {
        //console.debug(top.children[0].content);
        addCSSRules(top.children[0].content);
      }
      const elem = stack.pop();
      // console.debug('ended element:', elem);
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
