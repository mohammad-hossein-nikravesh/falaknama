<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ArticleCard from '@/components/site/ArticleCard.vue';
import PageHero from '@/components/site/PageHero.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import { content, type ArticleSummary } from '@/lib/content';
import { faNumber } from '@/lib/site';

usePageMeta(
  'مقاله‌ها',
  'مقاله‌های فلک‌نما دربارهٔ نقشهٔ تولد، سیارات، خانه‌ها و رویدادهای آسمانی، به زبانی ساده.',
);

const PER_PAGE = 9;
const route = useRoute();
const page = computed(() => Math.max(1, Number(route.query.page) || 1));
const items = ref<ArticleSummary[]>([]);
const total = ref(0);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const pages = computed(() => Math.ceil(total.value / PER_PAGE));

async function load() {
  state.value = 'loading';
  try {
    const r = await content.articles(PER_PAGE, (page.value - 1) * PER_PAGE);
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
    eyebrow="خواندنی‌ها"
    title="مقاله‌های فلک‌نما"
    subtitle="هر آنچه برای خواندن آسمان لازم داری؛ از الفبای نقشهٔ تولد تا رازهای سیارات و خانه‌ها."
  />
  <div class="fn-light min-h-[40vh] bg-[#f3e8ff]">
    <section class="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div v-if="state === 'loading'" class="grid gap-6 md:grid-cols-3">
        <div v-for="i in 3" :key="i" class="fn-card h-96 animate-pulse" />
      </div>
      <p v-else-if="state === 'error'" class="py-16 text-center text-[#4a3a5e]">
        فهرست مقاله‌ها بارگذاری نشد. کمی بعد دوباره سر بزن.
      </p>
      <p v-else-if="!items.length" class="py-16 text-center text-[#4a3a5e]">
        هنوز مقاله‌ای منتشر نشده است.
      </p>
      <template v-else>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(a, i) in items" :key="a._id" v-reveal="0.06 * (i % 3)">
            <ArticleCard :article="a" />
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
