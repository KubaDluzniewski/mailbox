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
            @click="router.push('/')"
          >
            <i
              class="pi pi-bell text-lg transition-transform group-hover:scale-110 group-hover:rotate-12"
            ></i>
            <span v-if="unreadCount > 0" class="absolute top-2 right-2 flex h-4 w-4">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </span>
          </button>

          <div class="h-8 w-px bg-slate-200 mx-2"></div>

          <div class="flex items-center gap-3 pl-2">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold leading-none">{{ userStore.user?.name }}</p>
              <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                {{ userRoleLabel }}
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
import { useMessageStore } from '../store/message';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const userStore = useUserStore();
const messageStore = useMessageStore();
const router = useRouter();
const { unreadCount } = storeToRefs(messageStore);

const userInitials = computed(() => {
  return (
    userStore.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
  );
});

const userRoleLabel = computed(() => {
  const roles = userStore.user?.roles || [];
  if (roles.length === 0) return 'Pracownik';

  const roleLabels = roles.map((role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'LECTURER':
        return 'Wykładowca';
      case 'STUDENT':
        return 'Student';
      default:
        return role;
    }
  });
  return roleLabels.join(', ');
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
