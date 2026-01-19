<template>
  <div class="max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar pb-10">
    <header class="mb-10 pt-4">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">{{ t('main.settings') }}</h1>
      <p class="text-slate-500 mt-2 text-lg">Zarządzaj swoim kontem i preferencjami.</p>
    </header>
    <div class="space-y-8">
      <section
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <div
          class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-blue-50/30 flex items-center gap-4"
        >
          <i class="pi pi-user text-blue-600 font-bold text-lg"></i>
          <h2 class="font-bold text-slate-800 text-xl">Twoje konto</h2>
        </div>
        <div class="p-8">
          <div class="flex flex-col gap-2 w-full">
            <label class="text-sm font-black text-slate-700 uppercase tracking-wider"
              >Adres E-mail</label
            >
            <div class="relative group flex items-center email-input-wrapper my-3">
              <InputText
                :value="userStore.user?.email || ''"
                class="w-full p-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all pr-16"
                placeholder="twój@email.pl"
                disabled
              />
              <button
                @click="showEmailModal = true"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors z-20"
                aria-label="Edytuj e-mail"
              >
                <i class="pi pi-pencil"></i>
              </button>
            </div>
            <small class="text-slate-400 mt-1"
              >Ten adres jest używany do logowania i powiadomień.</small
            >
          </div>

          <div class="flex flex-col gap-2 w-full mt-6">
            <label class="text-sm font-black text-slate-700 uppercase tracking-wider">{{
              t('roles.yourRole')
            }}</label>
            <div class="relative group flex items-center my-3">
              <InputText
                :value="getRoleTranslation()"
                class="w-full p-4 bg-slate-50 border-slate-200 rounded-2xl focus:bg-white transition-all"
                disabled
              />
            </div>
            <small class="text-slate-400 mt-1"
              >Twoja rola w systemie określa Twoje uprawnienia.</small
            >
          </div>
        </div>
      </section>
      <section
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <div
          class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-blue-50/30 flex items-center gap-4"
        >
          <i class="pi pi-lock text-blue-600 font-bold text-lg"></i>
          <h2 class="font-bold text-slate-800 text-xl">Bezpieczeństwo</h2>
        </div>
        <div class="p-8">
          <div class="flex items-center justify-between max-w-2xl">
            <button
              @click="showPasswordModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 border-none px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 my-2"
            >
              <i class="pi pi-key"></i>
              <span>Zmień hasło</span>
            </button>
          </div>
        </div>
      </section>
      <!-- Modale -->
      <BaseModal
        :visible="showEmailModal"
        title="Zmień adres e-mail"
        @close="showEmailModal = false"
      >
        <div class="flex flex-col gap-4">
          <InputText
            v-model="newEmail"
            placeholder="Nowy adres e-mail"
            class="w-full p-3 border-slate-200 rounded-xl"
          />
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            :inputProps="{ placeholder: 'Aktualne hasło (potwierdzenie)' }"
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
          <div class="flex justify-end">
            <button
              @click="changeEmail"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 border-none"
            >
              <i class="pi pi-check"></i>
              <span>Zmień e-mail</span>
            </button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        :visible="showPasswordModal"
        title="Zmień hasło"
        @close="showPasswordModal = false"
      >
        <div class="flex flex-col gap-4">
          <Password
            v-model="modalPassword.old"
            toggleMask
            :feedback="false"
            :inputProps="{ placeholder: 'Aktualne hasło' }"
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
          <Password
            v-model="modalPassword.new"
            toggleMask
            :inputProps="{ placeholder: 'Nowe hasło' }"
            class="w-full"
            inputClass="w-full p-3 border-slate-200 rounded-xl"
          />
          <div class="flex justify-end">
            <button
              @click="changePassword"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 border-none"
            >
              <i class="pi pi-check"></i>
              <span>Zmień hasło</span>
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import BaseModal from '../components/BaseModal.vue';
import { useUserStore } from '../store/user';
import { useToastStore } from '../store/toast';
import {
  changeEmail as apiChangeEmail,
  changePassword as apiChangePassword,
} from '../services/user.service';

const { t, locale } = useI18n();
const userStore = useUserStore();
const toastStore = useToastStore();

const showEmailModal = ref(false);
const showPasswordModal = ref(false);
const newEmail = ref('');
const modalPassword = reactive({
  old: '',
  new: '',
});

const setLanguage = (lang: string) => {
  locale.value = lang;
  toastStore.push('success', lang === 'pl' ? 'Język zmieniony' : 'Language changed');
};

const getRoleTranslation = () => {
  const role = userStore.user?.role;
  if (!role) return '';
  return t(`roles.${role.toLowerCase()}`);
};

const changeEmail = async () => {
  if (!newEmail.value || !modalPassword.old) {
    toastStore.push('error', 'Podaj nowy e-mail i hasło');
    return;
  }
  try {
    await apiChangeEmail({ newEmail: newEmail.value, currentPassword: modalPassword.old });
    // update local user
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
    showPasswordModal.value = false;
    modalPassword.old = '';
    modalPassword.new = '';
  } catch (e: any) {
    toastStore.push('error', e?.message || 'Błąd zmiany hasła');
  }
};
</script>

<style scoped>
/* Styl dla InputText wewnątrz sekcji ustawień */
:deep(.p-inputtext) {
  border-radius: 12px;
}

/* Wyraźne obramowania dla PrimeVue password/input wewnątrz modali i formularzy */
:deep(.p-inputtext),
:deep(.p-password .p-password-input) {
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: all 0.2s ease;
}

:deep(.p-inputtext:focus),
:deep(.p-password .p-password-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.p-inputtext[disabled]) {
  background: #f8fafc;
}

/* Dodatkowe style dla wrappera pola e-mail aby tekst nie był zasłonięty obramowaniem */
.email-input-wrapper {
  width: 100%;
}
.email-input-wrapper button {
  background: transparent;
  border: none;
}

/* AGRESYWNE usunięcie obramowania z przycisku PrimeVue */
:deep(.p-button) {
  border: none !important;
  outline: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

:deep(.p-button:focus) {
  outline: none !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

/* Fix dla ikon w Password component w modalach */
:deep(.p-password) {
  width: 100%;
  display: block;
}

:deep(.p-password .p-input-icon-right) {
  width: 100%;
  display: block;
}

:deep(.p-password-input) {
  width: 100% !important;
  padding-right: 2.5rem !important;
}

:deep(.p-password .p-icon) {
  position: absolute !important;
  right: 0.75rem !important;
  top: 50% !important;
  margin-top: 0 !important;
  transform: translateY(-50%) !important;
  cursor: pointer;
}

/* Fix dla ikony klucza w polu hasła */
:deep(.p-password .p-input-icon-right > .p-icon:first-child) {
  left: 0.75rem !important;
  right: auto !important;
}

/* Fix dla ikony oka (toggle mask) */
:deep(.p-password .p-input-icon-right > button) {
  position: absolute !important;
  right: 0.75rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
