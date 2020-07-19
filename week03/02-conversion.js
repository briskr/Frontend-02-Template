/*
  数字字面量格式

  十进制
  1234567890
  -42.3

  二进制
  var FLT_SIGNBIT  = 0b10000000000000000000000000000000; // 2147483648
  var FLT_EXPONENT = 0b01111111100000000000000000000000; // 2139095040
  var FLT_MANTISSA = 0B00000000011111111111111111111111; // 8388607

  ES6 八进制
  var a = 0o10;

  十六进制
  0xFFFFFFFFFFFFFFFFF // 295147905179352830000
  0x123456789ABCDEF   // 81985529216486900 (BigInt: 81985529216486895)
  0XA                 // 10

  指数
  1E3   // 1000
  2e6   // 2000000
  0.1e2 // 10
  -1e-2 // -0.01

*/

/**
 * 把由连续数字组成的字符串解析成整数，可指定采用的进制 radix。如果包含超出进制范围内的字符则报错。
 * (内部辅助函数，非作业入口)
 * @param {*} text
 * @param {*} radix 支持 2, 8, 10, 16. 默认值 10
 */
function tryParseInteger(text, radix) {
  let number = 0;
  if (text === '') return number;
  if (radix == null) radix = 10;
  if (radix !== 2 && radix !== 8 && radix !== 10 && radix !== 16)
    throw `Radix value ${radix} not supported.`;

  const chars = text.split('');
  for (let i = 0; i < chars.length; i++) {
    let digit;
    const charCode = chars[i].toLowerCase().codePointAt(0);
    if (
      radix <= 10 &&
      (charCode - '0'.codePointAt(0) >= radix || charCode < '0'.codePointAt(0))
    ) {
      throw `Invalid digit ${chars[i]} for radix ${radix}.`;
    }

    if (
      radix < 16 ||
      (radix === 16 &&
        charCode >= '0'.codePointAt(0) &&
        charCode <= '9'.codePointAt(0))
    ) {
      digit = charCode - '0'.codePointAt(0);
    } else if (
      radix === 16 &&
      charCode >= 'a'.codePointAt(0) &&
      charCode <= 'f'.codePointAt(0)
    ) {
      digit = charCode - 'a'.codePointAt(0) + 10; // hex value of 'a'
    } else if (radix === 16) {
      throw `Invalid digit ${chars[i]} for radix ${radix}.`;
    }
    number = number * radix + digit;
  }
  return number;
}

/**
 * 作业内容1：解析符合 JS Number 类型字面量格式定义的各类数字字符串，返回对应的 Number 值
 * @param {*} text
 */
function stringToNumber(text) {
  let sign = '';
  let mainInt = '';
  let mainDec = '';
  let expSign = '';
  let expInt = '';
  let radix = 10;

  const NON_DECIMAL_INT_PREFIX = /^([+-]?)0([bBoOxX])/;
  const DECIMAL_PATTERN = /^([+-]?)((\d+)?[\.]?(\d+)?)([eE]([+-]?)(\d+))?/;

  const nonDecimalInfo = NON_DECIMAL_INT_PREFIX.exec(text);
  //console.debug(nonDecimalInfo);

  let result = 0;

  if (nonDecimalInfo !== null) {
    sign = nonDecimalInfo[1];
    if (nonDecimalInfo[2].toLowerCase() === 'b') {
      radix = 2;
    } else if (nonDecimalInfo[2].toLowerCase() === 'o') {
      radix = 8;
    } else if (nonDecimalInfo[2].toLowerCase() === 'x') {
      radix = 16;
    }
    mainInt = text.slice(nonDecimalInfo[0].length);

    result = tryParseInteger(mainInt, radix);
    if (sign === '-') {
      result = 0 - result;
    }
  } else {
    // try pase decimal
    const decimalInfo = DECIMAL_PATTERN.exec(text);
    //console.debug(decimalInfo);
    sign = decimalInfo[1];
    mainInt = decimalInfo[3] ? decimalInfo[3] : '';
    mainDec = decimalInfo[4] ? decimalInfo[4] : '';
    //expPart = decimalInfo[5];
    expSign = decimalInfo[6] ? decimalInfo[6] : '';
    expInt = decimalInfo[7] ? decimalInfo[7] : '';

    // get value of parts and calc the whole number
    const mainIntValue = tryParseInteger(mainInt);
    const mainDecValue = tryParseInteger(mainDec);
    const expIntValue = tryParseInteger(expInt);

    result = mainIntValue;
    if (mainDecValue > 0) {
      const actualDecValue = mainDecValue / 10 ** mainDec.length;
      result += actualDecValue;
    }
    if (expIntValue > 0) {
      if (expSign === '-') {
        result = result / 10 ** expIntValue;
      } else {
        result = result * 10 ** expIntValue;
      }
    }

    if (sign === '-') {
      result = 0 - result;
    }
  }
  /* 
  console.debug('-- parsed info for: "' + text + '"');
  console.debug(
    `sign: ${sign}, main: ${mainInt}.${mainDec}, exp: ${expSign}${expInt}, radix: ${radix}`
  );
 */
  return result;
}

/**
 * 作业2: 把传入的 Number 值，根据指定的进制，转换成对应的数值字符串
 * @param {*} n 传入的数值
 * @param {*} radix 支持 2, 8, 10, 16, 默认为 10
 */
function numberToString(n, radix) {
  if (radix === undefined) radix = 10;
  if (![2, 8, 10, 16].includes(radix)) {
    throw `Radix value ${radix} is not supported.`;
  }

  let isNegative = false;
  if (n < 0) {
    n = 0 - n;
    isNegative = true;
  }

  // 是否处理小数部分
  let decimalPartValue;
  if (radix === 10) {
    decimalPartValue = n - Math.floor(n);
    n = Math.floor(n);
  }

  const getDigit = function (digitValue) {
    let digit;
    if (radix === 16 && digitValue > 9) {
      digit = String.fromCharCode(digitValue - 10 + 'A'.charCodeAt(0));
    } else {
      digit = String.fromCharCode(digitValue + '0'.charCodeAt(0));
    }
    return digit;
  };

  let result = '';
  let digitValue;
  do {
    digitValue = n % radix;
    const digit = getDigit(digitValue);
    result = digit + result;

    n = Math.floor(n / radix);
  } while (n >= radix);
  if (n > 0) {
    result = getDigit(n) + result;
  }

  // 处理 decimalPartValue
  if (decimalPartValue > Number.MIN_VALUE) {
    let decimalText = '';
    do {
      // 由于精度损失，decimalPartValue 变为近似值
      decimalPartValue = decimalPartValue * radix;
      let digitValue = Math.floor(decimalPartValue);
      decimalText += String.fromCharCode('0'.charCodeAt(0) + digitValue);
      // 改变当前数值，进入下次迭代
      decimalPartValue = decimalPartValue - digitValue;
    } while (decimalPartValue > Number.MIN_VALUE);
    if (decimalText.length > 0) {
      result += '.' + decimalText;
    }
  }

  if (radix === 2) {
    result = '0b' + result;
  } else if (radix === 8) {
    result = '0o' + result;
  } else if (radix === 16) {
    result = '0x' + result;
  }

  // 补符号
  if (isNegative) {
    result = '-' + result;
  }

  return result;
  /*
  // 等价于内置函数
  return new Number(n).toString(radix);
  */
}

const normalBin = ['0b1', '-0B101', '0b10000000000000000000000000000000'];
const normalBinValues = [1, -5, 2147483648];
const wrongBin = ['0b3', '0bd'];

const normalOct = ['0o201', '-0O10'];
const normalOctValues = [129, -8];
const wrongOct = ['0o8', '0od', '0O-3'];

const normalHex = ['0x01f', '-0x10', '0x123456789ABCDEF'];
const normalHexValues = [31, -16, 81985529216486895]; // 最后一个数溢出整型范围了
const wrongHex = ['0x-', '0xM'];

const normalDec = ['1.', '.1', '23', '-23.6', '2e6', '-3.13e13', '-2.3e-2'];
const normalDecValues = [1, 0.1, 23, -23.6, 2e6, -3.13e13, -2.3e-2];
const wrongDec = ['ab'];

const allNormalSamples = [
  ...normalBin,
  ...normalOct,
  ...normalHex,
  ...normalDec,
];
const allWrongSamples = [...wrongBin, ...wrongOct, ...wrongHex];

// samples = wrongBin;
// samples = wrongOct;
// samples = wrongHex;
// samples = wrongDec;

// samples = allNormalSamples;
// samples = allWrongSamples;

demoStringToNumber(normalBin, '二进制');
demoStringToNumber(normalOct, '二进制');
demoStringToNumber(normalHex, '十六进制');
demoStringToNumber(normalDec, '十进制');

function demoStringToNumber(samples, desc) {
  console.log(`-- stringToNumber -- (${desc})`);
  for (let i = 0; i < samples.length; i++) {
    try {
      const item = samples[i];
      const result = stringToNumber(item);
      console.log(result);
    } catch (e) {
      console.error(`"${item}" 格式不正确: ${e}`);
    }
  }
}

// numberToString
demoNumberToString(normalBinValues, 2);
demoNumberToString(normalOctValues, 8);
demoNumberToString(normalHexValues, 16);
demoNumberToString(normalDecValues, 10);

function demoNumberToString(samples, radix) {
  console.log(`-- numberToString -- (${radix} 进制)`);
  for (let i = 0; i < samples.length; i++) {
    const item = samples[i];
    const result = numberToString(item, radix);
    console.log(result);
  }
}
