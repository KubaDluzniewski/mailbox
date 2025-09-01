<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-sky-50 p-6"
  >
    <form
      class="w-full max-w-sm space-y-4 bg-white/90 backdrop-blur rounded-xl shadow p-6 border border-slate-200"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-700">{{ t('email') }}</label>
        <input
          v-model="email"
          type="email"
          class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          :placeholder="t('input.email')"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1 text-slate-700">{{ t('password') }}</label>
        <input
          v-model="password"
          type="password"
          class="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          :placeholder="t('input.password')"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700 disabled:opacity-60 shadow"
        :disabled="loading"
      >
        {{ loading ? '...' : t('login') }}
      </button>
      <p class="text-xs text-slate-500">TODO: login with SSO</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { login } from '../services/auth.service';

const { t } = useI18n();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await login(email.value, password.value);
  } catch (e: any) {
    error.value = e?.message || t('errors.login-error');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
