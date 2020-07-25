// abababx
function match(text) {
  let state = start;
  for (const c of text) {
    console.debug('processing char: ' + c);
    state = state(c);
    console.debug('result state :', state.name);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') return foundA;
  else return start;
}

function end(c) {
  return end;
}

function foundA(c) {
  if (c === 'b') return foundB;
  else return start(c);
}

function foundB(c) {
  if (c === 'a') return found2ndA;
  else return start(c);
}

function found2ndA(c) {
  if (c === 'b') return found2ndB;
  else return start(c);
}

function found2ndB(c) {
  if (c === 'a') return found3rdA;
  else return foundB(c);
}

function found3rdA(c) {
  if (c === 'b') return found3rdB;
  else return start(c);
}

function found3rdB(c) {
  if (c === 'x') return end;
  else return found2ndB(c);
}

console.log(match('abababx'));
console.log(match('abxababx'));
