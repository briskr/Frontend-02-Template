var assert = require('assert');

import { parseHTML } from '../src/parser.js';

describe('test parseHTML', function () {
  /*
   */
  it('<p></p> has 1 child, and the child has no children', function () {
    const tree = parseHTML('<p></p>');
    assert.strictEqual(tree.children[0].tagName, 'p');
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it('<a href="//github.com"></a> has attribute', function () {
    const tree = parseHTML('<a href="//github.com"></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].value, '//github.com');
  });

  it("<a href='//github.com'></a> single quoted attr", function () {
    const tree = parseHTML("<a href='//github.com'></a>");
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].value, '//github.com');
  });

  it('<hr/> self close', function () {
    const tree = parseHTML('<hr/>');
    const hr = tree.children[0];
    assert.strictEqual(hr.tagName, 'hr');
  });

  it('no tag, pure text', function () {
    const tree = parseHTML('sample');
    const elem = tree.children[0];
    assert.strictEqual(elem.type, 'text');
    assert.strictEqual(elem.content, 'sample');
  });

  it('<> - as text', function () {
    const tree = parseHTML('<>');
    const elem = tree.children[0];
    assert.strictEqual(elem.type, 'text');
    assert.strictEqual(elem.content, '>');
  });

  it('<div  data="1"/> extra space before attribute name', function () {
    let tree = parseHTML('<div  data="1"/>');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes.length, 1);
  });

  it('<div data= "1"/> extra space before attribute value', function () {
    let tree = parseHTML('<div  data= "1"/>');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes.length, 1);
  });

  it('<div data/> afterAttributeName', function () {
    let tree = parseHTML('<div data />');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');

    tree = parseHTML('<div data/>');
    elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
  });

  it('<div data id /> afterAttributeName', function () {
    let tree = parseHTML('<div data id />');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
  });

  it('<div class=news /> unquoted attr value', function () {
    let tree = parseHTML('<div class=news />');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes[0].name, 'class');
    assert.strictEqual(elem.attributes[0].value, 'news');
  });

  it('<div class=news> unquoted attr value', function () {
    let tree = parseHTML('<div class=news>');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes[0].name, 'class');
    assert.strictEqual(elem.attributes[0].value, 'news');
  });

  it('<div class=news/> unquoted attr value, self-closing', function () {
    let tree = parseHTML('<div class=news/>');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes[0].name, 'class');
    assert.strictEqual(elem.attributes[0].value, 'news');
  });

  it('<div class="news" visible /> after quoted attr, ignored', function () {
    let tree = parseHTML('<div class="news" visible />');
    let elem = tree.children[0];
    assert.strictEqual(elem.tagName, 'div');
    assert.strictEqual(elem.attributes.length, 1);
    assert.strictEqual(elem.attributes[0].name, 'class');
    assert.strictEqual(elem.attributes[0].value, 'news');
  });

  it('<div data=>, <div data> - unclosed tags', function () {
    let tree = parseHTML('<div data=>');
    assert.strictEqual(tree.children.length, 0);

    tree = parseHTML('<div data>');
    assert.strictEqual(tree.children.length, 0);
  });

  it('<t1> ignore non-letter in tag name', function () {
    let tree = parseHTML('<t1>');
    assert.strictEqual(tree.children[0].tagName, 't');
  });

  it('<1> illegal openTag, see as text', function () {
    let tree = parseHTML('<1>');
    assert.strictEqual(tree.children.length, 1);
    let elem = tree.children[0];
    assert.strictEqual(elem.type, 'text');
    assert.strictEqual(elem.content, '1>');
  });

  it('<div class="news"id="1"> - non-space or end after quoted attr value, 12.2.5.39: reconsume', function () {
    let tree = parseHTML('<div class="news"id="1">');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].attributes.length, 2);
  });

  it('<div class="news"[EOF] - unexpected EOF after quoted attr value', function () {
    let tree = parseHTML('<div class="news"');
    assert.strictEqual(tree.children.length, 0);
  });

  it('<div /[EOF] - unexpected EOF on self-closing tag', function () {
    let tree = parseHTML('<div //');
    assert.strictEqual(tree.children.length, 0);
  });

  it('<p></> illegal endTag', function () {
    let tree = parseHTML('<p></>');
    assert.strictEqual(tree.children[0].tagName, 'p');
  });
  it('<p></ illegal endTag', function () {
    let tree = parseHTML('<p><//');
    assert.strictEqual(tree.children[0].tagName, 'p');
  });

  it('emit error: no match', function () {
    try {
      let tree = parseHTML('<div></vid>');
    } catch (error) {
      assert.ok(error.message && error.message.startsWith('End tag do not match'));
    }
  });
});
