<script setup lang="ts">
import { computed } from 'vue';
import {
  isoToJalali,
  jalaliMonths,
  jalaliToIso,
  monthLength,
  todayJalali,
} from '@/lib/jalali';

// A Jalali day picker bound to a Gregorian `YYYY-MM-DD` string (or null when `clearable` and empty).
const model = defineModel<string | null | undefined>();
const props = defineProps<{ id?: string; clearable?: boolean }>();

const field =
  'h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

const value = computed(() => (model.value ? isoToJalali(model.value) : null));
const thisYear = todayJalali().jy;
const years = computed(() => {
  const from = Math.min(thisYear - 3, value.value?.jy ?? thisYear);
  return Array.from({ length: thisYear + 3 - from + 1 }, (_, i) => from + i);
});
const days = computed(() =>
  value.value ? monthLength(value.value.jy, value.value.jm) : 31,
);

function set(part: 'jy' | 'jm' | 'jd', n: number) {
  const next = { ...(value.value ?? todayJalali()), [part]: n };
  next.jd = Math.min(next.jd, monthLength(next.jy, next.jm));
  model.value = jalaliToIso(next);
}
const num = (e: Event) => Number((e.target as HTMLSelectElement).value);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-if="value">
      <select
        :id="props.id"
        :class="field"
        aria-label="روز"
        :value="value.jd"
        @change="set('jd', num($event))"
      >
        <option v-for="d in days" :key="d" :value="d">
          {{ d.toLocaleString('fa-IR') }}
        </option>
      </select>
      <select
        :class="field"
        aria-label="ماه"
        :value="value.jm"
        @change="set('jm', num($event))"
      >
        <option v-for="(m, i) in jalaliMonths" :key="m" :value="i + 1">
          {{ m }}
        </option>
      </select>
      <select
        :class="field"
        aria-label="سال"
        :value="value.jy"
        @change="set('jy', num($event))"
      >
        <option v-for="y in years" :key="y" :value="y">
          {{ y.toLocaleString('fa-IR', { useGrouping: false }) }}
        </option>
      </select>
      <button
        v-if="clearable"
        type="button"
        class="text-xs text-muted-foreground hover:text-destructive"
        @click="model = null"
      >
        حذف تاریخ
      </button>
    </template>
    <button
      v-else
      :id="props.id"
      type="button"
      class="h-8 rounded-lg border border-dashed border-input px-3 text-sm text-muted-foreground hover:bg-muted"
      @click="model = jalaliToIso(todayJalali())"
    >
      انتخاب تاریخ
    </button>
  </div>
</template>
