<template>
  <RouterLink :to="to" v-slot="{ isActive }" class="no-underline">
    <div
      :class="[
        'flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold relative overflow-hidden group',
        isActive
          ? 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 shadow-sm'
          : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 hover:text-slate-900 hover-lift',
      ]"
    >
      <!-- Active indicator -->
      <div
        v-if="isActive"
        class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-full"
      ></div>

      <div class="flex items-center gap-3 relative z-10">
        <i :class="[icon, 'text-lg transition-transform group-hover:scale-110']"></i>
        <span>{{ label }}</span>
      </div>
      <span
        v-if="count"
        :class="[
          'text-xs px-2 py-0.5 rounded-full font-bold transition-all',
          isActive
            ? 'bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800'
            : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700',
        ]"
        >{{ count }}</span
      >
    </div>
  </RouterLink>
</template>
<script setup lang="ts">
defineProps<{ to: string; icon: string; label: string; count?: number }>();
</script>
<script lang="ts">
export default {};
</script>
