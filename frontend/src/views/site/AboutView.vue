<script setup lang="ts">
import {
  Compass,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue';
import PageHero from '@/components/site/PageHero.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import { site } from '@/lib/site';
import logo from '@/assets/brand/logo.webp';

usePageMeta(
  'دربارهٔ ما و تماس',
  'فلک‌نما را تیمی از پژوهشگران تنجیم، نویسندگان و برنامه‌نویسان می‌سازند تا آسمان لحظهٔ تولد را دقیق، ساده و صمیمی روایت کنند.',
);

const values = [
  {
    icon: Compass,
    title: 'دقت در محاسبه',
    text: 'نقشه‌ها با داده‌های نجومی معتبر و بر پایهٔ زمان و مکان دقیق تولد محاسبه می‌شوند، نه حدس و تقریب.',
  },
  {
    icon: Sparkles,
    title: 'زبانی که فهمیده شود',
    text: 'تنجیم را از اصطلاحات پیچیده بیرون می‌آوریم و به زبانی گرم و روشن می‌نویسیم تا برای همه قابل استفاده باشد.',
  },
  {
    icon: ShieldCheck,
    title: 'احترام به حریم تو',
    text: 'اطلاعات تولد تو امانت است؛ فقط برای ساختن تحلیل‌هایت به کار می‌رود و با کسی به اشتراک گذاشته نمی‌شود.',
  },
];
</script>

<template>
  <PageHero
    eyebrow="دربارهٔ فلک‌نما"
    title="ما آسمان را برای تو ترجمه می‌کنیم"
    subtitle="فلک‌نما حاصل کار تیمی است که سال‌ها در حوزهٔ تنجیم پژوهش کرده و حالا می‌خواهد این دانش کهن را با ابزارهای امروزی، ساده و در دسترس کند."
  />

  <div class="fn-light bg-[#f3e8ff]">
    <section
      class="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr]"
    >
      <div v-reveal class="fn-prose">
        <h2>ما که هستیم؟</h2>
        <p>
          ما گروهی از پژوهشگران تنجیم، نویسندگان و برنامه‌نویسان هستیم که یک
          باور مشترک داریم: آسمانِ لحظهٔ تولد هر کس، روایتی منحصربه‌فرد دارد که
          شنیدنش می‌تواند به شناخت بهتر خود کمک کند. فلک‌نما از همین باور متولد
          شد.
        </p>
        <p>
          در تیم ما، کارشناسان تنجیم تفسیرها را بر پایهٔ سنت‌های معتبر این دانش
          می‌نویسند و بازبینی می‌کنند، و تیم فنی محاسبات نجومی را دقیق و سریع
          انجام می‌دهد تا تو بدون نیاز به دانش تخصصی، نقشهٔ تولدت را ببینی و
          بفهمی.
        </p>
        <h2>چرا «فلک‌نما»؟</h2>
        <p>
          «فلک» در زبان پیشینیان ما همان آسمان گردان بود و «نما» یعنی نشان دادن.
          فلک‌نما می‌خواهد آسمانی را که هنگام تولدت بالای سرت بود به تو نشان
          دهد؛ نه برای پیشگویی سرنوشت، بلکه برای دیدن توانایی‌ها، چالش‌ها و
          ریتم‌هایی که می‌توانی آگاهانه‌تر با آن‌ها زندگی کنی.
        </p>
      </div>
      <div class="grid content-start gap-5">
        <div v-reveal class="relative mx-auto mb-4 w-56 sm:w-64">
          <div
            class="absolute inset-[10%] rounded-full bg-[#e9c46a]/40 blur-3xl"
          />
          <img
            :src="logo"
            alt="لوگوی فلک‌نما"
            width="640"
            height="640"
            class="fn-float relative w-full drop-shadow-[0_20px_40px_rgba(36,20,61,0.45)]"
          />
        </div>
        <article
          v-for="(v, i) in values"
          :key="v.title"
          v-reveal="0.1 * i"
          v-tilt="5"
          class="fn-card fn-glow flex gap-4 p-6"
        >
          <span
            class="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#3a2252] to-[#24143d] text-[#e9c46a]"
          >
            <component :is="v.icon" class="size-6" />
          </span>
          <div>
            <h3 class="font-extrabold">{{ v.title }}</h3>
            <p class="mt-2 text-sm leading-7 text-[#4a3a5e]">{{ v.text }}</p>
          </div>
        </article>
      </div>
    </section>

    <section
      id="contact"
      class="mx-auto max-w-6xl scroll-mt-24 px-4 pt-4 pb-24 sm:px-6"
    >
      <div
        v-reveal
        class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#120922] via-[#24143d] to-[#3a2252] p-8 text-[#f3e8ff] sm:p-12"
      >
        <div
          class="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[#e9c46a]/20 blur-[90px]"
        />
        <div class="relative">
          <span class="fn-eyebrow">تماس با ما</span>
          <h2 class="mt-5 text-3xl font-black">صدایت را می‌شنویم</h2>
          <p class="mt-3 max-w-xl leading-8 text-[#f3e8ff]/75">
            پرسش، پیشنهاد یا همکاری؟ از هر راهی که راحت‌تری با ما در تماس باش؛
            معمولاً در کمتر از یک روز کاری پاسخ می‌دهیم.
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <a
              v-if="site.telegram"
              :href="`https://t.me/${site.telegram}`"
              target="_blank"
              rel="noopener"
              class="fn-glow group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <Send class="size-6 text-[#e9c46a]" />
              <span
                ><span class="block text-sm text-[#f3e8ff]/60">تلگرام</span
                ><span dir="ltr" class="font-bold"
                  >@{{ site.telegram }}</span
                ></span
              >
            </a>
            <a
              v-if="site.email"
              :href="`mailto:${site.email}`"
              class="fn-glow group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <Mail class="size-6 text-[#e9c46a]" />
              <span
                ><span class="block text-sm text-[#f3e8ff]/60">ایمیل</span
                ><span dir="ltr" class="font-bold">{{ site.email }}</span></span
              >
            </a>
            <a
              v-if="site.whatsapp"
              :href="`https://wa.me/${site.whatsapp}`"
              target="_blank"
              rel="noopener"
              class="fn-glow group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <MessageCircle class="size-6 text-[#e9c46a]" />
              <span
                ><span class="block text-sm text-[#f3e8ff]/60">واتساپ</span
                ><span class="font-bold">گفت‌وگو با ادمین</span></span
              >
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
