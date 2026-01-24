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
              >{{ t('loginPage.rememberMe') }}</span
            >
          </label>

          <button
            type="button"
            @click="forgotPassword"
            class="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors focus:outline-none flex items-center gap-2"
            :disabled="loadingReset"
          >
            <i v-if="loadingReset" class="pi pi-spinner pi-spin"></i>
            {{ loadingReset ? 'Wysyłanie...' : t('loginPage.forgotPassword') }}
          </button>
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

    <!-- Activation Modal -->
    <BaseModal
      :visible="showActivationModal"
      :title="t('activation.title')"
      @close="showActivationModal = false"
    >
      <p class="text-slate-600 mb-4">{{ t('activation.description') }}</p>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2 text-slate-700">{{
          t('activation.emailLabel')
        }}</label>
        <input
          v-model="activationEmail"
          type="email"
          readonly
          class="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-100 cursor-not-allowed focus:outline-none"
        />
        <p class="text-xs text-slate-500 mt-1">
          Link aktywacyjny zostanie wysłany na powyższy adres.
        </p>
      </div>
      <button
        @click="sendActivationEmail"
        class="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl px-4 py-3 font-bold disabled:opacity-60"
        :disabled="loadingActivation"
      >
        <i v-if="loadingActivation" class="pi pi-spinner pi-spin mr-2"></i>
        {{ loadingActivation ? t('activation.sending') : t('activation.send') }}
      </button>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  login,
  forgotPassword as forgotPasswordService,
  activate,
  isActive,
} from '../services/auth.service';
import { useToastStore } from '../store/toast';
import BaseModal from '../components/BaseModal.vue';

const { t } = useI18n();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const rememberMe = ref(false);
const showPassword = ref(false);

const loadingReset = ref(false);
const showActivationModal = ref(false);
const activationEmail = ref('');
const loadingActivation = ref(false);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    // First check if account is active
    const accountActive = await isActive(email.value);
    if (!accountActive) {
      // Show activation modal
      activationEmail.value = email.value;
      showActivationModal.value = true;
      loading.value = false;
      return;
    }
    await login(email.value, password.value, rememberMe.value);
  } catch (e: any) {
    error.value = e?.message || t('errors.login-error');
  } finally {
    loading.value = false;
  }
}

async function sendActivationEmail() {
  if (!activationEmail.value) return;
  loadingActivation.value = true;
  try {
    await activate(activationEmail.value, false);
    useToastStore().push('success', t('activation.activationEmailSent'), 5000);
    showActivationModal.value = false;
  } catch (e) {
    useToastStore().push('error', t('activation.activationEmailError'), 5000);
  } finally {
    loadingActivation.value = false;
  }
}

async function forgotPassword() {
  if (!email.value) {
    useToastStore().push(
      'warning',
      'Wpisz swój adres email w pole powyżej, aby zresetować hasło.',
      5000
    );
    return;
  }

  loadingReset.value = true;
  try {
    useToastStore().push('info', 'Przetwarzanie...', 2000); // Immediate feedback
    await forgotPasswordService(email.value);
    useToastStore().push('success', 'Jeśli konto istnieje, wysłano link resetujący.', 5000);
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Błąd połączenia z serwerem';
    useToastStore().push('error', `Błąd: ${msg}`, 5000);
  } finally {
    loadingReset.value = false;
  }
}
</script>

<style scoped></style>
