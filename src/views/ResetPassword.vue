<template>
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 -z-10"
    ></div>
    <div
      class="w-full max-w-md glass-effect backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative z-10 overflow-hidden"
    >
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-8 text-center relative">
        <h1 class="text-3xl font-black text-white mb-2">Reset Hasła</h1>
      </div>

      <form class="p-8 space-y-6" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-bold mb-2 text-slate-700">Nowe hasło</label>
          <div class="relative">
            <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="password"
              type="password"
              class="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all hover:border-slate-400 bg-white"
              required
              minlength="6"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl px-4 py-4 disabled:opacity-60 shadow-lg hover-glow transition-all transform hover:scale-[1.02] font-bold relative overflow-hidden group"
          :disabled="loading"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <i v-if="loading" class="pi pi-spinner pi-spin"></i>
            <span>{{ loading ? 'Zmieniam...' : 'Zmień hasło' }}</span>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '../services/auth.service';
import { useToastStore } from '../store/toast';

const route = useRoute();
const router = useRouter();
const password = ref('');
const loading = ref(false);

const email = route.query.email as string;
const token = route.query.token as string;

onMounted(() => {
  if (!email || !token) {
    useToastStore().push('error', 'Nieprawidłowy link resetujący.');
    router.push('/login');
  }
});

async function onSubmit() {
  loading.value = true;
  try {
    await resetPassword(email, token, password.value);
    useToastStore().push('success', 'Hasło zostało zmienione. Zaloguj się.');
    router.push('/login');
  } catch (e: any) {
    useToastStore().push(
      'error',
      'Błąd podczas zmiany hasła (token wygasł lub jest nieprawidłowy).'
    );
  } finally {
    loading.value = false;
  }
}
</script>
