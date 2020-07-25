function findAB(text) {
  let hasFirst;
  for (const c of text) {
    if (c === 'a') {
      hasFirst = true;
      continue;
    } else if (c === 'b' && hasFirst) {
      return true;
    }
  }
  return false;
}
console.log(findAB('lazy dog'));
console.log(findAB('bio lab'));
