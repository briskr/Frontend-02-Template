const vm = require('vm');
/* 
global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
 */

/** entries of 'global', as defined in ECMAScript */
const sharedGlobalPropertyNames = [
  // *** 18.1 Value Properties of the Global Object
  'Infinity',
  'NaN',
  'undefined',

  // *** 18.2 Function Properties of the Global Object

  // 'eval', // comes from safeEval instead
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',

  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',

  // *** 18.3 Constructor Properties of the Global Object

  'Array',
  'ArrayBuffer',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URIError',
  'WeakMap',
  'WeakSet',

  // *** 18.4 Other Properties of the Global Object

  'Atomics',
  'JSON',
  'Math',
  'Reflect',

  // *** Annex B

  'escape',
  'unescape',

  // *** ECMA-402

  'Intl',

  // *** ESNext

  // 'Realm' // Comes from createRealmGlobalObject()
];

const result = [];
for (const name of sharedGlobalPropertyNames) {
  debugger;
  if (global[name] === undefined) {
    result.push('undefined');
  } else {
    result.push(global[name].name);
  }
}
console.log(result);
