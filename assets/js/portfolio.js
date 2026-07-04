/* ════════════════════════════════════════
   PRELOADER
════════════════════════════════════════ */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('out'), 1800);
});

/* ════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════ */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function movRing() {
    rx += (mx - rx) * .14; ry += (my - ry) * .14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(movRing);
})();

document.querySelectorAll('a,button,.tilt,.con-link,.tool-chip,.tbtn,.fbtn').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
});

/* ════════════════════════════════════════
   SCROLL HELPERS
════════════════════════════════════════ */
const prog = document.getElementById('prog');
const hdr = document.getElementById('hdr');
const btt = document.getElementById('btt');
const secs = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-list a');

window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    prog.style.width = pct + '%';
    hdr.classList.toggle('stuck', window.scrollY > 60);
    btt.classList.toggle('show', window.scrollY > 500);

    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
    navA.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
});

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
const burger = document.getElementById('burger');
const mob = document.getElementById('mob');
burger.addEventListener('click', () => {
    burger.classList.toggle('x');
    mob.classList.toggle('on');
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('x'); mob.classList.remove('on');
}));

/* ════════════════════════════════════════
   CANVAS PARTICLES
════════════════════════════════════════ */
const cv = document.getElementById('canvas');
const ctx = cv.getContext('2d');
let pts = [];

function rsz() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
rsz(); window.addEventListener('resize', rsz);

class P {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * cv.width;
        this.y = Math.random() * cv.height;
        this.vx = (Math.random() - .5) * .45;
        this.vy = (Math.random() - .5) * .45;
        this.r = Math.random() * 1.4 + .4;
        this.a = Math.random() * .38 + .1;
    }
    step() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > cv.width) this.vx *= -1;
        if (this.y < 0 || this.y > cv.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,165,0,${this.a})`;
        ctx.fill();
    }
}

for (let i = 0; i < 75; i++) pts.push(new P());

(function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    // connections
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 125) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(61,142,245,${.13 * (1 - d / 125)})`;
                ctx.lineWidth = .5;
                ctx.stroke();
            }
        }
    }
    pts.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
})();

/* ════════════════════════════════════════
   TYPING ANIMATION
════════════════════════════════════════ */
const typed = document.getElementById('typed');
const words = ['React.js Apps', 'Next.js Platforms', 'Enterprise UIs', 'High-Traffic Web'];
let wi = 0, ci = 0, del = false;
function type() {
    const w = words[wi];
    typed.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
    del ? ci-- : ci++;
    let d = del ? 42 : 92;
    if (!del && ci === w.length) { d = 2200; del = true; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 380; }
    setTimeout(type, d);
}
setTimeout(type, 2300);

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ════════════════════════════════════════
   ANIMATED COUNTERS
════════════════════════════════════════ */
function animCnt(el) {
    const t = +el.dataset.t, step = t / 40;
    let n = 0;
    const iv = setInterval(() => {
        n += step; el.textContent = Math.min(Math.floor(n), t);
        if (n >= t) clearInterval(iv);
    }, 32);
}
const co = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCnt(e.target); co.unobserve(e.target); } });
}, { threshold: .5 });
document.querySelectorAll('.cnt').forEach(el => co.observe(el));

/* ════════════════════════════════════════
   SKILL BARS
════════════════════════════════════════ */
function fireBars(pane) {
    pane.querySelectorAll('.sk-item').forEach(it => {
        const fill = it.querySelector('.bar-fill');
        setTimeout(() => { fill.style.width = it.dataset.lv + '%'; }, 80);
    });
}

const skillsEl = document.getElementById('skills');
const so = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { fireBars(document.querySelector('.tpane.on')); so.disconnect(); } });
}, { threshold: .15 });
if (skillsEl) so.observe(skillsEl);

/* ════════════════════════════════════════
   SKILL TABS
════════════════════════════════════════ */
document.querySelectorAll('.tbtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('on'));
        document.querySelectorAll('.tpane').forEach(p => p.classList.remove('on'));
        btn.classList.add('on');
        const pane = document.getElementById('p' + btn.dataset.tab);
        pane.classList.add('on');
        // reset & fire bars
        pane.querySelectorAll('.bar-fill').forEach(f => f.style.width = '0%');
        setTimeout(() => fireBars(pane), 60);
    });
});

/* ════════════════════════════════════════
   PROJECT FILTER
════════════════════════════════════════ */
document.querySelectorAll('.fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.dataset.f;
        document.querySelectorAll('.pcard').forEach(c => {
            c.classList.toggle('hide', f !== 'all' && !c.dataset.tags.includes(f));
        });
    });
});

/* ════════════════════════════════════════
   3D CARD TILT
════════════════════════════════════════ */
document.querySelectorAll('.tilt').forEach(c => {
    c.addEventListener('mouseenter', () => { c.style.transition = 'box-shadow .3s, border-color .3s'; });
    c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * 16;
        const y = ((e.clientY - r.top) / r.height - .5) * -16;
        c.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)`;
    });
    c.addEventListener('mouseleave', () => {
        c.style.transition = 'transform .5s var(--ease), box-shadow .3s, border-color .3s';
        c.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)';
    });
});

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
document.getElementById('cform').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('form-btn');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const res = await fetch('https://www.devopsdelhi.in/api/portfolio-contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();

        if (res.ok && result.success) {
            form.style.display = 'none';
            document.getElementById('fok').style.display = 'block';
        } else {
            alert(Object.values(result.errors || {}).flat().join('\n') || 'Something went wrong.');
        }
    } catch (err) {
        alert('Network error. Please try again later.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message →';
    }
});

/* ════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════ */
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));