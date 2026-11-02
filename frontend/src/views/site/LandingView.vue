<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  HeartHandshake,
  MoonStar,
  Orbit,
  Sparkles,
  Sprout,
  Sun,
} from '@lucide/vue';
import BirthChart from '@/components/site/BirthChart.vue';
import StarField from '@/components/site/StarField.vue';
import NewsCard from '@/components/site/NewsCard.vue';
import ArticleCard from '@/components/site/ArticleCard.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import {
  content,
  type ArticleSummary,
  type Faq,
  type NewsItem,
} from '@/lib/content';

usePageMeta(
  undefined,
  'فلک‌نما نقشهٔ تولدت را با تاریخ، ساعت و مکان دقیق تولد ترسیم می‌کند و تحلیل روزانه، شخصیت، روابط و مسیر شغلی‌ات را به زبانی ساده روایت می‌کند.',
);

const features = [
  {
    icon: Orbit,
    title: 'نقشهٔ تولد',
    text: 'تصویر کامل آسمان در لحظهٔ تولدت؛ جایگاه سیارات، خانه‌ها و زاویه‌هایی که میانشان شکل گرفته است.',
    tone: 'from-[#8b6cf0] to-[#5b3fc4]',
  },
  {
    icon: Sun,
    title: 'تحلیل روزانه',
    text: 'هر صبح، حال‌وهوای آسمانِ امروز برای خودِ تو؛ همراه با امتیاز انرژی در عشق، کار و آرامش.',
    tone: 'from-[#f3dc9c] to-[#e0a96d]',
  },
  {
    icon: HeartHandshake,
    title: 'عشق و سازگاری',
    text: 'دو نقشه را کنار هم بگذار و ببین کجا هم‌نوا هستند و کجا به صبوری و گفت‌وگو نیاز دارند.',
    tone: 'from-[#f0a6c0] to-[#c0567f]',
  },
  {
    icon: BriefcaseBusiness,
    title: 'مسیر شغلی',
    text: 'استعدادها، سبک کار و مسیرهای حرفه‌ای که نشانه‌های نقشه‌ات به آن‌ها اشاره می‌کنند.',
    tone: 'from-[#8fd3e8] to-[#3f8fb5]',
  },
  {
    icon: MoonStar,
    title: 'فاز ماه',
    text: 'ماهِ امروز در کدام منزل است و چه ریتمی به احساسات و تصمیم‌هایت می‌بخشد.',
    tone: 'from-[#b9a7ff] to-[#6c5ce7]',
  },
  {
    icon: Sprout,
    title: 'سرشت و شخصیت',
    text: 'خورشید، ماه و طالع؛ سه ستونی که با هم «تو» را می‌سازند و لایه‌های پنهانت را روشن می‌کنند.',
    tone: 'from-[#9be3b5] to-[#3a9e6a]',
  },
];

const steps = [
  {
    title: 'اطلاعات تولدت را وارد کن',
    text: 'تاریخ، ساعت و شهر تولد؛ هرچه ساعت دقیق‌تر باشد، نقشه‌ات دقیق‌تر ترسیم می‌شود.',
  },
  {
    title: 'آسمانت ترسیم می‌شود',
    text: 'فلک‌نما جای خورشید، ماه و سیارات را در همان لحظه محاسبه می‌کند و نقشهٔ اختصاصی‌ات را می‌کشد.',
  },
  {
    title: 'تحلیل‌ها را بخوان',
    text: 'تحلیل روزانه، شخصیت، روابط و مسیر شغلی؛ همه به زبانی روشن که به دل می‌نشیند.',
  },
];

const reasons = [
  'نقشهٔ کامل نجومی بر پایهٔ زمان و مکان دقیق تولد',
  'تحلیل تازه برای هر روز، بر اساس حرکت واقعی سیارات',
  'زبانی گرم و روشن، بی‌اصطلاحات پیچیده',
];

const news = ref<NewsItem[]>([]);
const articles = ref<ArticleSummary[]>([]);
const faqs = ref<Faq[]>([]);

onMounted(() => {
  // Each block hides itself when its content is missing or the API is down.
  content.news('current', 4).then(
    (r) => (news.value = r.items),
    () => {},
  );
  content.articles(3).then(
    (r) => (articles.value = r.items),
    () => {},
  );
  content.faqs().then(
    (r) => (faqs.value = r),
    () => {},
  );
});
</script>

<template>
  <!-- ───────── Night: hero and "why" share one starry sky ───────── -->
  <div class="relative bg-[#120922]">
    <StarField
      class="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
    />
    <div
      class="pointer-events-none absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[#3a2252] opacity-60 blur-[140px]"
    />

    <section
      class="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr]"
    >
      <div>
        <span v-reveal class="fn-eyebrow text-[#f3e8ff]"
          >ستاره‌ها روایت می‌کنند</span
        >
        <h1
          v-reveal="0.1"
          class="mt-6 text-4xl leading-[1.45] font-black text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.4]"
        >
          آسمانِ شبی که به دنیا آمدی،
          <span class="fn-gold-text block">هنوز با تو حرف می‌زند</span>
        </h1>
        <p
          v-reveal="0.2"
          class="mt-6 max-w-xl text-base leading-8 text-[#f3e8ff]/75 sm:text-lg sm:leading-9"
        >
          فلک‌نما جای خورشید، ماه و سیارات را در لحظه و مکانِ تولدت محاسبه
          می‌کند و آن را به زبانی ساده برایت روایت می‌کند؛ پیوندی میان دانش کهن
          تنجیم و دقت محاسبات امروزی.
        </p>
        <div v-reveal="0.3" class="mt-9 flex flex-wrap items-center gap-4">
          <!-- Leads nowhere until the App exists. -->
          <button type="button" class="fn-btn fn-btn-gold text-lg">
            شروع کنید <ArrowLeft class="size-5" />
          </button>
          <RouterLink to="/#steps" class="fn-btn fn-btn-ghost text-[#f3e8ff]"
            >ببین چطور کار می‌کند</RouterLink
          >
        </div>
        <p
          v-reveal="0.4"
          class="mt-7 flex items-center gap-2 text-sm text-[#f3e8ff]/60"
        >
          <Sparkles class="size-4 text-[#e9c46a]" /> محاسبه بر پایهٔ دقیقهٔ
          تولد، نه فقط ماه تولد
        </p>
      </div>

      <div v-reveal="0.2" class="relative mx-auto w-full max-w-[34rem]">
        <div
          class="absolute inset-[12%] rounded-full bg-[#e9c46a]/20 blur-[90px]"
        />
        <div v-tilt="5" class="relative">
          <BirthChart
            class="w-full drop-shadow-[0_0_40px_rgba(58,34,82,0.9)]"
          />
        </div>
        <div
          class="fn-card fn-float absolute top-[6%] -left-2 flex items-center gap-3 !rounded-2xl px-4 py-3 text-sm font-semibold sm:left-0"
        >
          <span
            class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#f3dc9c] to-[#e0a96d] text-[#120922]"
            ><Sun class="size-5"
          /></span>
          تحلیل امروز
        </div>
        <div
          class="fn-card fn-float absolute top-[46%] -right-3 flex items-center gap-3 !rounded-2xl px-4 py-3 text-sm font-semibold [animation-delay:-2s] sm:-right-6"
        >
          <span
            class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#8b6cf0] to-[#5b3fc4]"
            ><Orbit class="size-5"
          /></span>
          نقشهٔ تولد
        </div>
        <div
          class="fn-card fn-float absolute bottom-[4%] left-[8%] flex items-center gap-3 !rounded-2xl px-4 py-3 text-sm font-semibold [animation-delay:-4s]"
        >
          <span
            class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#f0a6c0] to-[#c0567f]"
            ><HeartHandshake class="size-5"
          /></span>
          سازگاری
        </div>
      </div>

      <a
        href="#why"
        class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[#f3e8ff]/50 transition hover:text-[#e9c46a] lg:block"
        aria-label="ادامه"
      >
        <ChevronDown class="size-7 animate-bounce" />
      </a>
    </section>

    <section
      id="why"
      class="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6"
    >
      <div v-reveal class="fn-card grid overflow-hidden lg:grid-cols-2">
        <div class="p-8 sm:p-12">
          <span class="fn-eyebrow text-[#f3e8ff]">فقط مالِ تو</span>
          <h2 class="mt-5 text-3xl leading-[1.5] font-black sm:text-4xl">
            هیچ دو آسمانی یکسان نیست؛
            <span class="fn-gold-text">آسمانِ تو تکرارنشدنی است.</span>
          </h2>
          <p class="mt-5 leading-8 text-[#f3e8ff]/75">
            فال‌های عمومی همه را در دوازده دسته جا می‌دهند. فلک‌نما از ساعت،
            تاریخ و شهر تولدت شروع می‌کند و نقشه‌ای می‌سازد که فقط به تو تعلق
            دارد؛ و هر تحلیل از دل همین نقشه بیرون می‌آید.
          </p>
          <ul class="mt-8 grid gap-4">
            <li
              v-for="(r, i) in reasons"
              :key="r"
              v-reveal="0.1 * i"
              class="flex items-center gap-3 font-medium"
            >
              <span
                class="grid size-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#f3dc9c] to-[#e0a96d] text-[#120922]"
              >
                <Check class="size-4" />
              </span>
              {{ r }}
            </li>
          </ul>
        </div>
        <div
          class="relative min-h-80 overflow-hidden bg-gradient-to-br from-[#24143d] to-[#120922]"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(233,196,106,0.18),transparent_60%)]"
          />
          <BirthChart
            :seed="1"
            :labels="false"
            class="absolute top-1/2 right-[4%] w-[62%] -translate-y-1/2 opacity-90"
          />
          <BirthChart
            :seed="2"
            :labels="false"
            reverse
            class="absolute top-1/2 left-[4%] w-[62%] -translate-y-1/2 opacity-70 mix-blend-screen"
          />
        </div>
      </div>
    </section>
  </div>

  <!-- ───────── Twilight: features and steps ───────── -->
  <section
    id="features"
    class="scroll-mt-24 bg-gradient-to-b from-[#120922] to-[#24143d] py-24"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="mx-auto max-w-2xl text-center">
        <span v-reveal class="fn-eyebrow text-[#f3e8ff]"
          >آنچه فلک‌نما می‌خواند</span
        >
        <h2
          v-reveal="0.1"
          class="mt-5 text-3xl leading-[1.5] font-black sm:text-4xl"
        >
          هر آنچه آسمان دربارهٔ تو می‌داند
        </h2>
        <p v-reveal="0.2" class="mt-4 leading-8 text-[#f3e8ff]/70">
          از حال‌وهوای امروز تا لایه‌های پنهان شخصیت؛ هر بخش دریچه‌ای تازه به
          شناخت خودت است.
        </p>
      </div>
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(f, i) in features"
          :key="f.title"
          v-reveal="0.08 * i"
          v-tilt
          class="fn-card fn-glow p-7"
        >
          <span
            class="grid size-13 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg"
            :class="f.tone"
          >
            <component :is="f.icon" class="size-6" />
          </span>
          <h3 class="mt-5 text-xl font-extrabold">{{ f.title }}</h3>
          <p class="mt-3 leading-7 text-[#f3e8ff]/70">{{ f.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <section
    id="steps"
    class="scroll-mt-24 bg-gradient-to-b from-[#24143d] to-[#3a2252] py-24"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="mx-auto max-w-2xl text-center">
        <span v-reveal class="fn-eyebrow text-[#f3e8ff]">سه گام ساده</span>
        <h2
          v-reveal="0.1"
          class="mt-5 text-3xl leading-[1.5] font-black sm:text-4xl"
        >
          از یک تاریخ تا یک آسمان
        </h2>
        <p v-reveal="0.2" class="mt-4 leading-8 text-[#f3e8ff]/70">
          لازم نیست چیزی از نجوم بدانی؛ چند اطلاعات ساده بده و باقی کار را به
          فلک‌نما بسپار.
        </p>
      </div>
      <div class="relative mt-16 grid gap-6 md:grid-cols-3">
        <!-- the constellation line joining the steps -->
        <svg
          class="pointer-events-none absolute top-8 right-[16%] left-[16%] hidden h-4 md:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 4"
          aria-hidden="true"
        >
          <line
            v-reveal
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="#e9c46a"
            stroke-opacity=".5"
            stroke-dasharray="1 1.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
        <article
          v-for="(s, i) in steps"
          :key="s.title"
          v-reveal="0.15 * i"
          v-tilt="5"
          class="fn-card fn-glow relative p-8 text-center"
        >
          <span
            class="relative mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#f3dc9c] via-[#e9c46a] to-[#e0a96d] text-2xl font-black text-[#120922] shadow-[0_0_40px_-6px_rgba(233,196,106,0.8)]"
          >
            {{ (i + 1).toLocaleString('fa-IR') }}
          </span>
          <h3 class="mt-6 text-xl font-extrabold">{{ s.title }}</h3>
          <p class="mt-3 leading-7 text-[#f3e8ff]/70">{{ s.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ───────── Horizon: the sun rises ───────── -->
  <div
    class="relative h-56 overflow-hidden bg-gradient-to-b from-[#3a2252] via-[#b5838d] to-[#f0d3b4] sm:h-72"
    aria-hidden="true"
  >
    <div
      v-reveal
      class="absolute -bottom-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#fff3cf_0%,#e9c46a_35%,rgba(224,169,109,0)_70%)] blur-sm sm:-bottom-52 sm:size-[26rem]"
    />
    <!-- haze along the horizon so the sun melts into the dawn below -->
    <div
      class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-[#f0d3b4]"
    />
  </div>

  <!-- ───────── Dawn: news, articles, questions, call to action ───────── -->
  <div
    class="fn-light bg-gradient-to-b from-[#f0d3b4] via-[#f6e6e4] to-[#f3e8ff]"
  >
    <section
      v-if="news.length"
      id="news"
      class="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12 pb-20 sm:px-6"
    >
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span v-reveal class="fn-eyebrow">اخبار آسمان</span>
          <h2
            v-reveal="0.1"
            class="mt-4 text-3xl leading-[1.5] font-black sm:text-4xl"
          >
            این روزها در آسمان چه می‌گذرد؟
          </h2>
        </div>
        <RouterLink to="/news" class="fn-btn fn-btn-ghost !py-2.5 text-sm"
          >همهٔ اخبار <ArrowLeft class="size-4"
        /></RouterLink>
      </div>
      <div
        class="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
      >
        <div
          v-for="(n, i) in news"
          :key="n._id"
          v-reveal="0.08 * i"
          class="w-[82%] shrink-0 snap-start sm:w-auto"
        >
          <NewsCard :item="n" />
        </div>
      </div>
    </section>

    <section
      v-if="articles.length"
      class="mx-auto max-w-6xl px-4 py-20 sm:px-6"
    >
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span v-reveal class="fn-eyebrow">خواندنی‌ها</span>
          <h2
            v-reveal="0.1"
            class="mt-4 text-3xl leading-[1.5] font-black sm:text-4xl"
          >
            تازه‌ترین مقاله‌های فلک‌نما
          </h2>
        </div>
        <RouterLink to="/articles" class="fn-btn fn-btn-ghost !py-2.5 text-sm"
          >همهٔ مقاله‌ها <ArrowLeft class="size-4"
        /></RouterLink>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <div v-for="(a, i) in articles" :key="a._id" v-reveal="0.1 * i">
          <ArticleCard :article="a" />
        </div>
      </div>
    </section>

    <section
      v-if="faqs.length"
      id="faq"
      class="mx-auto max-w-3xl scroll-mt-24 px-4 py-20 sm:px-6"
    >
      <div class="text-center">
        <span v-reveal class="fn-eyebrow">پرسش‌های پرتکرار</span>
        <h2
          v-reveal="0.1"
          class="mt-4 text-3xl leading-[1.5] font-black sm:text-4xl"
        >
          پیش از شروع، شاید بپرسی…
        </h2>
      </div>
      <div class="mt-10 grid gap-3">
        <details
          v-for="(q, i) in faqs"
          :key="q._id"
          v-reveal="0.05 * i"
          class="fn-card group !rounded-2xl px-6 py-1 open:pb-5"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden"
          >
            {{ q.question }}
            <ChevronDown
              class="size-5 shrink-0 text-[#3a2252] transition-transform duration-300 group-open:rotate-180"
            />
          </summary>
          <p class="leading-8 whitespace-pre-line text-[#4a3a5e]">
            {{ q.answer }}
          </p>
        </details>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6">
      <div
        v-reveal
        class="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fff7e6] to-[#f3e8ff] px-6 py-16 text-center shadow-[0_30px_80px_-40px_#3a2252] ring-1 ring-[#24143d]/10 sm:py-20"
      >
        <div
          class="pointer-events-none absolute -bottom-48 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,196,106,0.55),transparent_65%)]"
        />
        <div class="relative">
          <span class="fn-eyebrow">آمادهٔ شروع؟</span>
          <h2
            class="mx-auto mt-5 max-w-2xl text-3xl leading-[1.5] font-black sm:text-5xl sm:leading-[1.4]"
          >
            آسمانت منتظر است؛ <span class="text-[#3a2252]">فلکت را بنما.</span>
          </h2>
          <p class="mx-auto mt-5 max-w-xl leading-8 text-[#4a3a5e]">
            اطلاعات تولدت را وارد کن و نخستین تحلیل اختصاصی‌ات را ببین؛ چند
            دقیقه برای شناختن آسمانی که با تو به دنیا آمد.
          </p>
          <!-- Leads nowhere until the App exists. -->
          <button type="button" class="fn-btn fn-btn-ink mt-9 text-lg">
            ورود به اپلیکیشن <ArrowLeft class="size-5" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
