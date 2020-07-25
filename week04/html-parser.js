const EOF = Symbol('EOF');
const REGEXP_LETTERS = /^[a-zA-Z]$/;
const REGEXP_WHITE_SPACE = /^[ \t\n\f]$/;

let currentToken = null;

function emit(token) {
  if (!token) debugger;
  console.debug('emit:', token);
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: EOF.toString(),
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

function beforeAttributeName(c) {
  // 暂不处理 attribute 内容
  if (c.match(REGEXP_WHITE_SPACE)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    // c === '>' || c === '/' , afterAttributeName
    emit(currentToken);
    return data;
  } else if (c === '=') {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
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

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
};
