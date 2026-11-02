<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import NewsCard from '@/components/site/NewsCard.vue';
import PageHero from '@/components/site/PageHero.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import { content, type NewsItem } from '@/lib/content';
import { faNumber } from '@/lib/site';

usePageMeta(
  'اخبار آسمان',
  'رویدادهای آسمانی از نگاه تنجیم: برگشت سیارات، ماه گرفتگی، خورشیدگرفتگی و ماه کامل در هر برج.',
);

const PER_PAGE = 12;
const route = useRoute();
const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const items = ref<NewsItem[]>([]);
const total = ref(0);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const pages = computed(() => Math.ceil(total.value / PER_PAGE));

async function load() {
  state.value = 'loading';
  try {
    const r = await content.news('all', PER_PAGE, (page.value - 1) * PER_PAGE);
    items.value = r.items;
    total.value = r.total;
    state.value = 'ready';
  } catch {
    state.value = 'error';
  }
}
watch(page, load, { immediate: true });
</script>

<template>
  <PageHero
    eyebrow="اخبار آسمان"
    title="آسمان این روزها"
    subtitle="رویدادهای آسمانی و معنای آن‌ها از نگاه تنجیم؛ آنچه در راه است و آنچه گذشت."
  />
  <div class="fn-light min-h-[40vh] bg-[#f3e8ff]">
    <section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div v-if="state === 'loading'" class="grid gap-6 md:grid-cols-3">
        <div v-for="i in 3" :key="i" class="fn-card h-64 animate-pulse" />
      </div>
      <p v-else-if="state === 'error'" class="py-16 text-center text-[#4a3a5e]">
        اخبار بارگذاری نشد. کمی بعد دوباره سر بزن.
      </p>
      <p v-else-if="!items.length" class="py-16 text-center text-[#4a3a5e]">
        هنوز خبری ثبت نشده است.
      </p>
      <template v-else>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(n, i) in items" :key="n._id" v-reveal="0.06 * (i % 3)">
            <NewsCard :item="n" />
          </div>
        </div>
        <nav
          v-if="pages > 1"
          class="mt-12 flex flex-wrap justify-center gap-2"
          aria-label="صفحه‌بندی"
        >
          <RouterLink
            v-for="p in pages"
            :key="p"
            :to="{ query: p === 1 ? {} : { page: p } }"
            class="grid size-11 place-items-center rounded-full font-bold transition"
            :class="
              p === page
                ? 'bg-[#24143d] text-[#f3e8ff]'
                : 'bg-white/70 text-[#24143d] hover:bg-white'
            "
            :aria-current="p === page ? 'page' : undefined"
          >
            {{ faNumber(p) }}
          </RouterLink>
        </nav>
      </template>
    </section>
  </div>
</template>
