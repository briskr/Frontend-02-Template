var assert = require('assert');

import { parseHTML } from '../src/parser.js';

describe('test parseHTML', function () {
  it('<p>text</p>', function () {
    const tree = parseHTML('<p>text</p>');
    console.log(tree);
  });
});
