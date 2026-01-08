<template>
  <nav class="space-y-4">
    <h1 class="text-xl font-semibold text-slate-700">Mailbox</h1>
    <ul class="flex flex-col gap-1">
      <li>
        <RouterLink class="nav-link" to="/compose">{{ t('main.compose') }}</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-link" to="/">{{ t('main.received') }}</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-link" to="/sent">{{ t('main.sent') }}</RouterLink>
      </li>
      <li>
        <RouterLink class="nav-link" to="/drafts">{{ t('main.drafts') }}</RouterLink>
      </li>
    </ul>
    <button
      type="button"
      class="w-full mt-4 bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700 shadow-sm"
      @click="logOut"
    >
      {{ t('logout') }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../store/user';
import router from '../router';

const { t } = useI18n();

function logOut() {
  useUserStore().logout();
  router.push('/login');
}
</script>

<style scoped>
.nav-link {
  display: block;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  color: #334155;
}
.nav-link:hover {
  background-color: #eef2ff;
}
.router-link-exact-active.nav-link {
  background-color: #e0e7ff;
  color: #3730a3;
  font-weight: 600;
}
</style>
