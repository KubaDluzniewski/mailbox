<template>
  <RouterLink :to="to" custom v-slot="{ isActive, isExactActive, navigate, href }">
    <a :href="href" @click="navigate" class="no-underline block">
      <div
        :class="[
          'flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors font-medium',
          (exact ? isExactActive : isActive)
            ? 'bg-stone-100 border-stone-300 text-zinc-900'
            : 'border-transparent text-zinc-600 hover:bg-stone-100 hover:border-stone-200 hover:text-zinc-900',
        ]"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span
            :class="[
              'h-1.5 w-1.5 rounded-full',
              (exact ? isExactActive : isActive) ? 'bg-zinc-900' : 'bg-transparent',
            ]"
          ></span>
          <i :class="[icon, 'text-base']"></i>
          <span class="truncate">{{ label }}</span>
        </div>
        <span
          v-if="count"
          :class="[
            'text-[11px] px-2 py-0.5 rounded-full font-semibold',
            (exact ? isExactActive : isActive)
              ? 'bg-zinc-900 text-white'
              : 'bg-stone-200 text-zinc-600',
          ]"
          >{{ count }}</span
        >
      </div>
    </a>
  </RouterLink>
</template>
<script setup lang="ts">
defineProps<{ to: string; icon: string; label: string; count?: number; exact?: boolean }>();
</script>
