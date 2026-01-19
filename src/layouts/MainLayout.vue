<template>
  <div class="flex h-screen font-sans text-slate-900 overflow-hidden">
    <aside
      class="w-72 glass-effect border-r border-white/50 flex flex-col transition-all duration-300 z-30 shadow-xl"
    >
      <NavBar />
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-16 glass-effect border-b border-white/50 flex items-center justify-between px-8 shrink-0 shadow-sm"
      >
        <div class="flex-1 max-w-2xl">
          <div class="relative group"></div>
        </div>

        <div class="flex items-center gap-4 ml-4">
          <button
            class="p-2 text-slate-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-full relative transition-all hover-lift group"
          >
            <i
              class="pi pi-bell text-lg transition-transform group-hover:scale-110 group-hover:rotate-12"
            ></i>
            <span
              class="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white animate-pulse-glow"
            ></span>
          </button>

          <div class="h-8 w-px bg-slate-200 mx-2"></div>

          <div class="flex items-center gap-3 pl-2">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold leading-none">{{ userStore.user?.name }}</p>
              <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                Pracownik
              </p>
            </div>
            <Avatar
              :label="userInitials"
              shape="circle"
              class="bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg hover-glow cursor-pointer transition-all hover:scale-110"
            />
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-hidden p-6">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>
    </div>
    <Toasts />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../store/user';

const { t } = useI18n();
const userStore = useUserStore();

const userInitials = computed(() => {
  return (
    userStore.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
  );
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
