<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Menu, X } from '@lucide/vue';
import BrandMark from './BrandMark.vue';

const nav = [
  { to: '/#why', label: 'چرا فلک‌نما' },
  { to: '/#features', label: 'امکانات' },
  { to: '/#steps', label: 'چطور کار می‌کند' },
  { to: '/articles', label: 'مقاله‌ها' },
  { to: '/news', label: 'اخبار آسمان' },
];

const route = useRoute();
const open = ref(false);
const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 24);

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
watch(
  () => route.fullPath,
  () => (open.value = false),
);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="
      scrolled || open
        ? 'bg-[#120922]/75 shadow-[0_10px_30px_-20px_black] backdrop-blur-xl'
        : ''
    "
  >
    <div
      class="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-3"
        aria-label="فلک‌نما، صفحهٔ اصلی"
      >
        <BrandMark
          class="size-10 drop-shadow-[0_0_12px_rgba(233,196,106,0.35)]"
        />
        <span class="leading-tight">
          <span class="block text-xl font-black text-[#f3e8ff]">فلک‌نما</span>
          <span class="block text-[10px] tracking-[0.3em] text-[#e9c46a]/80"
            >FALAKNAMA</span
          >
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 text-sm text-[#f3e8ff]/80 transition hover:bg-white/5 hover:text-[#f3e8ff]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <!-- Leads nowhere until the App exists. -->
        <button
          type="button"
          class="fn-btn fn-btn-ghost hidden !px-5 !py-2.5 text-sm text-[#f3e8ff] sm:inline-flex"
        >
          ورود به اپلیکیشن
        </button>
        <button
          type="button"
          class="grid size-11 place-items-center rounded-full text-[#f3e8ff] hover:bg-white/5 lg:hidden"
          :aria-expanded="open"
          aria-label="منو"
          @click="open = !open"
        >
          <X v-if="open" class="size-6" />
          <Menu v-else class="size-6" />
        </button>
      </div>
    </div>

    <Transition
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
    >
      <nav
        v-if="open"
        class="grid gap-1 border-t border-white/10 px-4 pt-3 pb-6 lg:hidden"
      >
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-4 py-3 text-[#f3e8ff]/90 hover:bg-white/5"
        >
          {{ item.label }}
        </RouterLink>
        <button type="button" class="fn-btn fn-btn-gold mt-3 sm:hidden">
          ورود به اپلیکیشن
        </button>
      </nav>
    </Transition>
  </header>
</template>
