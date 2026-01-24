<template>
  <div class="p-6 flex flex-col h-full relative">
    <!-- Gradient overlay for sidebar -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 -z-10"
    ></div>

    <div class="flex items-center gap-3 mb-10 px-2">
      <div
        class="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg hover-glow animate-float"
      >
        <i class="pi pi-send text-xl"></i>
      </div>
      <span class="text-2xl font-black tracking-tight gradient-text"> Mailbox </span>
    </div>

    <RouterLink to="/compose" class="no-underline">
      <button
        class="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:scale-105 shadow-xl hover-glow mb-8 relative overflow-hidden group"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
        ></div>
        <i class="pi pi-plus text-sm relative z-10"></i>
        <span class="relative z-10">{{ t('main.compose') }}</span>
      </button>
    </RouterLink>

    <nav class="flex-1 space-y-2">
      <NavItem to="/" exact icon="pi pi-inbox" :label="t('main.received')" :count="unreadCount" />
      <NavItem to="/sent" icon="pi pi-send" :label="t('main.sent')" />
      <NavItem to="/drafts" icon="pi pi-file" :label="t('main.drafts')" :count="draftsCount" />

      <div class="pt-8 pb-2 px-4">
        <span class="text-xs font-black text-slate-400 uppercase tracking-widest">{{
          t('main.settings')
        }}</span>
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
    </nav>

    <div class="mt-auto pt-6 border-t border-slate-100">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium hover-lift"
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
import NavItem from './NavItem.vue';
import { useUserStore } from '../store/user';
import { UserRole } from '../models/UserModel';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

import { ref, onMounted } from 'vue';
import { useMessageStore } from '../store/message';
import { storeToRefs } from 'pinia';

const messageStore = useMessageStore();
const { inboxCount, unreadCount, draftsCount } = storeToRefs(messageStore);

onMounted(() => {
  messageStore.fetchCounts();
  setInterval(() => messageStore.fetchCounts(), 30000); // odświeżaj co 30 sekund
});

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>
