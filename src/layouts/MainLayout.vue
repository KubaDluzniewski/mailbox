<template>
  <div class="flex h-screen overflow-hidden text-zinc-900">
    <aside class="w-[272px] shrink-0 border-r border-stone-200 bg-stone-50/95 backdrop-blur-[2px]">
      <NavBar />
    </aside>

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <header
        class="h-16 shrink-0 border-b border-stone-200 bg-stone-50/90 px-4 sm:px-6 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="h-2 w-2 rounded-full bg-zinc-900"></span>
          <p class="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Mailbox Workspace
          </p>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button
            class="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-stone-200 rounded-full relative transition-colors"
            @click="router.push('/')"
          >
            <i class="pi pi-bell text-base"></i>
            <span
              v-if="unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-semibold text-white"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <div class="h-7 w-px bg-stone-300"></div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold leading-none">{{ userStore.user?.name }}</p>
              <p class="text-[11px] text-zinc-500 mt-1 uppercase tracking-[0.14em]">
                {{ userRoleLabel }}
              </p>
            </div>
            <Avatar
              :label="userInitials"
              shape="circle"
              class="bg-zinc-900 text-white cursor-pointer"
              @click="router.push('/settings')"
            />
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-hidden p-3 sm:p-4 lg:p-6">
        <router-view v-slot="{ Component, route }">
          <Transition name="route" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
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
        return t('roles.admin');
      case 'LECTURER':
        return t('roles.lecturer');
      case 'STUDENT':
        return t('roles.student');
      default:
        return role;
    }
  });
  return roleLabels.join(', ');
});
</script>

<style scoped>
.route-enter-active,
.route-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
