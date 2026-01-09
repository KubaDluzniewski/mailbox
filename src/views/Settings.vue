<template>
  <div class="p-4 space-y-8">
    <h1 class="text-2xl font-bold">{{ t('titles.settings') }}</h1>

    <div class="max-w-md">
      <h2 class="text-xl font-semibold mb-4">{{ t('settings.changePassword.title') }}</h2>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label for="old-password" class="block text-sm font-medium">{{
            t('settings.changePassword.oldPassword')
          }}</label>
          <input
            id="old-password"
            type="password"
            v-model="passwordForm.oldPassword"
            required
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label for="new-password" class="block text-sm font-medium">{{
            t('settings.changePassword.newPassword')
          }}</label>
          <input
            id="new-password"
            type="password"
            v-model="passwordForm.newPassword"
            required
            class="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          :disabled="passwordLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {{
            passwordLoading
              ? t('settings.changePassword.loadingButton')
              : t('settings.changePassword.button')
          }}
        </button>
      </form>
    </div>

    <div class="max-w-md">
      <h2 class="text-xl font-semibold mb-4">{{ t('settings.changeEmail.title') }}</h2>
      <form @submit.prevent="changeEmail" class="space-y-4">
        <div>
          <label for="new-email" class="block text-sm font-medium">{{
            t('settings.changeEmail.newEmail')
          }}</label>
          <input
            id="new-email"
            type="email"
            v-model="emailForm.newEmail"
            required
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label for="current-password" class="block text-sm font-medium">{{
            t('settings.changeEmail.currentPassword')
          }}</label>
          <input
            id="current-password"
            type="password"
            v-model="emailForm.currentPassword"
            required
            class="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          :disabled="emailLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {{
            emailLoading
              ? t('settings.changeEmail.loadingButton')
              : t('settings.changeEmail.button')
          }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { changePassword as apiChangePassword, activate } from '../services/auth.service';
import { useToastStore } from '../store/toast';

const { t } = useI18n();
const toast = useToastStore();

// Change Password
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
});
const passwordLoading = ref(false);

async function changePassword() {
  passwordLoading.value = true;
  try {
    await apiChangePassword(passwordForm.oldPassword, passwordForm.newPassword);
    toast.push('success', t('settings.changePassword.success'));
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
  } catch (error: any) {
    toast.push('error', error?.response?.data || t('settings.changePassword.error'));
  } finally {
    passwordLoading.value = false;
  }
}

// Change Email
import { changeEmail as apiChangeEmail } from '../services/auth.service';
const emailForm = reactive({
  newEmail: '',
  currentPassword: '',
});
const emailLoading = ref(false);

async function changeEmail() {
  emailLoading.value = true;
  try {
    await apiChangeEmail(emailForm.newEmail, emailForm.currentPassword);
    toast.push('success', t('settings.changeEmail.success'));
    emailForm.newEmail = '';
    emailForm.currentPassword = '';
  } catch (error: any) {
    toast.push('error', error?.response?.data || t('settings.changeEmail.error'));
  } finally {
    emailLoading.value = false;
  }
}
</script>
