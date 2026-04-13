<template>
  <div class="h-full flex flex-col gap-4 xl:flex-row">
    <section
      class="w-full xl:w-[460px] xl:min-w-[460px] flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div class="p-4 border-b border-stone-200 flex justify-between items-center shrink-0 bg-stone-50">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900">{{ t('history.title') }}</h2>
        <Button
          icon="pi pi-refresh"
          class="p-button-sm p-button-rounded p-button-text text-zinc-700"
          @click="loadMessages"
          :loading="loading"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 6" :key="i" class="h-24 bg-stone-100 rounded-lg animate-pulse"></div>
        </div>
        <div
          v-else-if="messages.length === 0"
          class="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center"
        >
          <i class="pi pi-inbox text-4xl mb-3 opacity-30"></i>
          <p class="font-medium text-zinc-500">{{ t('history.noHistory') }}</p>
        </div>
        <div v-else class="stagger-in">
          <div
            v-for="message in messages"
            :key="message.id"
            @click="selectedMessage = message"
            :class="[
              'p-4 border-b border-stone-200 cursor-pointer transition-colors relative',
              selectedMessage?.id === message.id ? 'bg-stone-100' : 'hover:bg-stone-50',
            ]"
          >
            <div
              v-if="selectedMessage?.id === message.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start gap-3 mb-2">
              <span class="text-sm font-semibold text-zinc-900 truncate flex-1">{{ message.subject }}</span>
              <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {{ message.recipientCount }} {{ t('history.recipients') }}
              </span>
            </div>
            <p class="text-xs text-zinc-600 mb-1 truncate">
              {{ t('history.from') }}: {{ message.sender?.name }} {{ message.sender?.surname }}
            </p>
            <p class="text-[11px] text-zinc-500">{{ formatDate(message.sentDate) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="flex-1 rounded-2xl border border-stone-200 bg-white overflow-hidden flex flex-col min-h-0">
      <template v-if="loading">
        <div class="p-7 border-b border-stone-200 bg-stone-50 animate-pulse">
          <div class="h-8 w-2/3 rounded bg-stone-200 mb-5"></div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-stone-200"></div>
            <div class="space-y-2 flex-1">
              <div class="h-4 w-48 rounded bg-stone-200"></div>
              <div class="h-3 w-64 rounded bg-stone-200"></div>
            </div>
          </div>
        </div>
        <div class="flex-1 p-7 space-y-3 animate-pulse">
          <div class="h-4 w-full rounded bg-stone-200"></div>
          <div class="h-4 w-11/12 rounded bg-stone-200"></div>
          <div class="h-4 w-3/4 rounded bg-stone-200"></div>
        </div>
      </template>

      <template v-else-if="selectedMessage">
        <div class="p-6 sm:p-7 border-b border-stone-200 bg-stone-50 shrink-0">
          <h1 class="text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight mb-4">
            {{ selectedMessage.subject }}
          </h1>

          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Avatar
                :label="getSenderInitials(selectedMessage.sender)"
                shape="circle"
                size="large"
                class="bg-zinc-900 text-white font-semibold"
              />
              <div>
                <p class="text-sm font-semibold text-zinc-900">
                  {{ selectedMessage.sender?.name }} {{ selectedMessage.sender?.surname }}
                </p>
                <p class="text-xs text-zinc-500">{{ selectedMessage.sender?.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p class="text-xs text-zinc-500 font-medium">{{ t('history.sentDate') }}</p>
                <p class="text-sm font-semibold text-zinc-900">{{ formatDate(selectedMessage.sentDate) }}</p>
              </div>
              <div>
                <p class="text-xs text-zinc-500 font-medium">{{ t('history.count') }}</p>
                <p class="text-sm font-semibold text-zinc-900">{{ selectedMessage.recipientCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-7 bg-white">
          <div class="prose max-w-none prose-zinc">
            <div v-html="selectedMessage.body" class="text-zinc-700"></div>
          </div>

          <div class="mt-8 pt-6 border-t border-stone-200">
            <h3 class="text-sm font-semibold text-zinc-700 mb-3">
              {{ t('history.recipientList') }} ({{ selectedMessage.recipients?.length }})
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="recipient in selectedMessage.recipients"
                :key="recipient.id"
                class="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50"
              >
                <Avatar
                  :label="getInitials(recipient.displayName)"
                  shape="circle"
                  size="small"
                  class="bg-zinc-200 text-zinc-700 font-semibold text-xs"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-zinc-900 truncate">{{ recipient.displayName }}</p>
                  <p class="text-[10px] text-zinc-500 truncate">{{ recipient.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-stone-50/70 p-8">
        <div class="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-5">
          <i class="pi pi-envelope text-4xl opacity-30"></i>
        </div>
        <p class="text-base sm:text-lg font-semibold text-zinc-500 text-center">{{ t('history.selectMessage') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAllMessages } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';

const { t, locale } = useI18n();
const messages = ref<MessageModel[]>([]);
const selectedMessage = ref<MessageModel | null>(null);
const loading = ref(true);

const loadMessages = async () => {
  loading.value = true;
  try {
    messages.value = await getAllMessages();
  } catch (error) {
    console.error('Failed to load message history:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale.value === 'pl' ? 'pl-PL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getSenderInitials = (sender?: { name: string; surname: string }) => {
  if (!sender?.name || !sender?.surname) return '??';
  return (sender.name[0] ?? '') + (sender.surname[0] ?? '');
};
const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2).toUpperCase();
};

onMounted(loadMessages);
</script>
