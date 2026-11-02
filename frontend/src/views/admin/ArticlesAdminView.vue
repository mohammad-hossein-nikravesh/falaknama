<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ExternalLink, Pencil, Plus, Trash2 } from '@lucide/vue';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import type { ArticleSummary, Page } from '@/lib/content';
import { toJalali } from '@/lib/site';

type Row = ArticleSummary & {
  status: 'draft' | 'published';
  updatedAt: string;
};

const PER_PAGE = 20;
const rows = ref<Row[]>([]);
const total = ref(0);
const page = ref(1);
const error = ref('');
const toRemove = ref<Row | null>(null);
const pages = computed(() => Math.ceil(total.value / PER_PAGE));

async function load() {
  error.value = '';
  try {
    const r = await api.get<Page<Row>>(
      `/articles?limit=${PER_PAGE}&offset=${(page.value - 1) * PER_PAGE}`,
    );
    rows.value = r.items;
    total.value = r.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'بارگذاری ناموفق بود';
  }
}
onMounted(load);

async function remove() {
  try {
    await api.delete(`/articles/${toRemove.value!._id}`);
    toRemove.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'حذف ناموفق بود';
  }
}

const isLive = (r: Row) =>
  r.status === 'published' && new Date(r.publishedAt) <= new Date();
</script>

<template>
  <div class="mb-6 flex items-center justify-between gap-4">
    <h1 class="text-2xl font-semibold">مقاله‌ها</h1>
    <Button as-child
      ><RouterLink to="/admin/articles/new"
        ><Plus /> مقالهٔ تازه</RouterLink
      ></Button
    >
  </div>
  <p v-if="error" role="alert" class="mb-4 text-sm text-destructive">
    {{ error }}
  </p>

  <Card>
    <CardContent class="pt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ انتشار</TableHead>
            <TableHead class="w-32"
              ><span class="sr-only">عملیات</span></TableHead
            >
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="r in rows" :key="r._id">
            <TableCell class="max-w-md truncate font-medium">{{
              r.title
            }}</TableCell>
            <TableCell>
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="
                  isLive(r)
                    ? 'bg-primary/10 text-primary'
                    : r.status === 'published'
                      ? 'bg-amber-500/10 text-amber-700'
                      : 'bg-muted text-muted-foreground'
                "
              >
                {{
                  isLive(r)
                    ? 'منتشرشده'
                    : r.status === 'published'
                      ? 'زمان‌بندی‌شده'
                      : 'پیش‌نویس'
                }}
              </span>
            </TableCell>
            <TableCell class="text-muted-foreground">{{
              r.publishedAt ? toJalali(r.publishedAt) : '—'
            }}</TableCell>
            <TableCell class="flex justify-end gap-1">
              <Button
                v-if="isLive(r)"
                variant="ghost"
                size="icon"
                as-child
                :aria-label="`دیدن ${r.title}`"
              >
                <a :href="`/articles/${r.slug}`" target="_blank"
                  ><ExternalLink class="size-4"
                /></a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                as-child
                :aria-label="`ویرایش ${r.title}`"
              >
                <RouterLink :to="`/admin/articles/${r._id}`"
                  ><Pencil class="size-4"
                /></RouterLink>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="`حذف ${r.title}`"
                @click="toRemove = r"
              >
                <Trash2 class="size-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="!rows.length">
            <TableCell colspan="4" class="text-center text-muted-foreground"
              >هنوز مقاله‌ای نوشته نشده است.</TableCell
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

  <AlertDialog
    :open="!!toRemove"
    @update:open="(open) => !open && (toRemove = null)"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>حذف «{{ toRemove?.title }}»؟</AlertDialogTitle>
        <AlertDialogDescription
          >این عمل قابل بازگشت نیست. اگر فقط می‌خواهی از سایت برداشته شود، آن را
          پیش‌نویس کن.</AlertDialogDescription
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
