<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Clock } from '@lucide/vue';
import type { ArticleSummary } from '@/lib/content';
import { faNumber, toJalali } from '@/lib/site';
import BrandMark from './BrandMark.vue';

defineProps<{ article: ArticleSummary }>();
</script>

<template>
  <RouterLink
    v-tilt="5"
    :to="`/articles/${article.slug}`"
    class="fn-card fn-glow group flex h-full flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-[#3a2252]"
  >
    <div
      class="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#24143d] via-[#3a2252] to-[#b5838d]"
    >
      <img
        v-if="article.coverImage"
        :src="article.coverImage"
        alt=""
        class="size-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <BrandMark v-else class="absolute inset-0 m-auto size-20 opacity-80" />
    </div>
    <div class="flex flex-1 flex-col gap-3 p-6">
      <h3 class="text-lg leading-8 font-extrabold text-[#120922]">
        {{ article.title }}
      </h3>
      <p class="line-clamp-3 text-sm leading-7 text-[#4a3a5e]">
        {{ article.summary }}
      </p>
      <div class="mt-auto flex items-center gap-3 pt-2 text-xs text-[#4a3a5e]">
        <time :datetime="article.publishedAt">{{
          toJalali(article.publishedAt)
        }}</time>
        <span aria-hidden="true">·</span>
        <span class="inline-flex items-center gap-1"
          ><Clock class="size-3.5" />
          {{ faNumber(article.readingMinutes) }} دقیقه مطالعه</span
        >
      </div>
    </div>
  </RouterLink>
</template>
