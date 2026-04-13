<template>
  <div class="flex h-full flex-col gap-4 xl:flex-row">
    <div
      class="w-full xl:w-[370px] xl:min-w-[370px] flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div class="p-4 border-b border-stone-200 flex justify-between items-center shrink-0 bg-stone-50">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900">{{ t('main.received') }}</h2>
        <Button
          icon="pi pi-filter"
          @click="showFilterPanel = !showFilterPanel"
          :class="[
            'p-button-rounded p-button-text p-button-sm',
            filterStatus !== 'all' ? 'text-zinc-900' : 'text-zinc-500',
          ]"
          v-tooltip.top="'Filtruj'"
        />
      </div>

      <div v-if="showFilterPanel" class="px-4 py-3 border-b border-stone-200 bg-stone-50">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Status</p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="filterStatus = 'all'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterStatus === 'all'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Wszystkie
          </button>
          <button
            @click="filterStatus = 'unread'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterStatus === 'unread'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Nieprzeczytane
          </button>
          <button
            @click="filterStatus = 'read'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterStatus === 'read'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Przeczytane
          </button>
        </div>
      </div>

      <div class="px-4 py-3 border-b border-stone-200 bg-white">
        <input
          v-model="search"
          type="text"
          :placeholder="t('main.search')"
          class="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-600 transition-colors"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-stone-100 rounded-lg animate-pulse"></div>
        </div>
        <div
          v-else-if="filteredMessages.length === 0"
          class="flex flex-col items-center justify-center h-full text-zinc-400 p-8 text-center"
        >
          <i class="pi pi-inbox text-4xl mb-3 opacity-30"></i>
          <p class="font-medium text-zinc-500">Brak nowych wiadomości</p>
        </div>
        <div v-else class="stagger-in">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            @click="handleMessageClick(msg)"
            :class="[
              'p-4 border-b border-stone-200 cursor-pointer transition-colors relative',
              selectedMessage?.id === msg.id ? 'bg-stone-100' : 'hover:bg-stone-50',
            ]"
          >
            <div
              v-if="selectedMessage?.id === msg.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1">
              <div class="flex items-center gap-2 min-w-0">
                <div v-if="!msg.isRead" class="w-2 h-2 bg-zinc-900 rounded-full flex-shrink-0"></div>
                <span
                  :class="[
                    'text-sm truncate',
                    msg.isRead ? 'font-medium text-zinc-700' : 'font-semibold text-zinc-900',
                  ]"
                >
                  {{
                    msg.recipients && msg.recipients.length > 0
                      ? msg.recipients[0].displayName
                      : 'Nadawca'
                  }}
                </span>
              </div>
              <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-tight ml-3">{{
                formatTime(msg.createdAt)
              }}</span>
            </div>
            <p
              :class="[
                'text-sm mb-1 truncate',
                msg.isRead ? 'font-medium text-zinc-700' : 'font-semibold text-zinc-900',
              ]"
            >
              {{ msg.subject }}
            </p>
            <p class="text-xs text-zinc-500 line-clamp-1">{{ msg.body.replace(/<[^>]*>/g, '') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 rounded-2xl border border-stone-200 bg-white overflow-hidden flex flex-col min-h-0"
    >
      <template v-if="selectedMessage">
        <div class="p-6 sm:p-7 border-b border-stone-200 bg-stone-50 shrink-0">
          <div class="flex justify-between items-start gap-4 mb-5">
            <h1 class="text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight">
              {{ selectedMessage.subject }}
            </h1>
            <div class="flex gap-2">
              <Button
                icon="pi pi-reply"
                class="p-button-outlined p-button-sm rounded-lg"
                v-tooltip.top="'Odpowiedz'"
              />
              <Button
                :icon="selectedMessage?.isRead ? 'pi pi-envelope' : 'pi pi-envelope-open'"
                class="p-button-outlined p-button-secondary p-button-sm rounded-lg"
                :disabled="!selectedMessage?.id"
                @click="toggleReadState"
              />
              <Button icon="pi pi-trash" class="p-button-outlined p-button-danger p-button-sm rounded-lg" />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <Avatar
              :label="
                selectedMessage &&
                selectedMessage.recipients &&
                selectedMessage.recipients.length > 0
                  ? selectedMessage.recipients[0].displayName[0]
                  : '?'
              "
              shape="circle"
              size="large"
              class="bg-zinc-900 text-white font-semibold"
            />
            <div>
              <p class="font-semibold text-zinc-900">
                {{
                  selectedMessage &&
                  selectedMessage.recipients &&
                  selectedMessage.recipients.length > 0
                    ? selectedMessage.recipients[0].displayName
                    : 'Nadawca'
                }}
              </p>
              <p class="text-xs text-zinc-500">
                Do: Ty <span class="mx-1">•</span> {{ formatDate(selectedMessage?.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 sm:p-8 prose prose-zinc max-w-none">
          <div class="text-zinc-700 leading-relaxed text-base sm:text-lg" v-html="selectedMessage.body"></div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-stone-50/70 p-8">
        <div class="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-5">
          <i class="pi pi-envelope-open text-4xl opacity-30"></i>
        </div>
        <p class="text-base sm:text-lg font-semibold text-zinc-500 text-center">
          Wybierz wiadomość, aby ją wyświetlić
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getMessages, markAsRead, markAsUnread } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';
import { useMessageStore } from '../store/message';

const messageStore = useMessageStore();

const { t } = useI18n();
const messages = ref<MessageModel[]>([]);
const selectedMessage = ref<MessageModel | null>(null);
const loading = ref(true);
const search = ref('');
const showFilterPanel = ref(false);
const filterStatus = ref<'all' | 'read' | 'unread'>('all');

const filteredMessages = computed(() => {
  let result = messages.value;

  // Apply read/unread filter
  if (filterStatus.value === 'unread') {
    result = result.filter((msg) => !msg.isRead);
  } else if (filterStatus.value === 'read') {
    result = result.filter((msg) => msg.isRead);
  }

  // Apply search filter
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase();
    result = result.filter((msg) => {
      const subject = msg.subject?.toLowerCase() || '';
      const body = msg.body?.toLowerCase() || '';
      const recipient =
        (msg.recipients && msg.recipients.length > 0
          ? msg.recipients[0].displayName?.toLowerCase()
          : '') || '';
      return subject.includes(term) || body.includes(term) || recipient.includes(term);
    });
  }

  return result;
});

onMounted(async () => {
  try {
    const response = await getMessages();
    messages.value = response;
  } finally {
    loading.value = false;
  }
});

const handleMessageClick = async (msg: MessageModel) => {
  selectedMessage.value = msg;

  // Mark as read if not already read
  if (!msg.isRead && msg.id) {
    try {
      await markAsRead(msg.id);
      // Update local state
      msg.isRead = true;
      msg.readAt = new Date();
      // Update global unread count in store
      messageStore.fetchCounts();
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }
};

const toggleReadState = async () => {
  if (!selectedMessage.value?.id) return;

  try {
    if (selectedMessage.value.isRead) {
      await markAsUnread(selectedMessage.value.id);
      selectedMessage.value.isRead = false;
      selectedMessage.value.readAt = undefined;
    } else {
      await markAsRead(selectedMessage.value.id);
      selectedMessage.value.isRead = true;
      selectedMessage.value.readAt = new Date();
    }
    messageStore.fetchCounts();
  } catch (error) {
    console.error('Failed to update read status:', error);
  }
};

const formatTime = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // If today, show only time
  if (messageDate.getTime() === today.getTime()) {
    return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  }

  // If yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Wczoraj';
  }

  // If this year, show day and month
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  }

  // Otherwise show full date
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
};
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  return `${dateStr}, ${timeStr}`;
};
</script>
