function findAtoF(text) {
  console.debug('trying: ' + text);
  let matchedLength = 0;
  for (const c of text) {
    if (c === 'a') {
      matchedLength++;
      continue;
    } else if (c === 'b' && matchedLength === 1) {
      matchedLength++;
      continue;
    } else if (c === 'c' && matchedLength === 2) {
      matchedLength++;
      continue;
    } else if (c === 'd' && matchedLength === 3) {
      matchedLength++;
      continue;
    } else if (c === 'e' && matchedLength === 4) {
      matchedLength++;
      continue;
    } else if (c === 'f' && matchedLength === 5) {
      matchedLength++;
      console.debug('success at length: ' + matchedLength);
      return true;
    } else {
      console.debug('failed at length: ' + matchedLength);
      matchedLength = 0;
    }
  }
  console.debug('failed at length: ' + matchedLength);
  return false;
}
console.log(findAtoF('abc'));
console.log(findAtoF('abacdef'));
console.log(findAtoF('deabcd'));
console.log(findAtoF('abcdefg'));
