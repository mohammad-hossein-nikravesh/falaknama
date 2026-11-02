<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Night sky: stars twinkle slowly, brighten while the page scrolls, drift with
// the scroll at three depths, and now and then a comet crosses. Draws one
// still frame when the visitor prefers reduced motion.

const canvas = ref<HTMLCanvasElement>();

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  depth: number;
  gold: boolean;
}
interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
}

let stars: Star[] = [];
let comets: Comet[] = [];
let width = 0;
let height = 0;
let frame = 0;
let visible = true;
let energy = 0; // scroll-driven extra twinkle, decays every frame
let lastScroll = 0;
let nextComet = 0;
const cleanups: (() => void)[] = [];

function seed() {
  const count = Math.round((width * height) / 2400);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() < 0.08 ? 1.6 + Math.random() : 0.4 + Math.random() * 0.9,
    base: 0.25 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 1.2,
    depth: [0.05, 0.12, 0.22][Math.floor(Math.random() * 3)]!,
    gold: Math.random() < 0.12,
  }));
}

function draw(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, width, height);
  const scroll = window.scrollY;
  for (const s of stars) {
    const twinkle = Math.sin(t * 0.001 * s.speed + s.phase);
    const alpha = Math.min(1, s.base + twinkle * (0.25 + energy * 0.35));
    const y = (((s.y - scroll * s.depth) % height) + height) % height;
    ctx.globalAlpha = Math.max(0.05, alpha);
    ctx.fillStyle = s.gold ? '#f3dc9c' : '#f3e8ff';
    ctx.beginPath();
    ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.r > 1.5 && alpha > 0.7) {
      // a soft cross-shaped glint on the brightest stars
      ctx.globalAlpha = (alpha - 0.7) * 1.4;
      ctx.fillRect(s.x - s.r * 3, y - 0.3, s.r * 6, 0.6);
      ctx.fillRect(s.x - 0.3, y - s.r * 3, 0.6, s.r * 6);
    }
  }

  for (const c of comets) {
    const age = (t - c.born) / c.life;
    const x = c.x + c.vx * (t - c.born);
    const y = c.y + c.vy * (t - c.born);
    const fade = Math.sin(Math.PI * Math.min(1, age));
    const tail = ctx.createLinearGradient(x, y, x - c.vx * 260, y - c.vy * 260);
    tail.addColorStop(0, `rgba(243, 220, 156, ${0.95 * fade})`);
    tail.addColorStop(1, 'rgba(243, 220, 156, 0)');
    ctx.globalAlpha = 1;
    ctx.strokeStyle = tail;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - c.vx * 260, y - c.vy * 260);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 248, 225, ${fade})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function spawnComet(t: number) {
  // From the upper start (right, in RTL) toward the lower end.
  const speed = 0.55 + Math.random() * 0.35; // px per ms
  const angle = (150 + Math.random() * 20) * (Math.PI / 180);
  comets.push({
    x: width * (0.45 + Math.random() * 0.55),
    y: height * Math.random() * 0.35,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    born: t,
    life: 1400 + Math.random() * 600,
  });
  nextComet = t + 6000 + Math.random() * 7000;
}

onMounted(() => {
  const el = canvas.value!;
  const ctx = el.getContext('2d')!;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = el.clientWidth;
    height = el.clientHeight;
    el.width = width * dpr;
    el.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    if (still) draw(ctx, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  cleanups.push(() => ro.disconnect());
  resize();
  if (still) return;

  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
  });
  io.observe(el);
  cleanups.push(() => io.disconnect());

  const onScroll = () => {
    energy = Math.min(1, energy + Math.abs(window.scrollY - lastScroll) / 300);
    lastScroll = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));

  nextComet = performance.now() + 2500;
  const loop = (t: number) => {
    frame = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    energy *= 0.96;
    if (t > nextComet) spawnComet(t);
    comets = comets.filter((c) => t - c.born < c.life);
    draw(ctx, t);
  };
  frame = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  cleanups.forEach((fn) => fn());
});
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none size-full"
    aria-hidden="true"
  />
</template>
