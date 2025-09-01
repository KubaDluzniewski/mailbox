<template>
  <div class="p-2 sm:p-4">
    <MessageList :messages="messages" :loading="loading" :error="error" @select="onSelect" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MessageModel } from '../models/MessageModel';
import { getMessages } from '../services/message.service';

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

function onSelect() {
  // miejsce na otwieranie szczegółów/nawigację
}
</script>

<style scoped></style>
