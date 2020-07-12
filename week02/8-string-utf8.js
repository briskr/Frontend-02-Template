/*
  https://unicodebook.readthedocs.io/unicode_encodings.html

  https://www.fileformat.info/info/unicode/utf8.htm

  https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/
 */

/**
 * Format number as hex
 * @param {number} n integer number
 */
function intToHex(n) {
  const hexLength = n > 0xff ? 4 : 2;
  return "0x" + n.toString(16).padStart(hexLength, "0");
}

/**
 * encode one integer char code to UTF-8 bytes
 * @param {number} ch integer char code
 * @returns result as Uint8Array
 */
function buildUtf8BytesForChar(ch) {
  // 各字节长度可支持的代码上限
  const MAX_CODE_FOR_1B = 0x7f;
  const MAX_CODE_FOR_2B = 0x7ff;
  const MAX_CODE_FOR_3B = 0xffff;
  const MAX_CODE_FOR_4B = 0x10ffff;

  const BITS_PER_BYTE = 8;
  const MASK_FULL_BYTE = 0b11111111;

  /** 后续字节保留的数值 bit 数量 */
  const FOLLOWING_BYTES_FREE_BITS_NO = 6;
  /** 用于提取后续字节数值的 mask ，末尾 6 个 bit 的值为 1 */
  const MASK_FOLLOWING_BYTES =
    MASK_FULL_BYTE >>> (BITS_PER_BYTE - FOLLOWING_BYTES_FREE_BITS_NO);
  /** 后续字节的前缀 */
  const PREFIX_FOLLOWING_BYTES = 0b10000000;

  let length;
  if (ch > MAX_CODE_FOR_4B) {
    // not supported
    return null;
  } else if (ch > MAX_CODE_FOR_3B) {
    length = 4;
  } else if (ch > MAX_CODE_FOR_2B) {
    length = 3;
  } else if (ch > MAX_CODE_FOR_1B) {
    length = 2;
  } else {
    // ch <= 0x7f
    length = 1;
  }

  const bytes = new Uint8Array(length);

  if (length === 1) {
    bytes[0] = ch;
  } else {
    /** 首字节前缀，前 length 个 bit 值 为 1 */
    const PREFIX_LEADING_BYTES =
      (MASK_FULL_BYTE << (BITS_PER_BYTE - length)) & MASK_FULL_BYTE;
    const MASK_LEADING_BYTES = MASK_FULL_BYTE >>> (BITS_PER_BYTE - length - 1);

    let mask = MASK_FOLLOWING_BYTES;
    let prefix = PREFIX_FOLLOWING_BYTES;
    let resultIndex = length - 1;
    do {
      if (resultIndex === 0) {
        mask = MASK_LEADING_BYTES;
        prefix = PREFIX_LEADING_BYTES;
      }

      let part = (ch & mask) | prefix;
      //console.debug(ch.toString(2), part.toString(2));
      bytes[resultIndex] = part;

      ch = ch >>> FOLLOWING_BYTES_FREE_BITS_NO;
      resultIndex--;
    } while (resultIndex >= 0);
  }

  return bytes;
}

/**
 * High Surrogate: \ud800 ~ \udbff
 * Low Surrogate: \udc00 ~ \udfff
 * @param {number} ch integer char code
 */
function isHighSurrogate(ch) {
  return ch >= 0xd800 && ch <= 0xdbff;
}
function isLowSurrogate(ch) {
  return ch >= 0xdc00 && ch <= 0xdfff;
}

/**
 * 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行编码。
 * @param {string} s
 * @returns {array}
 */
function UTF8_Encoding(s) {
  const resultBytes = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    // 存在扩展字符时， string.length 不等于字符数
    // TODO 解析 surrogate pair 的码点值
    if (isHighSurrogate(ch) || isLowSurrogate(ch)) {
      continue;
    }

    const charBytes = buildUtf8BytesForChar(ch);
    if (!charBytes) continue;
    charBytes.forEach((b) => resultBytes.push(b));
  }
  return resultBytes;
}

const text = "𬜬蔄man4";
//[0xd871, 0xdf2c, 0x8504, 0x6d, 0x61, 0x6e, 0x34]

console.log("UTF-8 encoded:");
const utf8Bytes = UTF8_Encoding(text);
console.log("[" + utf8Bytes.map(intToHex).join(", ") + "]");
// 示例中第一个汉字属于 Non-BMP，在 string 里占 2 个字符长度，需要解码 Surrogate Pair，暂时跳过
// Expected: [0xe8, 0x94, 0x84, 0x6d, 0x61, 0x6e, 0x34]
