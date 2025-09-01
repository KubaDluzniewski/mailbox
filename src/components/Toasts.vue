<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="rounded-lg shadow border p-3 flex items-start gap-2"
      :class="wrapType(t.type)"
    >
      <div class="text-sm leading-5 flex-1">{{ t.message }}</div>
      <button class="text-xs opacity-70 hover:opacity-100" aria-label="Close" @click="remove(t.id)">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useToastStore, type ToastType } from '../store/toast';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const remove = (id: number) => toastStore.remove(id);

function wrapType(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    case 'error':
      return 'bg-rose-50 border-rose-200 text-rose-800';
    case 'warning':
      return 'bg-amber-50 border-amber-200 text-amber-800';
    default:
      return 'bg-sky-50 border-sky-200 text-sky-800';
  }
}
</script>

<style scoped></style>
