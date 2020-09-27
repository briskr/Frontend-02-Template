import { Timeline, Animation } from './animation.js';
import { ease, easeIn, easeOut, easeInOut } from './timing.js';

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

const el1 = document.getElementById('anim1');
const a1 = new Animation(el1.style, 'transform', 0, 500, 3000, 0, easeInOut, (v) => `translateX(${v}px)`);
tl.add(a1);

const el2 = document.getElementById('anim2');
//el2.style.transition = 'all 3s ease';
el2.style.transition = 'all 3s ease-in-out';
el2.style.transform = 'translateX(500px)';
