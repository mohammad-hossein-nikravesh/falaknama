<script setup lang="ts">
import { ref } from 'vue';
import { ImagePlus, X } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

// One uploaded image (saved on the server as WebP); v-model is its URL.
const model = defineModel<string | undefined>();
const input = ref<HTMLInputElement>();
const busy = ref(false);
const error = ref('');

async function pick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد';
    return;
  }
  busy.value = true;
  error.value = '';
  try {
    model.value = (
      await api.upload<{ url: string }>('/media/images', file, file.name)
    ).url;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود ناموفق بود';
  } finally {
    busy.value = false;
    input.value!.value = '';
  }
}
</script>

<template>
  <div class="grid gap-2">
    <div
      v-if="model"
      class="relative w-full max-w-sm overflow-hidden rounded-lg border"
    >
      <img :src="model" alt="" class="aspect-video w-full object-cover" />
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        class="absolute top-2 left-2"
        aria-label="حذف تصویر"
        @click="model = undefined"
      >
        <X />
      </Button>
    </div>
    <div>
      <Button
        type="button"
        variant="outline"
        :disabled="busy"
        @click="input?.click()"
      >
        <ImagePlus />
        {{ busy ? 'در حال آپلود…' : model ? 'تعویض تصویر' : 'انتخاب تصویر' }}
      </Button>
      <input
        ref="input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="pick"
      />
    </div>
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
