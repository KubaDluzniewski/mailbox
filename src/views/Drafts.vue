<template>
  <div class="flex h-full flex-col gap-4 xl:flex-row">
    <div
      class="w-full xl:w-[370px] xl:min-w-[370px] flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div class="p-4 border-b border-stone-200 flex justify-between items-center shrink-0 bg-stone-50">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900">{{ t('main.drafts') }}</h2>
        <Button icon="pi pi-file-edit" class="p-button-rounded p-button-text p-button-sm text-zinc-500" />
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
          <i class="pi pi-file-edit text-4xl mb-3 opacity-30"></i>
          <p class="font-medium text-zinc-500">Brak szkiców</p>
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
                formatTime(msg.createdAt)
              }}</span>
            </div>
            <p class="text-sm mb-1 truncate font-medium text-zinc-700">
              {{ msg.subject || t('messageList.noSubject') }}
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
              {{ selectedMessage.subject || t('messageList.noSubject') }}
            </h1>
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-outlined p-button-sm rounded-lg"
                v-tooltip.top="'Edytuj szkic'"
                @click="editDraft"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger p-button-sm rounded-lg"
                v-tooltip.top="'Usuń szkic'"
                @click="confirmDelete"
              />
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
              <p class="text-xs text-zinc-500">Utworzono: {{ formatDate(selectedMessage?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 sm:p-8 prose prose-zinc max-w-none">
          <div class="text-zinc-700 leading-relaxed text-base sm:text-lg" v-html="selectedMessage.body"></div>
        </div>
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-stone-50/70 p-8">
        <div class="w-24 h-24 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-5">
          <i class="pi pi-file-edit text-4xl opacity-30"></i>
        </div>
        <p class="text-base sm:text-lg font-semibold text-zinc-500 text-center">
          Wybierz szkic, aby go wyświetlić
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getDrafts, deleteDraft } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';

const { t } = useI18n();
const router = useRouter();
const messages = ref<MessageModel[]>([]);
const selectedMessage = ref<MessageModel | null>(null);
const loading = ref(true);
const search = ref('');

const filteredMessages = computed(() => {
  if (!search.value.trim()) return messages.value;
  const term = search.value.trim().toLowerCase();
  return messages.value.filter((msg) => {
    const subject = msg.subject?.toLowerCase() || '';
    const body = msg.body?.toLowerCase() || '';
    const recipients =
      (msg.recipients && msg.recipients.length > 0
        ? msg.recipients.map((r) => r.displayName?.toLowerCase()).join(' ')
        : '') || '';
    return subject.includes(term) || body.includes(term) || recipients.includes(term);
  });
});

onMounted(async () => {
  try {
    const response = await getDrafts();
    messages.value = response;
  } finally {
    loading.value = false;
  }
});

const editDraft = () => {
  if (selectedMessage.value) {
    router.push({ name: 'Compose', query: { draft: JSON.stringify(selectedMessage.value) } });
  }
};

const confirmDelete = async () => {
  if (!selectedMessage.value?.id) return;

  if (confirm('Czy na pewno chcesz usunąć ten szkic?')) {
    try {
      await deleteDraft(selectedMessage.value.id);
      messages.value = messages.value.filter((d) => d.id !== selectedMessage.value?.id);
      selectedMessage.value = null;
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  }
};

const formatTime = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
};
</script>
