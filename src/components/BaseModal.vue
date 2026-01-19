<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-xl"
      >
        <i class="pi pi-times"></i>
      </button>
      <h2 v-if="title" class="text-xl font-bold mb-6 text-slate-900">{{ title }}</h2>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; title?: string }>();
defineEmits(['close']);
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease;
}
</style>
