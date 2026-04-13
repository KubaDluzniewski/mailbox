<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[1px] p-4"
      @click="$emit('close')"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-lg relative animate-fade-in"
        @click.stop
      >
        <div v-if="title" class="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-zinc-900 leading-tight">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 transition-colors"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <button
          v-else
          @click="$emit('close')"
          class="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 transition-colors"
        >
          <i class="pi pi-times"></i>
        </button>

        <div :class="['px-5 pb-5', title ? 'pt-5' : 'pt-12']">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; title?: string }>();
defineEmits(['close']);
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in 0.2s ease;
}
</style>
