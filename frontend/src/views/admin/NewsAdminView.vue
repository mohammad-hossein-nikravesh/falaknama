<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Pencil, Trash2 } from '@lucide/vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ImageField from '@/components/admin/ImageField.vue';
import JalaliDateInput from '@/components/admin/JalaliDateInput.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import type { NewsItem, Page } from '@/lib/content';
import { jalaliToIso, todayJalali } from '@/lib/jalali';
import { jalaliRange } from '@/lib/site';

const PER_PAGE = 20;
const rows = ref<NewsItem[]>([]);
const total = ref(0);
const page = ref(1);
const pages = computed(() => Math.ceil(total.value / PER_PAGE));
const error = ref('');
const busy = ref(false);
const editing = ref<string | null>(null);
const toRemove = ref<NewsItem | null>(null);

const blank = () => ({
  title: '',
  body: '',
  image: undefined as string | undefined,
  startsAt: jalaliToIso(todayJalali()) as string | null,
  endsAt: null as string | null,
});
const form = ref(blank());

const textarea =
  'w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm leading-7 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

async function load() {
  const r = await api.get<Page<NewsItem>>(
    `/news?limit=${PER_PAGE}&offset=${(page.value - 1) * PER_PAGE}`,
  );
  rows.value = r.items;
  total.value = r.total;
}
onMounted(() =>
  load().catch(
    (e) =>
      (error.value = e instanceof Error ? e.message : 'بارگذاری ناموفق بود'),
  ),
);

const isPast = (n: NewsItem) =>
  new Date(n.endsAt ?? n.startsAt).getTime() + 86_400_000 < Date.now();

function edit(n: NewsItem) {
  editing.value = n._id;
  form.value = {
    title: n.title,
    body: n.body,
    image: n.image,
    startsAt: n.startsAt,
    endsAt: n.endsAt ?? null,
  };
}
function reset() {
  editing.value = null;
  form.value = blank();
}

async function run(action: () => Promise<void>) {
  busy.value = true;
  error.value = '';
  try {
    await action();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'درخواست ناموفق بود';
  } finally {
    busy.value = false;
  }
}

const save = () =>
  run(async () => {
    const { image, ...rest } = form.value;
    if (editing.value)
      await api.patch(`/news/${editing.value}`, {
        ...rest,
        image: image ?? null,
      });
    else await api.post('/news', { ...rest, ...(image && { image }) });
    reset();
    await load();
  });

const remove = () =>
  run(async () => {
    await api.delete(`/news/${toRemove.value!._id}`);
    if (editing.value === toRemove.value!._id) reset();
    toRemove.value = null;
    await load();
  });
</script>

<template>
  <h1 class="mb-2 text-2xl font-semibold">اخبار آسمان</h1>
  <p class="mb-6 text-sm text-muted-foreground">
    هر خبر تا یک روز پس از تاریخ پایانش (یا تاریخ خودش اگر یک‌روزه است) روی
    صفحهٔ اصلی می‌ماند و پس از آن فقط در آرشیو اخبار دیده می‌شود.
  </p>
  <p v-if="error" role="alert" class="mb-4 text-sm text-destructive">
    {{ error }}
  </p>

  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
    <Card>
      <CardContent class="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead class="w-24"
                ><span class="sr-only">عملیات</span></TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="n in rows"
              :key="n._id"
              :class="isPast(n) && 'opacity-60'"
            >
              <TableCell class="max-w-xs truncate font-medium">{{
                n.title
              }}</TableCell>
              <TableCell class="text-muted-foreground">
                {{ jalaliRange(n.startsAt, n.endsAt) }}
                <span v-if="isPast(n)" class="ms-1 text-xs">(گذشته)</span>
              </TableCell>
              <TableCell class="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  :aria-label="`ویرایش ${n.title}`"
                  @click="edit(n)"
                  ><Pencil class="size-4"
                /></Button>
                <Button
                  variant="ghost"
                  size="icon"
                  :aria-label="`حذف ${n.title}`"
                  @click="toRemove = n"
                  ><Trash2 class="size-4"
                /></Button>
              </TableCell>
            </TableRow>
            <TableRow v-if="!rows.length">
              <TableCell colspan="3" class="text-center text-muted-foreground"
                >هنوز خبری ثبت نشده است.</TableCell
              >
            </TableRow>
          </TableBody>
        </Table>
        <div v-if="pages > 1" class="mt-4 flex justify-center gap-2">
          <Button
            v-for="p in pages"
            :key="p"
            size="sm"
            :variant="p === page ? 'default' : 'outline'"
            @click="
              page = p;
              load();
            "
          >
            {{ p.toLocaleString('fa-IR') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="self-start">
      <CardHeader
        ><CardTitle>{{
          editing ? 'ویرایش خبر' : 'خبر تازه'
        }}</CardTitle></CardHeader
      >
      <CardContent>
        <form class="grid gap-4" @submit.prevent="save">
          <div class="grid gap-2">
            <Label for="n-title">عنوان</Label>
            <Input id="n-title" v-model="form.title" required minlength="3" />
          </div>
          <div class="grid gap-2">
            <Label for="n-body">متن کوتاه</Label>
            <textarea
              id="n-body"
              v-model="form.body"
              rows="5"
              maxlength="800"
              required
              :class="textarea"
            />
          </div>
          <div class="grid gap-2">
            <Label for="n-start">تاریخ (یا شروع)</Label>
            <JalaliDateInput id="n-start" v-model="form.startsAt" />
          </div>
          <div class="grid gap-2">
            <Label for="n-end"
              >تاریخ پایان
              <span class="text-muted-foreground"
                >(برای رویدادهای چندروزه)</span
              ></Label
            >
            <JalaliDateInput id="n-end" v-model="form.endsAt" clearable />
          </div>
          <div class="grid gap-2">
            <Label
              >تصویر <span class="text-muted-foreground">(اختیاری)</span></Label
            >
            <ImageField v-model="form.image" />
          </div>
          <div class="flex gap-2">
            <Button
              type="submit"
              :disabled="busy || !form.startsAt"
              class="flex-1"
              >{{ editing ? 'ذخیره' : 'افزودن خبر' }}</Button
            >
            <Button
              v-if="editing"
              type="button"
              variant="outline"
              @click="reset"
              >انصراف</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </div>

  <AlertDialog
    :open="!!toRemove"
    @update:open="(open) => !open && (toRemove = null)"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>حذف «{{ toRemove?.title }}»؟</AlertDialogTitle>
        <AlertDialogDescription
          >خبر از صفحهٔ اصلی و آرشیو حذف می‌شود و قابل بازگشت
          نیست.</AlertDialogDescription
        >
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>انصراف</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="remove"
          >حذف</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
