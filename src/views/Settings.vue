<template>
  <div class="flex h-full flex-col gap-4 xl:flex-row relative">
    <div
      v-if="settingsLoading"
      class="absolute inset-0 z-20 pointer-events-none bg-stone-100/60 backdrop-blur-[1px]"
    >
      <div class="h-full grid grid-cols-1 xl:grid-cols-[minmax(360px,360px)_1fr] gap-4 p-1">
        <div class="rounded-2xl border border-stone-200 bg-white p-6 animate-pulse flex flex-col">
          <div class="mx-auto w-20 h-20 rounded-full bg-stone-200 mb-4"></div>
          <div class="h-6 w-2/3 mx-auto rounded bg-stone-200 mb-2"></div>
          <div class="h-4 w-1/2 mx-auto rounded bg-stone-200 mb-5"></div>
          <div class="space-y-3 mt-4">
            <div class="h-14 rounded-xl bg-stone-100"></div>
            <div class="h-14 rounded-xl bg-stone-100"></div>
            <div class="h-14 rounded-xl bg-stone-100"></div>
          </div>
          <div class="mt-auto h-10 rounded-xl bg-stone-100"></div>
        </div>

        <div class="rounded-2xl border border-stone-200 bg-white p-6 animate-pulse space-y-4">
          <div class="h-8 w-48 rounded bg-stone-200"></div>
          <div class="h-4 w-72 rounded bg-stone-200"></div>
          <div class="h-24 rounded-2xl bg-stone-100"></div>
          <div class="h-24 rounded-2xl bg-stone-100"></div>
          <div class="h-28 rounded-2xl bg-stone-100"></div>
        </div>
      </div>
    </div>

    <div
      class="w-full xl:w-[360px] xl:min-w-[360px] rounded-2xl border border-stone-200 bg-white overflow-hidden flex flex-col"
    >
      <div class="p-6 border-b border-stone-200 bg-stone-50 text-center">
        <div
          class="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4"
        >
          <span class="text-3xl font-semibold text-white">{{ userInitials }}</span>
        </div>
        <h2 class="text-2xl font-semibold text-zinc-900 mb-1">{{ userName }}</h2>
        <p class="text-zinc-500 text-sm">{{ userStore.user?.email }}</p>
        <div
          class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em]"
          :class="roleBadgeClass"
        >
          <i :class="roleIcon"></i>
          {{ getRoleTranslation() }}
        </div>
      </div>

      <div class="p-5 border-b border-stone-200">
        <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-[0.14em] mb-4">
          Informacje o koncie
        </h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div class="w-9 h-9 rounded-lg bg-stone-200 flex items-center justify-center">
              <i class="pi pi-envelope text-zinc-700"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-zinc-500">Adres e-mail</p>
              <p class="text-sm font-semibold text-zinc-800 truncate">
                {{ userStore.user?.email }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <i class="pi pi-check-circle text-emerald-700"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs text-zinc-500">Status konta</p>
              <p class="text-sm font-semibold text-emerald-700">Aktywne</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <div class="w-9 h-9 rounded-lg bg-stone-200 flex items-center justify-center">
              <i class="pi pi-shield text-zinc-700"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs text-zinc-500">Uprawnienia</p>
              <p class="text-sm font-semibold text-zinc-800">{{ getRoleTranslation() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-5 mt-auto">
        <button
          class="w-full py-2.5 px-4 rounded-lg text-red-700 hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
          @click="logout"
        >
          <i class="pi pi-sign-out"></i>
          Wyloguj się
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
      <header class="mb-5 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <p class="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Profile</p>
        <h1 class="text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight">
          {{ t('main.settings') }}
        </h1>
        <p class="text-zinc-500 mt-1">Zarządzaj swoim kontem i preferencjami.</p>
      </header>

      <div class="space-y-4">
        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-stone-200 flex items-center justify-center">
                <i class="pi pi-at text-zinc-700 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-zinc-800 text-lg">{{ t('settingsPage.email.title') }}</h3>
                <p class="text-zinc-500 text-sm">{{ userStore.user?.email }}</p>
              </div>
            </div>
            <button
              @click="showEmailModal = true"
              class="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-zinc-700 font-semibold transition-colors flex items-center gap-2"
            >
              <i class="pi pi-pencil text-sm"></i>
              {{ t('settingsPage.email.change') }}
            </button>
          </div>
        </section>

        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-stone-200 flex items-center justify-center">
                <i class="pi pi-lock text-zinc-700 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-zinc-800 text-lg">{{ t('settingsPage.password.title') }}</h3>
                <p class="text-zinc-500 text-sm">
                  {{ t('settingsPage.password.changed') }}: {{ passwordChangedAtFormatted }}
                </p>
              </div>
            </div>
            <button
              @click="showPasswordModal = true"
              class="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors flex items-center gap-2"
            >
              <i class="pi pi-key text-sm"></i>
              {{ t('settings.changePassword.button') }}
            </button>
          </div>
        </section>

        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
        >
          <div>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-xl bg-stone-200 flex items-center justify-center">
                <i class="pi pi-globe text-zinc-700 text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-zinc-800 text-lg">{{ t('settingsPage.language.title') }}</h3>
                <p class="text-zinc-500 text-sm">
                  {{ t('settingsPage.language.description') }}
                </p>
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                @click="setLanguage('pl')"
                :class="[
                  'py-2.5 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border',
                  locale === 'pl'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-stone-300 hover:bg-stone-50',
                ]"
              >
                🇵🇱 Polski
              </button>
              <button
                @click="setLanguage('eng')"
                :class="[
                  'py-2.5 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border',
                  locale === 'eng'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-stone-300 hover:bg-stone-50',
                ]"
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <BaseModal
      :visible="showEmailModal"
      :title="t('settings.changeEmail.title')"
      @close="showEmailModal = false"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-2">{{
            t('settings.changeEmail.newEmail')
          }}</label>
          <InputText
            v-model="newEmail"
            placeholder="nowy@email.pl"
            class="w-full p-3 border-stone-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-2">{{
            t('settings.changeEmail.currentPassword')
          }}</label>
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full p-3 border-stone-300 rounded-lg"
          />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button
            @click="showEmailModal = false"
            class="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-zinc-700 font-semibold transition-colors"
          >
            {{ t('users.dialog.cancel') }}
          </button>
          <button
            @click="changeEmail"
            class="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors"
          >
            {{ t('settings.changeEmail.button') }}
          </button>
        </div>
      </div>
    </BaseModal>

    <BaseModal
      :visible="showPasswordModal"
      :title="t('settings.changePassword.title')"
      @close="showPasswordModal = false"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-2">{{
            t('settings.changePassword.oldPassword')
          }}</label>
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full p-3 border-stone-300 rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-zinc-700 mb-2">{{
            t('settings.changePassword.newPassword')
          }}</label>
          <Password
            v-model="modalPassword.new"
            toggleMask
            :promptLabel="t('passwordStrength.prompt')"
            :weakLabel="t('passwordStrength.weak')"
            :mediumLabel="t('passwordStrength.medium')"
            :strongLabel="t('passwordStrength.strong')"
            class="w-full"
            inputClass="w-full p-3 border-stone-300 rounded-lg"
          />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button
            @click="showPasswordModal = false"
            class="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-zinc-700 font-semibold transition-colors"
          >
            {{ t('users.dialog.cancel') }}
          </button>
          <button
            @click="changePassword"
            class="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors"
          >
            {{ t('settings.changePassword.button') }}
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

import { useUserStore } from '../store/user';
import { useToastStore } from '../store/toast';
import { useAppStore } from '../store/app';
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
const appStore = useAppStore();

const showEmailModal = ref(false);
const showPasswordModal = ref(false);
const newEmail = ref('');
const settingsLoading = ref(true);
const modalPassword = reactive({
  old: '',
  new: '',
});

// Password changed date
const passwordChangedAt = ref<Date | null>(null);

onMounted(async () => {
  try {
    passwordChangedAt.value = await getPasswordChangedAt();
  } catch (error) {
    console.error('Failed to load password changed date:', error);
  } finally {
    settingsLoading.value = false;
  }
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
  if (roles.includes(UserRole.ADMIN)) return 'bg-zinc-900 text-white';
  if (roles.includes(UserRole.LECTURER)) return 'bg-stone-200 text-zinc-800';
  return 'bg-emerald-100 text-emerald-700';
});

const roleIcon = computed(() => {
  const roles = userStore.user?.roles || [];
  if (roles.includes(UserRole.ADMIN)) return 'pi pi-crown';
  if (roles.includes(UserRole.LECTURER)) return 'pi pi-book';
  return 'pi pi-user';
});

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

const setLanguage = (lang: string) => {
  locale.value = lang;
  appStore.setLang(lang);
  toastStore.push('success', lang === 'pl' ? 'Język zmieniony' : 'Language changed');
};
</script>

<style scoped>
:deep(.p-inputtext) {
  border-radius: 10px;
  border: 1px solid #d6d3d1;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

:deep(.p-inputtext:focus) {
  border-color: #3f3f46;
  box-shadow: 0 0 0 3px rgba(113, 113, 122, 0.15);
  outline: none;
}

:deep(.p-password) {
  width: 100%;
  display: block;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}
</style>
