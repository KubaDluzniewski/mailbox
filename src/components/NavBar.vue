<template>
  <div class="p-5 flex flex-col h-full">
    <div class="flex items-center gap-3 mb-7 px-1">
      <div class="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
        <i class="pi pi-send text-sm"></i>
      </div>
      <div>
        <p class="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Workspace</p>
        <span class="text-xl font-semibold tracking-tight text-zinc-900">Mailbox</span>
      </div>
    </div>

    <RouterLink to="/compose" class="no-underline">
      <button
        class="w-full mb-7 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <i class="pi pi-plus text-xs"></i>
        <span>{{ t('main.compose') }}</span>
      </button>
    </RouterLink>

    <nav class="flex-1 space-y-1.5">
      <NavItem to="/" exact icon="pi pi-inbox" :label="t('main.received')" :count="unreadCount" />
      <NavItem to="/sent" icon="pi pi-send" :label="t('main.sent')" />
      <NavItem to="/drafts" icon="pi pi-file" :label="t('main.drafts')" :count="draftsCount" />

      <div class="pt-6 pb-1 px-1">
        <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">
          {{ t('main.settings') }}
        </span>
      </div>
      <NavItem to="/settings" icon="pi pi-cog" :label="t('main.settings')" />
      <NavItem
        v-if="userStore.user?.roles?.includes(UserRole.ADMIN)"
        to="/users"
        icon="pi pi-users"
        :label="t('nav.users')"
      />
      <NavItem
        v-if="userStore.user?.roles?.includes(UserRole.ADMIN)"
        to="/history"
        icon="pi pi-history"
        :label="t('nav.messageHistory')"
      />
      <NavItem
        v-if="userStore.user?.roles?.includes(UserRole.ADMIN)"
        to="/groups"
        icon="pi pi-users"
        :label="t('nav.groups')"
      />
    </nav>

    <div class="mt-auto pt-5 border-t border-stone-200">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium hover-lift"
      >
        <i class="pi pi-power-off"></i>
        {{ t('logout') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { UserRole } from '../models/UserModel';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

import { onMounted, onUnmounted } from 'vue';
import { useMessageStore } from '../store/message';
import { storeToRefs } from 'pinia';

const messageStore = useMessageStore();
const { unreadCount, draftsCount } = storeToRefs(messageStore);

let refreshTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  messageStore.fetchCounts();
  refreshTimer = setInterval(() => messageStore.fetchCounts(), 30000);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>
