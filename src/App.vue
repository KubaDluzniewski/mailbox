<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
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
