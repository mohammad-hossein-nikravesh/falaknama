<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ArrowRight, Clock } from '@lucide/vue';
import PageHero from '@/components/site/PageHero.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import { ApiError } from '@/lib/api';
import { content, type Article } from '@/lib/content';
import { faNumber, toJalali } from '@/lib/site';

const route = useRoute();
const article = ref<Article>();
const state = ref<'loading' | 'ready' | 'missing' | 'error'>('loading');

usePageMeta(
  () => article.value?.title,
  () => article.value?.summary,
);

async function load() {
  const slug = route.params.slug as string;
  state.value = 'loading';
  try {
    article.value = await content.article(slug);
    state.value = 'ready';
  } catch (e) {
    state.value =
      e instanceof ApiError && e.status === 404 ? 'missing' : 'error';
  }
}
watch(() => route.params.slug as string, load, { immediate: true });
</script>

<template>
  <PageHero
    v-if="state === 'ready' && article"
    eyebrow="مقاله"
    :title="article.title"
    :subtitle="article.summary"
  >
    <p
      class="mt-6 flex items-center justify-center gap-3 text-sm text-[#f3e8ff]/70"
    >
      <time :datetime="article.publishedAt">{{
        toJalali(article.publishedAt)
      }}</time>
      <span aria-hidden="true">·</span>
      <span class="inline-flex items-center gap-1"
        ><Clock class="size-4" /> {{ faNumber(article.readingMinutes) }} دقیقه
        مطالعه</span
      >
    </p>
  </PageHero>
  <PageHero
    v-else
    :title="
      state === 'missing'
        ? 'این مقاله پیدا نشد'
        : state === 'error'
          ? 'مقاله بارگذاری نشد'
          : '…'
    "
  />

  <div class="fn-light bg-[#f3e8ff]">
    <article
      v-if="state === 'ready' && article"
      class="mx-auto max-w-3xl px-4 pb-24 sm:px-6"
    >
      <img
        v-if="article.coverImage"
        :src="article.coverImage"
        :alt="article.title"
        class="-mt-6 mb-10 aspect-[16/9] w-full rounded-3xl object-cover shadow-[0_30px_60px_-30px_#3a2252]"
      />
      <!-- Admin-authored HTML, sanitised by the backend on save. -->
      <div class="fn-prose" v-html="article.body" />
      <RouterLink to="/articles" class="fn-btn fn-btn-ghost mt-14 text-sm">
        <ArrowRight class="size-4" /> بازگشت به مقاله‌ها
      </RouterLink>
    </article>
    <div v-else-if="state !== 'loading'" class="pb-24 text-center">
      <RouterLink to="/articles" class="fn-btn fn-btn-ink"
        >دیدن همهٔ مقاله‌ها</RouterLink
      >
    </div>
    <div v-else class="mx-auto max-w-3xl px-4 pb-24">
      <div class="fn-card h-96 animate-pulse" />
    </div>
  </div>
</template>
