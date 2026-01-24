<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Backgrounds -->
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
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-8 text-center relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        ></div>
        <div class="relative z-10">
          <div
            class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <i class="pi pi-user-plus text-3xl text-slate-700"></i>
          </div>
          <h1 class="text-3xl font-black text-white mb-2">{{ t('register.title') }}</h1>
        </div>
      </div>

      <!-- Form -->
      <form class="p-8 space-y-5" @submit.prevent="onSubmit">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-slate-700">{{
              t('register.name')
            }}</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2 text-slate-700">{{
              t('register.surname')
            }}</label>
            <input
              v-model="form.surname"
              type="text"
              class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">{{ t('email') }}</label>
          <div class="relative">
            <i class="pi pi-at absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="form.email"
              type="email"
              class="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">{{ t('password') }}</label>
          <Password
            v-model="form.password"
            toggleMask
            class="w-full"
            inputClass="w-full p-3 border border-slate-300 rounded-xl"
            :promptLabel="t('passwordStrength.prompt')"
            :weakLabel="t('passwordStrength.weak')"
            :mediumLabel="t('passwordStrength.medium')"
            :strongLabel="t('passwordStrength.strong')"
          >
            <template #header>
              <h6 class="mb-2 text-xs font-bold text-slate-700">Wskazówka</h6>
            </template>
            <template #footer>
              <div class="mt-2 text-xs text-slate-500">Minimum 6 znaków.</div>
            </template>
          </Password>
        </div>

        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">{{
            t('register.code')
          }}</label>
          <div class="relative">
            <i class="pi pi-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="form.registrationCode"
              type="text"
              class="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl px-4 py-4 shadow-lg hover-glow transition-all transform hover:scale-[1.02] font-bold mt-4"
          :disabled="loading"
        >
          <span v-if="loading"><i class="pi pi-spinner pi-spin mr-2"></i></span>
          {{ t('register.submit') }}
        </button>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <p class="text-sm font-medium text-red-700">{{ error }}</p>
        </div>

        <div class="text-center pt-2">
          <router-link
            to="/login"
            class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {{ t('register.backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { register } from '../services/auth.service';
import { useToastStore } from '../store/toast';
import Password from 'primevue/password';

const { t } = useI18n();
const router = useRouter();
const toast = useToastStore();

const form = reactive({
  name: '',
  surname: '',
  email: '',
  password: '',
  registrationCode: '',
});

const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  loading.value = true;
  error.value = null;

  if (form.password.length < 6) {
    error.value = 'Hasło jest za krótkie.';
    loading.value = false;
    return;
  }

  try {
    await register(form);
    toast.push('success', t('register.success'));
    router.push('/login');
  } catch (e: any) {
    console.error('Registration error:', e);
    const data = e?.response?.data;
    if (data) {
      if (typeof data === 'string') {
        error.value = data;
      } else if (data.message) {
        error.value = data.message;
      } else if (data.title) {
        error.value = data.title;
        if (data.errors) {
          // Append validation errors if any
          const details = Object.values(data.errors).flat().join(', ');
          if (details) error.value += `: ${details}`;
        }
      } else {
        error.value = 'Błąd rejestracji. Sprawdź kod lub spróbuj ponownie.';
      }
    } else {
      error.value = 'Błąd połączenia z serwerem.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.9);
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>
