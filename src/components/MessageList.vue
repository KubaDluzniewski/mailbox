<template>
  <div class="bg-white shadow-sm rounded border border-gray-200">
    <div class="px-4 py-2 border-b border-gray-200">
      <h2 class="text-lg font-semibold">{{ t('titles.messages') }}</h2>
    </div>

    <!-- Loading -->
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

    <!-- Error -->
    <div v-else-if="error" class="p-4">
      <div class="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2">{{ error }}</div>
    </div>

    <!-- Empty -->
    <div v-else-if="messages.length === 0" class="p-6 text-center text-gray-500 italic">
      {{ t('messageList.noMessages') }}
    </div>

    <!-- List -->
    <ul v-else role="list" class="divide-y divide-gray-200">
      <li v-for="(m, idx) in messages" :key="idx">
        <button
          type="button"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
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
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, toRefs } from 'vue';
import { GetMessageModel } from '../models/GetMessageModel';
import { useI18n } from 'vue-i18n';
const props = withDefaults(
  defineProps<{
    messages?: GetMessageModel[];
    loading?: boolean;
    error?: string | null;
  }>(),
  {
    messages: () => [],
    loading: false,
    error: null,
  }
);
const { messages, loading, error } = toRefs(props);

const emit = defineEmits<{
  (e: 'select', payload: { message: GetMessageModel; index: number }): void;
}>();

function onSelect(message: GetMessageModel, index: number) {
  emit('select', { message, index });
}
const { t } = useI18n();
</script>

<style scoped>
/* opcjonalne drobne poprawki wyglądu */
</style>
