<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SiteFooter from '@/components/site/SiteFooter.vue';
import SiteHeader from '@/components/site/SiteHeader.vue';
import PageHero from '@/components/site/PageHero.vue';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta('صفحه پیدا نشد');
</script>

<template>
  <div class="fn-site">
    <SiteHeader />
    <PageHero
      eyebrow="۴۰۴"
      title="این ستاره در آسمان ما نیست"
      subtitle="صفحه‌ای که دنبالش بودی پیدا نشد؛ شاید جابه‌جا شده یا هرگز وجود نداشته است."
    >
      <RouterLink to="/" class="fn-btn fn-btn-gold mt-8"
        >بازگشت به صفحهٔ اصلی</RouterLink
      >
    </PageHero>
    <div class="h-24 bg-[#f3e8ff]" />
    <SiteFooter />
  </div>
</template>
