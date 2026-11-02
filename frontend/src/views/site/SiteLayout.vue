<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteFooter from '@/components/site/SiteFooter.vue';
import SiteHeader from '@/components/site/SiteHeader.vue';
</script>

<template>
  <div class="fn-site">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[60] focus:rounded-full focus:bg-[#e9c46a] focus:px-4 focus:py-2 focus:text-[#120922]"
    >
      پرش به محتوا
    </a>
    <SiteHeader />
    <main id="main"><RouterView /></main>
    <SiteFooter />
  </div>
</template>
