import type { Directive } from 'vue';

const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | undefined;

/** v-reveal: fades the element up the first time it scrolls into view. `v-reveal="0.1"` delays it by 0.1s. */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    el.classList.add('fn-reveal');
    if (value) el.style.setProperty('--d', `${value}s`);
    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer!.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

/** v-tilt: tilts a card toward the pointer and feeds --mx/--my to .fn-glow. Mouse only. */
export const vTilt: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value = 7 }) {
    if (reducedMotion() || !matchMedia('(pointer: fine)').matches) return;
    el.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)';
    el.style.transformStyle = 'preserve-3d';
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * value}deg) rotateY(${(x - 0.5) * value}deg) translateZ(0)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  },
};

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof vReveal;
    vTilt: typeof vTilt;
  }
}
