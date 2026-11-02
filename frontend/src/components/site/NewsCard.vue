<script setup lang="ts">
import { computed } from 'vue';
import { CalendarDays } from '@lucide/vue';
import type { NewsItem } from '@/lib/content';
import { jalaliRange } from '@/lib/site';

const props = defineProps<{ item: NewsItem }>();

const status = computed(() => {
  const now = Date.now();
  const start = new Date(props.item.startsAt).getTime();
  const end =
    new Date(props.item.endsAt ?? props.item.startsAt).getTime() + 86_400_000;
  if (now < start)
    return { label: 'پیش رو', cls: 'bg-[#24143d]/8 text-[#3a2252]' };
  if (now < end)
    return { label: 'در جریان', cls: 'bg-[#e9c46a]/30 text-[#6b4a10]' };
  return { label: 'گذشته', cls: 'bg-[#4a3a5e]/10 text-[#4a3a5e]' };
});
</script>

<template>
  <article
    v-tilt="4"
    class="fn-card fn-glow flex h-full flex-col overflow-hidden"
  >
    <img
      v-if="item.image"
      :src="item.image"
      alt=""
      class="h-40 w-full object-cover"
      loading="lazy"
    />
    <div class="flex flex-1 flex-col gap-3 p-6">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-medium text-[#3a2252]"
        >
          <CalendarDays class="size-3.5" />
          {{ jalaliRange(item.startsAt, item.endsAt) }}
        </span>
        <span
          class="rounded-full px-3 py-1 font-semibold"
          :class="status.cls"
          >{{ status.label }}</span
        >
      </div>
      <h3 class="text-lg leading-8 font-extrabold text-[#120922]">
        {{ item.title }}
      </h3>
      <p class="text-sm leading-7 whitespace-pre-line text-[#4a3a5e]">
        {{ item.body }}
      </p>
    </div>
  </article>
</template>
