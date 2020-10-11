const elem = document.documentElement;

elem.addEventListener('mousedown', (event) => {
  start(event);
  const mousemove = (event) => {
    move(event);
  };
  const mouseup = (event) => {
    end(event);
    elem.removeEventListener('mousemove', mousemove);
    elem.removeEventListener('mouseup', mouseup);
  };
  elem.addEventListener('mousemove', mousemove);
  elem.addEventListener('mouseup', mouseup);
});

elem.addEventListener('touchstart', (event) => {
  for (const touch of event.changedTouches) {
    start(touch);
  }
});

elem.addEventListener('touchmove', (event) => {
  for (const touch of event.changedTouches) {
    move(touch);
  }
});

elem.addEventListener('touchend', (event) => {
  for (const touch of event.changedTouches) {
    end(touch);
  }
});

elem.addEventListener('touchcancel', (event) => {
  for (const touch of event.changedTouches) {
    cancel(touch);
  }
});

let pressTimeoutHandle;
let startX, startY;
let isPan = false,
  isTap = true,
  isPress = false;

const start = (point) => {
  console.log('start', point.clientX, point.clientY);
  (startX = point.clientX), (startY = point.clientY);
  isTap = true;
  isPan = false;
  isPress = false;

  pressTimeoutHandle = setTimeout(() => {
    isTap = false;
    isPan = false;
    isPress = true;
    console.log('press');
    pressTimeoutHandle = null;
  }, 500);
};
const move = (point) => {
  let dx = point.clientX - startX,
    dy = point.clientY - startY;
  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isTap = false;
    isPan = true;
    isPress = false;
    console.log('panstart');
    clearTimeout(pressTimeoutHandle);
  }
  if (isPan) {
    console.log('panning', dx, dy);
    console.log('pan');
  }
  //console.log('move', point.clientX, point.clientY);
};
const end = (point) => {
  if (isTap) {
    console.log('tap');
    clearTimeout(pressTimeoutHandle);
  }
  if (isPan) {
    console.log('panend');
  }
  if (isPress) {
    console.log('pressend');
  }

  //console.log('end', point.clientX, point.clientY);
};
const cancel = (point) => {
  clearTimeout(pressTimeoutHandle);
  console.log('cancel', point.clientX, point.clientY);
};
