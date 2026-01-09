<template>
  <div class="bg-white shadow-sm rounded border border-gray-200">
    <div class="px-4 py-2 border-b border-gray-200">
      <h2 class="text-lg font-semibold">{{ title || t('titles.messages') }}</h2>
    </div>

    <div v-if="loading" class="p-4 text-gray-600 flex items-center">
      <svg class="animate-spin h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {{ t('common.loading') }}
    </div>

    <div v-else-if="error" class="p-4">
      <div class="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2">{{ error }}</div>
    </div>

    <div v-else-if="messages.length === 0" class="p-6 text-center text-gray-500 italic">
      {{ t('messageList.noMessages') }}
    </div>

    <ul v-else role="list" class="divide-y divide-gray-200">
      <li v-for="(m, idx) in messages" :key="idx" class="flex items-center">
        <button
          type="button"
          class="flex-grow text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
          @click="onSelect(m, idx)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">
                {{ m.subject || t('messageList.noSubject') }}
              </div>
              <div class="text-xs text-gray-500 truncate" :title="m.body">
                {{ m.body }}
              </div>
            </div>
            <div class="text-sm text-gray-900 truncate">
              {{ dateToString(m.sentDate) }}
            </div>
          </div>
        </button>
        <button
          v-if="showDelete"
          @click="onDelete(m)"
          class="p-2 m-2 text-red-500 hover:text-red-700"
          :aria-label="t('common.delete')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, toRefs } from 'vue';
import { GetMessageModel } from '../models/GetMessageModel';
import { useI18n } from 'vue-i18n';
import { dateToString } from '../utils/functions';

const props = withDefaults(
  defineProps<{
    messages?: GetMessageModel[];
    loading?: boolean;
    error?: string | null;
    showDelete?: boolean;
    title?: string;
  }>(),
  {
    messages: () => [],
    loading: false,
    error: null,
    showDelete: false,
    title: '',
  }
);
const { messages, loading, error, showDelete, title } = toRefs(props);

const emit = defineEmits<{
  (e: 'select', payload: { message: GetMessageModel; index: number }): void;
  (e: 'delete', payload: GetMessageModel): void;
}>();

function onSelect(message: GetMessageModel, index: number) {
  emit('select', { message, index });
}

function onDelete(message: GetMessageModel) {
  emit('delete', message);
}

const { t } = useI18n();
</script>
