<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from '@lucide/vue';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import type { Faq } from '@/lib/content';

type Row = Faq & { order: number };

const rows = ref<Row[]>([]);
const error = ref('');
const busy = ref(false);
const editing = ref<string | null>(null);
const toRemove = ref<Row | null>(null);
const form = ref({ question: '', answer: '' });

const textarea =
  'w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm leading-7 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

const load = async () => {
  rows.value = await api.get<Row[]>('/faqs');
};
onMounted(() =>
  load().catch(
    (e) =>
      (error.value = e instanceof Error ? e.message : 'بارگذاری ناموفق بود'),
  ),
);

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

function edit(r: Row) {
  editing.value = r._id;
  form.value = { question: r.question, answer: r.answer };
}
function reset() {
  editing.value = null;
  form.value = { question: '', answer: '' };
}

const save = () =>
  run(async () => {
    if (editing.value) await api.patch(`/faqs/${editing.value}`, form.value);
    else {
      const last = rows.value.at(-1)?.order ?? -1;
      await api.post('/faqs', { ...form.value, order: last + 1 });
    }
    reset();
    await load();
  });

/** Swaps display order with the neighbour. */
const move = (i: number, dir: -1 | 1) =>
  run(async () => {
    const a = rows.value[i]!;
    const b = rows.value[i + dir]!;
    // Distinct values even if two share an order.
    const [oa, ob] = a.order === b.order ? [i + dir, i] : [b.order, a.order];
    await Promise.all([
      api.patch(`/faqs/${a._id}`, { order: oa }),
      api.patch(`/faqs/${b._id}`, { order: ob }),
    ]);
    await load();
  });

const remove = () =>
  run(async () => {
    await api.delete(`/faqs/${toRemove.value!._id}`);
    toRemove.value = null;
    await load();
  });
</script>

<template>
  <h1 class="mb-6 text-2xl font-semibold">پرسش‌های پرتکرار</h1>
  <p v-if="error" role="alert" class="mb-4 text-sm text-destructive">
    {{ error }}
  </p>

  <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
    <div class="grid content-start gap-3">
      <Card v-for="(r, i) in rows" :key="r._id">
        <CardContent class="flex gap-3 pt-6">
          <div class="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              :disabled="i === 0 || busy"
              aria-label="بالاتر"
              @click="move(i, -1)"
              ><ArrowUp
            /></Button>
            <Button
              variant="ghost"
              size="icon-sm"
              :disabled="i === rows.length - 1 || busy"
              aria-label="پایین‌تر"
              @click="move(i, 1)"
              ><ArrowDown
            /></Button>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ r.question }}</p>
            <p
              class="mt-1 line-clamp-2 text-sm leading-7 text-muted-foreground"
            >
              {{ r.answer }}
            </p>
          </div>
          <div class="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="ویرایش"
              @click="edit(r)"
              ><Pencil class="size-4"
            /></Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="حذف"
              @click="toRemove = r"
              ><Trash2 class="size-4"
            /></Button>
          </div>
        </CardContent>
      </Card>
      <p v-if="!rows.length" class="text-muted-foreground">
        هنوز پرسشی ثبت نشده است.
      </p>
    </div>

    <Card class="self-start">
      <CardHeader
        ><CardTitle>{{
          editing ? 'ویرایش پرسش' : 'پرسش تازه'
        }}</CardTitle></CardHeader
      >
      <CardContent>
        <form class="grid gap-4" @submit.prevent="save">
          <div class="grid gap-2">
            <Label for="q">پرسش</Label>
            <Input id="q" v-model="form.question" required minlength="5" />
          </div>
          <div class="grid gap-2">
            <Label for="a">پاسخ</Label>
            <textarea
              id="a"
              v-model="form.answer"
              rows="6"
              maxlength="1500"
              required
              :class="textarea"
            />
          </div>
          <div class="flex gap-2">
            <Button type="submit" :disabled="busy" class="flex-1">{{
              editing ? 'ذخیره' : 'افزودن'
            }}</Button>
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
        <AlertDialogTitle>حذف این پرسش؟</AlertDialogTitle>
        <AlertDialogDescription>{{
          toRemove?.question
        }}</AlertDialogDescription>
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
