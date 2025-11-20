<template>
  <div class="p-2 sm:p-4">
    <MessageList :messages="messages" :loading="loading" :error="error" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MessageModel } from '../models/MessageModel';
import { getMessages } from '../services/message.service';
import { isActive } from '../services/auth.service';

const messages = ref<MessageModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const { t } = useI18n();

async function fetchMessages() {
  loading.value = true;
  error.value = null;
  try {
    messages.value = await getMessages();
  } catch (_) {
    error.value = t('errors.fetchMessages');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchMessages);
onMounted(() => {
  isActive;
  fetchMessages();
});
</script>

<style scoped></style>
