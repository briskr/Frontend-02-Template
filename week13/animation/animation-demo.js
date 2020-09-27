import { Timeline, Animation } from './animation.js';

const tl = new Timeline();
tl.start();

/*
const a1 = new Animation({ set a(v) { console.log(v) } }, 'a', 0, 100, 1000, 500, null);
tl.add(a1)
 */

const pauseBtn = document.getElementById('pause-btn');
pauseBtn.addEventListener('click', () => tl.pause());
const resumeBtn = document.getElementById('resume-btn');
resumeBtn.addEventListener('click', () => tl.resume());

const elem = document.getElementById('anim1');
const a1 = new Animation(elem.style, 'transform', 0, 500, 3000, 500, null, (v) => `translateX(${v}px)`);
tl.add(a1);
