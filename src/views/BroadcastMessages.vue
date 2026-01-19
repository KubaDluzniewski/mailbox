<template>
  <div class="flex h-full gap-6">
    <!-- Messages List -->
    <div
      class="w-2/5 min-w-[400px] flex flex-col glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden"
    >
      <div
        class="p-5 border-b border-slate-100/50 flex justify-between items-center shrink-0 bg-gradient-to-r from-white/50 to-blue-50/30"
      >
        <h2 class="text-xl font-black gradient-text">Wiadomości Broadcast</h2>
        <Button
          icon="pi pi-refresh"
          class="p-button-sm p-button-rounded hover-lift"
          @click="loadMessages"
          :loading="loading"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="h-24 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div
          v-else-if="messages.length === 0"
          class="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center"
        >
          <i class="pi pi-inbox text-5xl mb-4 opacity-20"></i>
          <p class="font-medium text-slate-500">Brak wiadomości broadcast</p>
        </div>
        <div v-else>
          <div
            v-for="message in messages"
            :key="message.id"
            @click="selectedMessage = message"
            :class="[
              'p-5 border-b border-slate-50 cursor-pointer transition-all relative group hover-lift',
              selectedMessage?.id === message.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50/30'
                : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20',
            ]"
          >
            <div
              v-if="selectedMessage?.id === message.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-bold text-slate-900 truncate flex-1">
                {{ message.subject }}
              </span>
              <span
                class="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full bg-blue-100 text-blue-700 ml-2"
              >
                {{ message.recipientCount }} odbiorców
              </span>
            </div>
            <p class="text-xs text-slate-600 mb-1">
              Od: {{ message.sender?.name }} {{ message.sender?.surname }}
            </p>
            <p class="text-[10px] text-slate-400">
              {{ formatDate(message.sentDate) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Details -->
    <div
      class="flex-1 glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden flex flex-col"
    >
      <template v-if="selectedMessage">
        <div class="p-8 border-b border-slate-100 bg-slate-50/30 shrink-0">
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-3xl font-black text-slate-900 leading-tight">
              {{ selectedMessage.subject }}
            </h1>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Avatar
                :label="getSenderInitials(selectedMessage.sender)"
                shape="circle"
                size="large"
                class="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 font-bold shadow-md"
              />
              <div>
                <p class="text-sm font-bold text-slate-900">
                  {{ selectedMessage.sender?.name }} {{ selectedMessage.sender?.surname }}
                </p>
                <p class="text-xs text-slate-500">{{ selectedMessage.sender?.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p class="text-xs text-slate-500 font-medium">Data wysłania</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ formatDate(selectedMessage.sentDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium">Liczba odbiorców</p>
                <p class="text-sm font-bold text-slate-900">
                  {{ selectedMessage.recipientCount }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white/50">
          <div class="prose max-w-none">
            <div v-html="selectedMessage.body" class="text-slate-700"></div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-200">
            <h3 class="text-sm font-bold text-slate-700 mb-3">
              Odbiorcy ({{ selectedMessage.recipients?.length }})
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="recipient in selectedMessage.recipients"
                :key="recipient.id"
                class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Avatar
                  :label="getInitials(recipient.displayName)"
                  shape="circle"
                  size="small"
                  class="bg-gradient-to-br from-blue-100 to-purple-100 text-slate-700 font-bold text-xs"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-900 truncate">
                    {{ recipient.displayName }}
                  </p>
                  <p class="text-[10px] text-slate-500 truncate">{{ recipient.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20"
      >
        <div
          class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-6"
        >
          <i class="pi pi-envelope text-5xl opacity-20"></i>
        </div>
        <p class="text-lg font-bold text-slate-400">Wybierz wiadomość, aby wyświetlić szczegóły</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getBroadcastMessages } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';

const messages = ref<MessageModel[]>([]);
const selectedMessage = ref<MessageModel | null>(null);
const loading = ref(true);

const loadMessages = async () => {
  loading.value = true;
  try {
    messages.value = await getBroadcastMessages();
  } catch (error) {
    console.error('Failed to load broadcast messages:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pl-PL', {
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
