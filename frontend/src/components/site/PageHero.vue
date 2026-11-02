<script setup lang="ts">
import StarField from './StarField.vue';

defineProps<{ eyebrow?: string; title: string; subtitle?: string }>();
</script>

<template>
  <section
    class="relative overflow-hidden bg-gradient-to-b from-[#120922] via-[#24143d] to-[#b5838d] pt-36 pb-28 text-center"
  >
    <StarField
      class="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
    />
    <div class="relative mx-auto max-w-3xl px-4 sm:px-6">
      <span v-if="eyebrow" v-reveal class="fn-eyebrow text-[#f3e8ff]">{{
        eyebrow
      }}</span>
      <h1
        v-reveal="0.1"
        class="mt-5 text-3xl leading-[1.5] font-black sm:text-5xl sm:leading-[1.4]"
      >
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        v-reveal="0.2"
        class="mx-auto mt-5 max-w-2xl leading-8 text-[#f3e8ff]/80"
      >
        {{ subtitle }}
      </p>
      <slot />
    </div>
  </section>
  <div
    class="h-16 bg-gradient-to-b from-[#b5838d] to-[#f3e8ff]"
    aria-hidden="true"
  />
</template>
