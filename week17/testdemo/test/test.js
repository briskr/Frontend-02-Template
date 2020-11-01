var assert = require('assert');
var add = require('../add.js').add;
var minus = require('../add.js').minus;

describe('test function add()', function () {
  it('add (2, 1) should return 3', function () {
    assert.strictEqual(add(2, 1), 3);
  });

  it('add (-3, 1) should return -2', function () {
    assert.strictEqual(add(-3, 1), -2);
  });

  it('minus (2, 1) should return 1', function () {
    assert.strictEqual(minus(2, 1), 1);
  });
});
