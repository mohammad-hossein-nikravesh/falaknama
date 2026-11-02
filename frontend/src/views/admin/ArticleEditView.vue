<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import ImageField from '@/components/admin/ImageField.vue';
import JalaliDateInput from '@/components/admin/JalaliDateInput.vue';
import RichEditor from '@/components/admin/RichEditor.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type { Article } from '@/lib/content';
import { slugify } from '@/lib/slug';

const route = useRoute();
const router = useRouter();
const id = computed(() =>
  route.params.id === 'new' ? null : (route.params.id as string),
);

const form = ref({
  title: '',
  slug: '',
  summary: '',
  coverImage: undefined as string | undefined,
  body: '',
  status: 'draft',
  publishedAt: null as string | null,
});
const slugTouched = ref(false);
const busy = ref(false);
const error = ref('');
const saved = ref('');

const textarea =
  'w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm leading-7 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

watch(
  () => form.value.title,
  (title) => {
    if (!slugTouched.value && !id.value) form.value.slug = slugify(title);
  },
);

onMounted(async () => {
  if (!id.value) return;
  try {
    const a = await api.get<Article & { status: 'draft' | 'published' }>(
      `/articles/${id.value}`,
    );
    form.value = {
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      coverImage: a.coverImage,
      body: a.body,
      status: a.status,
      publishedAt: a.publishedAt ?? null,
    };
    slugTouched.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'بارگذاری ناموفق بود';
  }
});

async function save(status: 'draft' | 'published') {
  busy.value = true;
  error.value = '';
  saved.value = '';
  const { publishedAt, coverImage, ...rest } = form.value;
  const payload = {
    ...rest,
    status,
    ...(coverImage ? { coverImage } : {}),
    ...(publishedAt ? { publishedAt } : {}),
  };
  try {
    if (id.value) {
      await api.patch(`/articles/${id.value}`, {
        ...payload,
        ...(!coverImage && { coverImage: null }),
      });
    } else {
      const created = await api.post<{ _id: string }>('/articles', payload);
      await router.replace(`/admin/articles/${created._id}`);
    }
    form.value.status = status;
    saved.value = status === 'published' ? 'منتشر شد.' : 'پیش‌نویس ذخیره شد.';
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'ذخیره ناموفق بود';
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" as-child aria-label="بازگشت"
        ><RouterLink to="/admin/articles"><ArrowRight /></RouterLink
      ></Button>
      <h1 class="text-2xl font-semibold">
        {{ id ? 'ویرایش مقاله' : 'مقالهٔ تازه' }}
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <span v-if="saved" class="text-sm text-primary">{{ saved }}</span>
      <Button variant="outline" :disabled="busy" @click="save('draft')">
        {{
          form.status === 'published'
            ? 'برگرداندن به پیش‌نویس'
            : 'ذخیرهٔ پیش‌نویس'
        }}
      </Button>
      <Button :disabled="busy" @click="save('published')">{{
        form.status === 'published' ? 'ذخیره و انتشار' : 'انتشار'
      }}</Button>
    </div>
  </div>
  <p v-if="error" role="alert" class="mb-4 text-sm text-destructive">
    {{ error }}
  </p>

  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
    <Card>
      <CardContent class="grid gap-5 pt-6">
        <div class="grid gap-2">
          <Label for="title">عنوان</Label>
          <Input
            id="title"
            v-model="form.title"
            class="h-10 text-lg font-semibold"
            required
          />
        </div>
        <div class="grid gap-2">
          <Label for="summary">خلاصه</Label>
          <textarea
            id="summary"
            v-model="form.summary"
            rows="3"
            maxlength="320"
            :class="textarea"
          />
          <p class="text-xs text-muted-foreground">
            روی کارت مقاله و در نتیجهٔ جستجوی گوگل نمایش داده می‌شود. ({{
              form.summary.length.toLocaleString('fa-IR')
            }}
            از ۳۲۰)
          </p>
        </div>
        <div class="grid gap-2">
          <Label>متن مقاله</Label>
          <RichEditor v-model="form.body" />
        </div>
      </CardContent>
    </Card>

    <div class="grid content-start gap-6">
      <Card>
        <CardHeader><CardTitle>انتشار</CardTitle></CardHeader>
        <CardContent class="grid gap-5">
          <div class="grid gap-2">
            <Label for="slug">آدرس</Label>
            <Input
              id="slug"
              v-model="form.slug"
              dir="ltr"
              @input="slugTouched = true"
            />
            <p class="text-xs break-all text-muted-foreground" dir="ltr">
              falaknama.ir/articles/{{ form.slug || '…' }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="publishedAt">تاریخ انتشار</Label>
            <JalaliDateInput
              id="publishedAt"
              v-model="form.publishedAt"
              clearable
            />
            <p class="text-xs text-muted-foreground">
              خالی بماند تا هنگام انتشار، تاریخ امروز ثبت شود. تاریخ آینده یعنی
              انتشار زمان‌بندی‌شده.
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>تصویر شاخص</CardTitle></CardHeader>
        <CardContent><ImageField v-model="form.coverImage" /></CardContent>
      </Card>
    </div>
  </div>
</template>
