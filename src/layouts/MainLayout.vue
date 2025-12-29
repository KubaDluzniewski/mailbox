<template>
  <div class="min-h-screen flex bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50">
    <aside class="w-64 border-r border-slate-200/70 bg-white/70 backdrop-blur p-4">
      <NavBar />
    </aside>
    <main class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <router-view />
      </div>
    </main>


    <div v-if="!isUserActive" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">{{ t('activation.title') }}</h2>
        <p class="mb-4">{{ t('activation.description') }}</p>
        <form @submit.prevent="activateAccount">
          <label for="email" class="block text-sm font-medium mb-2">{{ t('activation.emailLabel') }}</label>
          <input
            id="email"
            v-model="activationEmail"
            type="email"
            class="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <div class="flex justify-end gap-2">
            <button type="submit" :disabled="activating" class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
              {{ activating ? t('activation.sending') : t('activation.send') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '../store/user';
import { activate } from '../services/auth.service';
import { isActive } from '../services/auth.service';
import { useToastStore } from '../store/toast';

const { t } = useI18n();
const userStore = useUserStore();
const toast = useToastStore();

const user = computed(() => userStore.user);
const activationEmail = computed(() => user.value?.email || '');
const activating = ref(false);
const isUserActive = ref(true); // Assume active until checked

// Check isActive when user changes
watch(user, async (newUser) => {
  if (newUser && newUser.email) {
    try {
      const active = await isActive(newUser.email);
      isUserActive.value = active;
    } catch (error) {
      console.error('Error checking isActive:', error);
      isUserActive.value = true; // Default to active on error
    }
  } else {
    isUserActive.value = true;
  }
}, { immediate: true });

async function activateAccount() {
  activating.value = true;
  try {
    await activate(activationEmail.value);
    toast.push('success', 'Email aktywacyjny został wysłany.');
  } catch (error) {
    toast.push('error', 'Błąd wysyłania emaila.');
  } finally {
    activating.value = false;
  }
}
</script>
