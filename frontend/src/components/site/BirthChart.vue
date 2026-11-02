<script setup lang="ts">
import { computed } from 'vue';

// A decorative Birth chart: the zodiac band turns one way, the planets and
// their aspect lines the other, slowly. `seed` shifts the planets so two
// charts side by side differ.

const props = withDefaults(
  defineProps<{ seed?: number; reverse?: boolean; labels?: boolean }>(),
  { seed: 0, reverse: false, labels: true },
);

const C = 200;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

// Text presentation selector keeps the glyphs from rendering as emoji.
const signs = [
  ['♈', 'حمل'],
  ['♉', 'ثور'],
  ['♊', 'جوزا'],
  ['♋', 'سرطان'],
  ['♌', 'اسد'],
  ['♍', 'سنبله'],
  ['♎', 'میزان'],
  ['♏', 'عقرب'],
  ['♐', 'قوس'],
  ['♑', 'جدی'],
  ['♒', 'دلو'],
  ['♓', 'حوت'],
].map(([glyph, name], i) => ({
  glyph: `${glyph}︎`,
  name,
  at: polar(175, i * 30 + 15),
  nameAt: polar(150, i * 30 + 15),
  rotate: i * 30 + 15,
  tick: [polar(160, i * 30), polar(190, i * 30)],
}));

const houses = Array.from({ length: 12 }, (_, i) => [
  polar(62, i * 30 + 12),
  polar(136, i * 30 + 12),
]);

const planetDefs = [
  { name: 'sun', deg: 20, r: 112, size: 9, fill: 'url(#fn-p-sun)' },
  { name: 'moon', deg: 95, r: 96, size: 6.5, fill: 'url(#fn-p-moon)' },
  { name: 'mercury', deg: 48, r: 84, size: 4.5, fill: 'url(#fn-p-mercury)' },
  { name: 'venus', deg: 300, r: 104, size: 6, fill: 'url(#fn-p-venus)' },
  { name: 'mars', deg: 215, r: 88, size: 5.5, fill: 'url(#fn-p-mars)' },
  { name: 'jupiter', deg: 160, r: 116, size: 8.5, fill: 'url(#fn-p-jupiter)' },
  {
    name: 'saturn',
    deg: 255,
    r: 120,
    size: 7,
    fill: 'url(#fn-p-saturn)',
    ring: true,
  },
];

const planets = computed(() =>
  planetDefs.map((p, i) => {
    const angle = p.deg + props.seed * (37 + i * 23);
    return { ...p, angle, ...polar(p.r, angle) };
  }),
);

// Lines between planets roughly 60/90/120/180 degrees apart.
const aspects = computed(() => {
  const list = planets.value;
  const lines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    gold: boolean;
  }[] = [];
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!;
      const b = list[j]!;
      const d = Math.abs(a.angle - b.angle) % 360;
      const sep = Math.min(d, 360 - d);
      const hit = [60, 90, 120, 180].find((x) => Math.abs(sep - x) < 14);
      if (hit)
        lines.push({
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          gold: hit === 120 || hit === 60,
        });
    }
  return lines;
});
</script>

<template>
  <svg
    viewBox="0 0 400 400"
    class="fn-chart"
    :class="{ 'is-reverse': reverse }"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="fn-p-sun" cx=".35" cy=".35">
        <stop offset="0" stop-color="#fff4c9" />
        <stop offset=".5" stop-color="#f5c451" />
        <stop offset="1" stop-color="#d98a1f" />
      </radialGradient>
      <radialGradient id="fn-p-moon" cx=".35" cy=".35">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#a9a2bd" />
      </radialGradient>
      <radialGradient id="fn-p-mercury" cx=".35" cy=".35">
        <stop offset="0" stop-color="#e3f6f5" />
        <stop offset="1" stop-color="#6fb7b3" />
      </radialGradient>
      <radialGradient id="fn-p-venus" cx=".35" cy=".35">
        <stop offset="0" stop-color="#ffe3ec" />
        <stop offset="1" stop-color="#d07a9a" />
      </radialGradient>
      <radialGradient id="fn-p-mars" cx=".35" cy=".35">
        <stop offset="0" stop-color="#ffc7a8" />
        <stop offset="1" stop-color="#c2462b" />
      </radialGradient>
      <radialGradient id="fn-p-jupiter" cx=".35" cy=".35">
        <stop offset="0" stop-color="#fbe6c4" />
        <stop offset=".6" stop-color="#d9a066" />
        <stop offset="1" stop-color="#9c6239" />
      </radialGradient>
      <radialGradient id="fn-p-saturn" cx=".35" cy=".35">
        <stop offset="0" stop-color="#f6ecc8" />
        <stop offset="1" stop-color="#b59a5b" />
      </radialGradient>
      <radialGradient id="fn-chart-core">
        <stop offset="0" stop-color="#3a2252" stop-opacity=".9" />
        <stop offset="1" stop-color="#120922" stop-opacity="0" />
      </radialGradient>
    </defs>

    <circle :cx="C" :cy="C" r="196" fill="url(#fn-chart-core)" />

    <!-- zodiac band -->
    <g class="fn-chart-band">
      <circle
        :cx="C"
        :cy="C"
        r="190"
        fill="none"
        stroke="#e9c46a"
        stroke-opacity=".55"
      />
      <circle
        :cx="C"
        :cy="C"
        r="160"
        fill="none"
        stroke="#e9c46a"
        stroke-opacity=".35"
      />
      <line
        v-for="(s, i) in signs"
        :key="'t' + i"
        :x1="s.tick[0]!.x"
        :y1="s.tick[0]!.y"
        :x2="s.tick[1]!.x"
        :y2="s.tick[1]!.y"
        stroke="#e9c46a"
        stroke-opacity=".35"
      />
      <text
        v-for="(s, i) in signs"
        :key="'g' + i"
        :x="s.at.x"
        :y="s.at.y"
        :transform="`rotate(${s.rotate} ${s.at.x} ${s.at.y})`"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#e9c46a"
        font-size="15"
      >
        {{ s.glyph }}
      </text>
      <template v-if="labels">
        <text
          v-for="(s, i) in signs"
          :key="'n' + i"
          :x="s.nameAt.x"
          :y="s.nameAt.y"
          :transform="`rotate(${s.rotate} ${s.nameAt.x} ${s.nameAt.y})`"
          text-anchor="middle"
          dominant-baseline="central"
          fill="#f3e8ff"
          fill-opacity=".45"
          font-size="8"
        >
          {{ s.name }}
        </text>
      </template>
    </g>

    <!-- houses -->
    <circle
      :cx="C"
      :cy="C"
      r="136"
      fill="none"
      stroke="#f3e8ff"
      stroke-opacity=".12"
    />
    <circle
      :cx="C"
      :cy="C"
      r="62"
      fill="none"
      stroke="#f3e8ff"
      stroke-opacity=".18"
    />
    <line
      v-for="(h, i) in houses"
      :key="'h' + i"
      :x1="h[0]!.x"
      :y1="h[0]!.y"
      :x2="h[1]!.x"
      :y2="h[1]!.y"
      stroke="#f3e8ff"
      stroke-opacity=".1"
      stroke-dasharray="2 4"
    />

    <!-- planets and aspects turn together so the lines stay attached -->
    <g class="fn-chart-planets">
      <line
        v-for="(a, i) in aspects"
        :key="'a' + i"
        v-bind="a"
        :stroke="a.gold ? '#e9c46a' : '#b5838d'"
        stroke-opacity=".5"
        stroke-width=".8"
        stroke-dasharray="3 3"
      />
      <g
        v-for="p in planets"
        :key="p.name"
        class="fn-planet"
        :style="{ transformOrigin: `${p.x}px ${p.y}px` }"
      >
        <circle
          :cx="p.x"
          :cy="p.y"
          :r="p.size * 2.2"
          :fill="p.fill"
          opacity=".18"
        />
        <ellipse
          v-if="p.ring"
          :cx="p.x"
          :cy="p.y"
          :rx="p.size * 2"
          :ry="p.size * 0.6"
          fill="none"
          stroke="#e9d8a6"
          stroke-width="1.2"
          :transform="`rotate(-20 ${p.x} ${p.y})`"
        />
        <circle :cx="p.x" :cy="p.y" :r="p.size" :fill="p.fill" />
      </g>
    </g>

    <circle :cx="C" :cy="C" r="3" fill="#e9c46a" />
  </svg>
</template>

<style scoped>
.fn-chart-band {
  transform-origin: 200px 200px;
  animation: fn-spin 240s linear infinite;
}
.fn-chart-planets {
  transform-origin: 200px 200px;
  animation: fn-spin 160s linear infinite reverse;
}
.is-reverse .fn-chart-band {
  animation-direction: reverse;
}
.is-reverse .fn-chart-planets {
  animation-direction: normal;
}
.fn-planet {
  animation: fn-pulse-glow 5s ease-in-out infinite;
}
.fn-planet:nth-child(2n) {
  animation-delay: -2s;
}
.fn-planet:nth-child(3n) {
  animation-delay: -3.5s;
}
</style>
