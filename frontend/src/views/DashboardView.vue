<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { CircleHelp, FileText, Newspaper, Plus } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { Page } from '@/lib/content';

const counts = ref<{ articles?: number; news?: number; faqs?: number }>({});

onMounted(async () => {
  const [articles, news, faqs] = await Promise.allSettled([
    api.get<Page<unknown>>('/articles?limit=1'),
    api.get<Page<unknown>>('/news?limit=1'),
    api.get<unknown[]>('/faqs'),
  ]);
  counts.value = {
    articles:
      articles.status === 'fulfilled' ? articles.value.total : undefined,
    news: news.status === 'fulfilled' ? news.value.total : undefined,
    faqs: faqs.status === 'fulfilled' ? faqs.value.length : undefined,
  };
});

const sections = [
  { to: '/admin/articles', label: 'مقاله‌ها', key: 'articles', icon: FileText },
  { to: '/admin/news', label: 'اخبار آسمان', key: 'news', icon: Newspaper },
  {
    to: '/admin/faqs',
    label: 'پرسش‌های پرتکرار',
    key: 'faqs',
    icon: CircleHelp,
  },
] as const;
</script>

<template>
  <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <h1 class="text-2xl font-semibold">داشبورد</h1>
    <Button as-child
      ><RouterLink to="/admin/articles/new"
        ><Plus /> مقالهٔ تازه</RouterLink
      ></Button
    >
  </div>
  <div class="grid gap-4 sm:grid-cols-3">
    <RouterLink v-for="s in sections" :key="s.key" :to="s.to">
      <Card class="transition hover:shadow-md">
        <CardContent class="flex items-center gap-4 pt-6">
          <span
            class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary"
            ><component :is="s.icon" class="size-6"
          /></span>
          <div>
            <p class="text-sm text-muted-foreground">{{ s.label }}</p>
            <p class="text-2xl font-bold">
              {{ counts[s.key]?.toLocaleString('fa-IR') ?? '—' }}
            </p>
          </div>
        </CardContent>
      </Card>
    </RouterLink>
  </div>
</template>
