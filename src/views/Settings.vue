<template>
  <div class="flex h-full gap-6">
    <!-- Left sidebar: User Profile Card -->
    <div
      class="w-1/3 min-w-[320px] glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden flex flex-col"
    >
      <!-- Profile Header -->
      <div
        class="p-8 bg-gradient-to-br from-slate-700 to-slate-800 text-center relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        ></div>
        <div class="relative z-10">
          <div
            class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ring-4 ring-white/20"
          >
            <span class="text-4xl font-bold text-white">{{ userInitials }}</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-1">{{ userName }}</h2>
          <p class="text-slate-300 text-sm">{{ userStore.user?.email }}</p>
          <div
            class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
            :class="roleBadgeClass"
          >
            <i :class="roleIcon"></i>
            {{ getRoleTranslation() }}
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="p-6 border-b border-slate-100/50 bg-white/50">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Informacje o koncie
        </h3>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <i class="pi pi-envelope text-blue-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-slate-500">Adres e-mail</p>
              <p class="text-sm font-semibold text-slate-800 truncate">
                {{ userStore.user?.email }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <i class="pi pi-check-circle text-green-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs text-slate-500">Status konta</p>
              <p class="text-sm font-semibold text-green-600">Aktywne</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <i class="pi pi-shield text-purple-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs text-slate-500">Uprawnienia</p>
              <p class="text-sm font-semibold text-slate-800">{{ getRoleTranslation() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="p-6 mt-auto">
        <button
          class="w-full py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium flex items-center justify-center gap-2"
          @click="logout"
        >
          <i class="pi pi-sign-out"></i>
          Wyloguj się
        </button>
      </div>
    </div>

    <!-- Right side: Settings Cards -->
    <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">{{ t('main.settings') }}</h1>
        <p class="text-slate-500 mt-1">Zarządzaj swoim kontem i preferencjami.</p>
      </header>

      <div class="space-y-6">
        <!-- Email Settings -->
        <section
          class="glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-at text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg">Adres e-mail</h3>
                <p class="text-slate-500 text-sm">{{ userStore.user?.email }}</p>
              </div>
            </div>
            <button
              @click="showEmailModal = true"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center gap-2"
            >
              <i class="pi pi-pencil text-sm"></i>
              Zmień
            </button>
          </div>
        </section>

        <!-- Password Settings -->
        <section
          class="glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-lock text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg">Hasło</h3>
                <p class="text-slate-500 text-sm">
                  Ostatnio zmienione: {{ passwordChangedAtFormatted }}
                </p>
              </div>
            </div>
            <button
              @click="showPasswordModal = true"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <i class="pi pi-key text-sm"></i>
              Zmień hasło
            </button>
          </div>
        </section>

        <!-- Notifications Settings -->
        <section
          class="glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-bell text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg">Powiadomienia</h3>
                <p class="text-slate-500 text-sm">Zarządzaj powiadomieniami email</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3">
                <div>
                  <p class="font-medium text-slate-700">Nowe wiadomości</p>
                  <p class="text-xs text-slate-400">Powiadomienia o nowych wiadomościach</p>
                </div>
                <InputSwitch v-model="notifyNewMessages" />
              </div>
            </div>
          </div>
        </section>

        <!-- Language Settings -->
        <section
          class="glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-globe text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg">Język</h3>
                <p class="text-slate-500 text-sm">Wybierz preferowany język interfejsu</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button
                @click="setLanguage('pl')"
                :class="[
                  'flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                  locale === 'pl'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ]"
              >
                🇵🇱 Polski
              </button>
              <button
                @click="setLanguage('en')"
                :class="[
                  'flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
                  locale === 'en'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ]"
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Modals -->
    <BaseModal :visible="showEmailModal" title="Zmień adres e-mail" @close="showEmailModal = false">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Nowy adres e-mail</label>
          <InputText
            v-model="newEmail"
            placeholder="nowy@email.pl"
            class="w-full p-3 border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2"
            >Aktualne hasło (potwierdzenie)</label
          >
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button
            @click="showEmailModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
          >
            Anuluj
          </button>
          <button
            @click="changeEmail"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow-lg"
          >
            Zmień e-mail
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal :visible="showPasswordModal" title="Zmień hasło" @close="showPasswordModal = false">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Aktualne hasło</label>
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Nowe hasło</label>
          <Password
            v-model="modalPassword.new"
            toggleMask
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button
            @click="showPasswordModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
          >
            Anuluj
          </button>
          <button
            @click="changePassword"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow-lg"
          >
            Zmień hasło
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import BaseModal from '../components/BaseModal.vue';
import { useUserStore } from '../store/user';
import { useToastStore } from '../store/toast';
import {
  changeEmail as apiChangeEmail,
  changePassword as apiChangePassword,
  getPasswordChangedAt,
} from '../services/user.service';
import { UserRole } from '../models/UserModel';

const { t, locale } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const showEmailModal = ref(false);
const showPasswordModal = ref(false);
const newEmail = ref('');
const modalPassword = reactive({
  old: '',
  new: '',
});

// Notification settings (local UI state for now)
const notifyNewMessages = ref(true);

// Password changed date
const passwordChangedAt = ref<Date | null>(null);

onMounted(async () => {
  passwordChangedAt.value = await getPasswordChangedAt();
});

const passwordChangedAtFormatted = computed(() => {
  if (!passwordChangedAt.value) return 'Nigdy nie zmieniane';
  return passwordChangedAt.value.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const userInitials = computed(() => {
  const name = userStore.user?.name || '';
  const surname = userStore.user?.surname || '';
  return (name.charAt(0) + surname.charAt(0)).toUpperCase() || 'U';
});

const userName = computed(() => {
  const name = userStore.user?.name || '';
  const surname = userStore.user?.surname || '';
  return `${name} ${surname}`.trim() || 'Użytkownik';
});

const roleBadgeClass = computed(() => {
  const roles = userStore.user?.roles || [];
  // Use highest priority role for badge
  if (roles.includes(UserRole.ADMIN)) return 'bg-purple-500/20 text-purple-200';
  if (roles.includes(UserRole.LECTURER)) return 'bg-blue-500/20 text-blue-200';
  return 'bg-green-500/20 text-green-200';
});

const roleIcon = computed(() => {
  const roles = userStore.user?.roles || [];
  if (roles.includes(UserRole.ADMIN)) return 'pi pi-crown';
  if (roles.includes(UserRole.LECTURER)) return 'pi pi-book';
  return 'pi pi-user';
});

const setLanguage = (lang: string) => {
  locale.value = lang;
  toastStore.push('success', lang === 'pl' ? 'Język zmieniony' : 'Language changed');
};

const getRoleTranslation = () => {
  const roles = userStore.user?.roles || [];
  if (roles.length === 0) return '';
  // Return comma-separated translated roles
  return roles.map((role) => t(`roles.${role.toLowerCase()}`)).join(', ');
};

const logout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
  toastStore.push('info', 'Wylogowano pomyślnie');
};

const changeEmail = async () => {
  if (!newEmail.value || !modalPassword.old) {
    toastStore.push('error', 'Podaj nowy e-mail i hasło');
    return;
  }
  try {
    await apiChangeEmail({ newEmail: newEmail.value, currentPassword: modalPassword.old });
    if (userStore.user) userStore.user.email = newEmail.value;
    toastStore.push('success', 'E-mail został zmieniony');
    showEmailModal.value = false;
    newEmail.value = '';
    modalPassword.old = '';
  } catch (e: any) {
    toastStore.push('error', e?.message || 'Błąd zmiany e-maila');
  }
};

const changePassword = async () => {
  if (modalPassword.new.length < 6) {
    toastStore.push('error', 'Nowe hasło jest za krótkie');
    return;
  }
  try {
    await apiChangePassword({ oldPassword: modalPassword.old, newPassword: modalPassword.new });
    toastStore.push('success', 'Hasło zostało zmienione');
    passwordChangedAt.value = new Date();
    showPasswordModal.value = false;
    modalPassword.old = '';
    modalPassword.new = '';
  } catch (e: any) {
    toastStore.push('error', e?.message || 'Błąd zmiany hasła');
  }
};
</script>

<style scoped>
/* Glass effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
}

/* Input styles */
:deep(.p-inputtext) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: all 0.2s ease;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.p-password) {
  width: 100%;
  display: block;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: linear-gradient(to right, #3b82f6, #2563eb);
}
</style>
