function findA(text) {
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === 'a') {
      return true;
    }
  }
  return false;
}
console.log(findA('lazy dog'));
