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

const start = (point) => {
  console.log('start', point.clientX, point.clientY);
};
const move = (point) => {
  console.log('move', point.clientX, point.clientY);
};
const end = (point) => {
  console.log('end', point.clientX, point.clientY);
};
const cancel = (point) => {
  console.log('cancel', point.clientX, point.clientY);
};
