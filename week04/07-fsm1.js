//abcabx
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
  if (c === 'c') return foundC;
  else return start(c);
}

function foundC(c) {
  if (c === 'a') return found2ndA;
  else return start(c);
}

function found2ndA(c) {
  if (c === 'b') return found2ndB;
  else return start(c);
}

function found2ndB(c) {
  if (c === 'x') return end;
  else return foundB(c); // 注意这里不是退回 start
  // 因为至此已匹配内容末尾包含 ab，有可能作为第一个 b 进入 'ab(c)' 模式，因此退回到 foundB
  // 减少了多余的回退
}

console.log(match('match abcabx'));
console.log(match('abcabcabx'));
