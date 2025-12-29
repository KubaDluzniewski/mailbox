<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-sky-50 p-6">
    <div class="w-full max-w-sm space-y-4 bg-white/90 backdrop-blur rounded-xl shadow p-6 border border-slate-200">
      <h1 class="text-xl font-bold text-center">Potwierdzenie konta</h1>
      <p v-if="!confirmed && !error" class="text-center">Potwierdzanie konta...</p>
      <p v-if="confirmed" class="text-center text-green-600">Konto zostało potwierdzone! Możesz się zalogować.</p>
      <p v-if="error" class="text-center text-red-600">{{ error }}</p>
      <router-link v-if="confirmed" to="/login" class="block text-center bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700">
        Przejdź do logowania
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirm } from '../services/auth.service';

const route = useRoute();
const router = useRouter();

const confirmed = ref(false);
const error = ref('');

onMounted(async () => {
  const token = route.query.token as string;
  const email = route.query.email as string;

  if (!token || !email) {
    error.value = 'Brakujący token lub email.';
    return;
  }

  try {
    await confirm(email, token);
    confirmed.value = true;
  } catch (e: any) {
    error.value = e?.message || 'Błąd potwierdzenia.';
  }
});
</script>