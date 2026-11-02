<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Mail, MessageCircle, Send } from '@lucide/vue';
import { jalaliYear, site } from '@/lib/site';
import BrandMark from './BrandMark.vue';

const links = [
  { to: '/#features', label: 'امکانات' },
  { to: '/#steps', label: 'چطور کار می‌کند' },
  { to: '/articles', label: 'مقاله‌ها' },
  { to: '/news', label: 'اخبار آسمان' },
  { to: '/about', label: 'دربارهٔ ما' },
  { to: '/about#contact', label: 'تماس با ما' },
];
</script>

<template>
  <footer class="border-t border-[#24143d]/10 bg-[#f3e8ff] text-[#120922]">
    <div
      class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]"
    >
      <div>
        <RouterLink to="/" class="flex items-center gap-3">
          <BrandMark class="size-11" />
          <span class="text-xl font-black">فلک‌نما</span>
        </RouterLink>
        <p class="mt-4 max-w-sm text-sm leading-7 text-[#4a3a5e]">
          آسمانِ لحظهٔ تولدت را به زبانی ساده و صمیمی برایت می‌خوانیم؛ از نقشهٔ
          تولد تا حال‌وهوای هر روز.
        </p>
      </div>

      <nav aria-label="پیوندهای فوتر">
        <h2 class="mb-4 text-sm font-bold">فلک‌نما</h2>
        <ul
          class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-[#4a3a5e] md:grid-cols-1"
        >
          <li v-for="l in links" :key="l.to">
            <RouterLink :to="l.to" class="hover:text-[#120922]">{{
              l.label
            }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="mb-4 text-sm font-bold">در تماس باشیم</h2>
        <ul class="grid gap-3 text-sm text-[#4a3a5e]">
          <li v-if="site.telegram">
            <a
              :href="`https://t.me/${site.telegram}`"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 hover:text-[#120922]"
            >
              <Send class="size-4" />
              <span dir="ltr">@{{ site.telegram }}</span>
            </a>
          </li>
          <li v-if="site.whatsapp">
            <a
              :href="`https://wa.me/${site.whatsapp}`"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 hover:text-[#120922]"
            >
              <MessageCircle class="size-4" /> واتساپ
            </a>
          </li>
          <li v-if="site.email">
            <a
              :href="`mailto:${site.email}`"
              class="inline-flex items-center gap-2 hover:text-[#120922]"
            >
              <Mail class="size-4" /> <span dir="ltr">{{ site.email }}</span>
            </a>
          </li>
        </ul>
        <!-- eNamad badge goes here once the site's code is issued. -->
      </div>
    </div>
    <div
      class="border-t border-[#24143d]/10 py-5 text-center text-xs text-[#4a3a5e]"
    >
      © {{ jalaliYear() }} فلک‌نما · همهٔ حقوق محفوظ است
    </div>
  </footer>
</template>
