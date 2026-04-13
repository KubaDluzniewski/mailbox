<template>
  <div class="min-h-screen text-zinc-900 relative overflow-hidden">
    <div class="fixed inset-0 -z-20 bg-stone-100"></div>
    <div
      class="fixed inset-0 -z-10 opacity-30"
      style="
        background-image:
          linear-gradient(rgba(24, 24, 27, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(24, 24, 27, 0.05) 1px, transparent 1px);
        background-size: 34px 34px;
      "
    ></div>
    <div
      class="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.88),transparent_58%)]"
    ></div>

    <router-view />
    <Toasts />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useAppStore } from './store/app';
import { watch } from 'vue';
import Toasts from './components/Toasts.vue';

const appStore = useAppStore();
const { locale } = useI18n();

watch(
  () => appStore.lang,
  (newLang) => {
    locale.value = newLang;
  },
  { immediate: true }
);
</script>
