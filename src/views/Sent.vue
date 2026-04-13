<template>
  <div class="flex h-full flex-col gap-4 xl:flex-row">
    <div
      class="w-full xl:w-[370px] xl:min-w-[370px] flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div class="p-4 border-b border-stone-200 flex justify-between items-center shrink-0 bg-stone-50">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900">{{ t('main.sent') }}</h2>
        <Button
          icon="pi pi-filter"
          @click="showFilterPanel = !showFilterPanel"
          :class="[
            'p-button-rounded p-button-text p-button-sm',
            filterDate !== 'all' ? 'text-zinc-900' : 'text-zinc-500',
          ]"
          v-tooltip.top="'Filtruj'"
        />
      </div>

      <div v-if="showFilterPanel" class="px-4 py-3 border-b border-stone-200 bg-stone-50">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Data</p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="filterDate = 'all'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterDate === 'all'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Wszystkie
          </button>
          <button
            @click="filterDate = 'today'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterDate === 'today'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Dzisiaj
          </button>
          <button
            @click="filterDate = 'week'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterDate === 'week'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Ostatni tydzień
          </button>
          <button
            @click="filterDate = 'month'"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
              filterDate === 'month'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-stone-300 hover:border-zinc-700 hover:text-zinc-900',
            ]"
          >
            Ostatni miesiąc
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
          <i class="pi pi-send text-4xl mb-3 opacity-30"></i>
          <p class="font-medium text-zinc-500">Brak wysłanych wiadomości</p>
        </div>
        <div v-else class="stagger-in">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            @click="selectedMessage = msg"
            :class="[
              'p-4 border-b border-stone-200 cursor-pointer transition-colors relative',
              selectedMessage?.id === msg.id ? 'bg-stone-100' : 'hover:bg-stone-50',
            ]"
          >
            <div
              v-if="selectedMessage?.id === msg.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1 gap-3">
              <span class="text-sm font-medium text-zinc-700 truncate">
                Do:
                {{
                  msg.recipients && msg.recipients.length > 0
                    ? msg.recipients.map((r) => r.displayName).join(', ')
                    : 'Brak odbiorców'
                }}
              </span>
              <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-tight">{{
                formatTime(msg.sentDate || msg.createdAt)
              }}</span>
            </div>
            <p class="text-sm mb-1 truncate font-medium text-zinc-700">{{ msg.subject }}</p>
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
                icon="pi pi-forward"
                class="p-button-outlined p-button-sm rounded-lg"
                v-tooltip.top="'Przekaż dalej'"
              />
              <Button icon="pi pi-archive" class="p-button-outlined p-button-secondary p-button-sm rounded-lg" />
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
                Do:
                {{
                  selectedMessage &&
                  selectedMessage.recipients &&
                  selectedMessage.recipients.length > 0
                    ? selectedMessage.recipients.map((r) => r.displayName).join(', ')
                    : 'Brak odbiorców'
                }}
              </p>
              <p class="text-xs text-zinc-500">
                Wysłano: {{ formatDate(selectedMessage?.sentDate || selectedMessage?.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 sm:p-8 prose prose-zinc max-w-none">
          <div class="text-zinc-700 leading-relaxed text-base sm:text-lg" v-html="selectedMessage.body"></div>

          <div class="mt-8 pt-6 border-t border-stone-200" v-if="selectedMessage.recipients?.length">
            <h3 class="text-sm font-semibold text-zinc-700 mb-3">Status odczytu odbiorców</h3>
            <div class="space-y-2">
              <div
                v-for="recipient in selectedMessage.recipients"
                :key="recipient.id"
                class="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 bg-stone-50"
              >
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-zinc-900 truncate">{{ recipient.displayName }}</p>
                  <p class="text-[11px] text-zinc-500 truncate">{{ recipient.subtitle }}</p>
                </div>
                <div class="text-right">
                  <span
                    :class="[
                      'text-[11px] px-2 py-1 rounded-full font-semibold',
                      recipient.isRead ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-zinc-600',
                    ]"
                  >
                    {{ recipient.isRead ? 'Otwarta' : 'Nieotwarta' }}
                  </span>
                  <p v-if="recipient.readAt" class="text-[10px] text-zinc-500 mt-1">
                    {{ formatDate(recipient.readAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-stone-50/70 p-8">
        <div class="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-5">
          <i class="pi pi-send text-4xl opacity-30"></i>
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
import { getSentMessages } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';

const { t } = useI18n();
const messages = ref<MessageModel[]>([]);
const selectedMessage = ref<MessageModel | null>(null);
const loading = ref(true);
const search = ref('');
const showFilterPanel = ref(false);
const filterDate = ref<'all' | 'today' | 'week' | 'month'>('all');

const filteredMessages = computed(() => {
  let result = messages.value;

  // Apply date filter
  if (filterDate.value !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    result = result.filter((msg) => {
      const dateField = msg.sentDate || msg.createdAt;
      if (!dateField) return true;
      const msgDate = new Date(dateField);
      if (filterDate.value === 'today') {
        return msgDate >= today;
      } else if (filterDate.value === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return msgDate >= weekAgo;
      } else if (filterDate.value === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return msgDate >= monthAgo;
      }
      return true;
    });
  }

  // Apply search filter
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase();
    result = result.filter((msg) => {
      const subject = msg.subject?.toLowerCase() || '';
      const body = msg.body?.toLowerCase() || '';
      const recipients =
        (msg.recipients && msg.recipients.length > 0
          ? msg.recipients.map((r) => r.displayName?.toLowerCase()).join(' ')
          : '') || '';
      return subject.includes(term) || body.includes(term) || recipients.includes(term);
    });
  }

  return result;
});

onMounted(async () => {
  try {
    const response = await getSentMessages();
    messages.value = response;
  } finally {
    loading.value = false;
  }
});

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
