<template>
  <div class="min-h-screen text-slate-800 relative overflow-hidden">
    <!-- Subtle gradient background -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10"></div>
    <div
      class="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.08),transparent_50%)] -z-10"
    ></div>
    <div
      class="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(100,116,139,0.05),transparent_50%)] -z-10"
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
const { locale, t } = useI18n();

watch(
  () => appStore.lang,
  (newLang) => {
    locale.value = newLang;
  },
  { immediate: true }
);
</script>
