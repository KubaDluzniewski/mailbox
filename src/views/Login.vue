<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Subtle gradient background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.08),transparent_50%)] -z-10"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(100,116,139,0.05),transparent_50%)] -z-10"
    ></div>

    <div
      class="w-full max-w-md glass-effect backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative z-10 overflow-hidden"
    >
      <!-- Header with logo -->
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-8 text-center relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        ></div>
        <div class="relative z-10">
          <div
            class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <i class="pi pi-envelope text-3xl text-slate-700"></i>
          </div>
          <h1 class="text-3xl font-black text-white mb-2">Mailbox</h1>
          <p class="text-slate-300 text-sm">{{ t('loginPage.welcome') }}</p>
        </div>
      </div>

      <!-- Login form -->
      <form class="p-8 space-y-6" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">{{ t('email') }}</label>
          <div class="relative">
            <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="email"
              type="email"
              class="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all hover:border-slate-400 bg-white"
              :placeholder="t('input.email')"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">{{ t('password') }}</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full border border-slate-300 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all hover:border-slate-400 bg-white"
              :placeholder="t('input.password')"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center cursor-pointer group">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-400 focus:ring-2 cursor-pointer"
            />
            <span
              class="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors"
              >{{ t('login.rememberMe') }}</span
            >
          </label>
          <a
            href="#"
            class="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >{{ t('loginPage.forgotPassword') }}</a
          >
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl px-4 py-4 disabled:opacity-60 shadow-lg hover-glow transition-all transform hover:scale-[1.02] font-bold relative overflow-hidden group"
          :disabled="loading"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
          ></div>
          <span class="relative z-10 flex items-center justify-center gap-2">
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span>{{ loading ? t('loginPage.loggingIn') : t('login') }}</span>
          </span>
        </button>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex items-center gap-2 text-red-700">
            <i class="pi pi-exclamation-circle"></i>
            <p class="text-sm font-medium">{{ error }}</p>
          </div>
        </div>
      </form>

      <!-- Footer -->
      <div class="px-8 pb-8 text-center">
        <p class="text-xs text-slate-500">
          {{ t('loginPage.footer') }}
        </p>
      </div>
    </div>
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
const rememberMe = ref(false);
const showPassword = ref(false);

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
