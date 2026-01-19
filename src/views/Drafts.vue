<template>
  <div class="flex h-full gap-6">
    <div
      class="w-1/3 min-w-[350px] flex flex-col glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden"
    >
      <div
        class="p-5 border-b border-slate-100/50 flex justify-between items-center shrink-0 bg-gradient-to-r from-white/50 to-blue-50/30"
      >
        <h2 class="text-xl font-black gradient-text">{{ t('main.drafts') }}</h2>
        <Button
          icon="pi pi-filter"
          class="p-button-rounded p-button-text p-button-sm text-slate-400 hover-lift"
        />
      </div>
      <div class="px-5 py-3 border-b border-slate-100/50 bg-white/50">
        <input
          v-model="search"
          type="text"
          :placeholder="t('main.search')"
          class="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
        />
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div
          v-else-if="filteredMessages.length === 0"
          class="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center"
        >
          <i class="pi pi-file-edit text-5xl mb-4 opacity-20"></i>
          <p class="font-medium text-slate-500">Brak szkiców</p>
        </div>
        <div v-else>
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            @click="selectedMessage = msg"
            :class="[
              'p-5 border-b border-slate-50 cursor-pointer transition-all relative group hover-lift',
              selectedMessage?.id === msg.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50/30'
                : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/20',
            ]"
          >
            <div
              v-if="selectedMessage?.id === msg.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-700 rounded-r-full"
            ></div>
            <div class="flex justify-between items-start mb-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-slate-700">
                  Do:
                  {{
                    msg.recipients && msg.recipients.length > 0
                      ? msg.recipients.map((r) => r.displayName).join(', ')
                      : 'Brak odbiorców'
                  }}
                </span>
              </div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{{
                formatTime(msg.createdAt)
              }}</span>
            </div>
            <p class="text-sm mb-1 truncate font-medium text-slate-700">
              {{ msg.subject || t('messageList.noSubject') }}
            </p>
            <p class="text-xs text-slate-400 line-clamp-1 italic">
              {{ msg.body.replace(/<[^>]*>/g, '') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 glass-effect rounded-3xl border border-white/50 shadow-lg overflow-hidden flex flex-col"
    >
      <template v-if="selectedMessage">
        <div class="p-8 border-b border-slate-100 bg-slate-50/30 shrink-0">
          <div class="flex justify-between items-start mb-6">
            <h1 class="text-3xl font-black text-slate-900 leading-tight">
              {{ selectedMessage.subject || t('messageList.noSubject') }}
            </h1>
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-outlined p-button-sm rounded-xl hover-lift hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                v-tooltip.top="'Edytuj szkic'"
                @click="editDraft"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger p-button-sm rounded-xl hover-lift hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all"
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
              class="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 font-bold shadow-md hover-glow"
            />
            <div>
              <p class="font-bold text-slate-900">
                Do:
                {{
                  selectedMessage &&
                  selectedMessage.recipients &&
                  selectedMessage.recipients.length > 0
                    ? selectedMessage.recipients.map((r) => r.displayName).join(', ')
                    : 'Brak odbiorców'
                }}
              </p>
              <p class="text-xs text-slate-500">
                Utworzono: {{ formatDate(selectedMessage?.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-10 prose prose-slate max-w-none">
          <div class="text-slate-700 leading-relaxed text-lg" v-html="selectedMessage.body"></div>
        </div>
      </template>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20"
      >
        <div
          class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-6"
        >
          <i class="pi pi-file-edit text-5xl opacity-20"></i>
        </div>
        <p class="text-lg font-bold text-slate-400">Wybierz szkic, aby go wyświetlić</p>
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
