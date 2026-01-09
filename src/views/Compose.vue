<template>
  <div class="wysiwyg-editor">
    <div class="title">
      <input v-model="subject" :placeholder="t('compose.subjectPlaceholder')" />
    </div>

    <div class="recipients-box">
      <label class="block text-sm font-medium mb-1">{{ t('compose.recipients') }}</label>

      <div class="flex flex-wrap gap-2 mb-2">
        <span
          v-for="r in selectedRecipients"
          :key="`${r.type}-${r.id}`"
          :class="[
            'px-2 py-1 text-xs rounded flex items-center gap-1 border',
            r.type === 'user'
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-green-100 text-green-700 border-green-300',
          ]"
        >
          <!-- Icon indicator -->
          <GroupIcon v-if="r.type === 'group'" />
          <UserIcon v-else />

          <span class="flex-shrink-0">{{ r.displayName }}</span>

          <button
            type="button"
            class="ml-1 flex-shrink-0 hover:opacity-70 transition-opacity"
            :class="
              r.type === 'user'
                ? 'text-blue-600 hover:text-blue-900'
                : 'text-green-600 hover:text-green-900'
            "
            @click="removeRecipient(r)"
            :aria-label="t('compose.removeRecipient')"
          >
            ×
          </button>
        </span>
      </div>

      <div class="relative">
        <input
          v-model="recipientQuery"
          :placeholder="t('compose.searchUsersAndGroups')"
          @keydown.escape="suggestions = []"
          @keydown.enter.prevent="triggerSearch"
          class="recipient-input w-full"
        />

        <div v-if="searchLoading" class="text-xs text-gray-500 mt-1">
          {{ t('common.searching') }}
        </div>
        <div v-else-if="searchError" class="text-xs text-red-600 mt-1">{{ searchError }}</div>

        <ul
          v-if="suggestions.length > 0"
          class="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded bg-white max-h-60 overflow-auto text-sm shadow-lg z-10"
        >
          <li
            v-for="item in suggestions"
            :key="`${item.type}-${item.id}`"
            :class="[
              'px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between transition-colors relative',
              item.type === 'group' ? 'bg-green-50' : '',
            ]"
            @click="addRecipient(item)"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <GroupIcon
                v-if="item.type === 'group'"
                class="w-4 h-4 text-green-600 flex-shrink-0"
              />
              <UserIcon v-else class="w-4 h-4 text-blue-600 flex-shrink-0" />

              <div class="min-w-0">
                <div class="font-medium truncate">{{ item.displayName }}</div>
                <div class="text-xs text-gray-500 truncate">{{ item.subtitle }}</div>
              </div>
            </div>

            <span
              v-if="item.type === 'group'"
              class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2 flex-shrink-0"
            >
              {{ t('compose.group') }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="toolbar">
      <button
        @mousedown.prevent="
          () => {
            saveSelection();
            format('bold');
          }
        "
        :class="{ active: activeFormats.bold }"
        type="button"
      >
        <b>B</b>
      </button>
      <button
        @mousedown.prevent="
          () => {
            saveSelection();
            format('italic');
          }
        "
        :class="{ active: activeFormats.italic }"
        type="button"
      >
        <i>I</i>
      </button>
      <button
        @mousedown.prevent="
          () => {
            saveSelection();
            format('underline');
          }
        "
        :class="{ active: activeFormats.underline }"
        type="button"
      >
        <u>U</u>
      </button>
    </div>

    <div
      ref="editor"
      class="editor"
      contenteditable="true"
      @input="updateContent"
      @mouseup="
        () => {
          saveSelection();
          updateActiveFormats();
        }
      "
      @keyup="
        () => {
          saveSelection();
          updateActiveFormats();
        }
      "
      spellcheck="false"
    />

    <div class="flex gap-2 mt-4">
      <button
        @click="send"
        :disabled="sending || selectedRecipients.length === 0"
        type="button"
        class="btn-send"
      >
        {{ sending ? '...' : t('compose.send') }}
      </button>
      <button
        @click="saveDraftManually"
        :disabled="sending"
        type="button"
        class="btn-send"
        style="background-color: #6c757d;"
      >
        {{ t('compose.saveDraft') }}
      </button>
      <span v-if="draftSaved" class="text-green-600 text-xs ml-2">{{ t('compose.draftSaved') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { sendMessage, saveDraft, updateDraft } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';
import { useRecipients } from '../composables/useRecipients';
import { useEditor } from '../composables/useEditor';
import GroupIcon from '../components/icons/GroupIcon.vue';
import UserIcon from '../components/icons/UserIcon.vue';

const { t } = useI18n();

// Form state
const subject = ref('');
const sending = ref(false);
const sendError = ref<string | null>(null);
const draftId = ref<number | null>(null);
const draftSaved = ref(false);
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const route = useRoute();
const router = useRouter();

const {
  recipientQuery,
  suggestions,
  selectedRecipients,
  searchLoading,
  searchError,
  addRecipient,
  removeRecipient,
  triggerSearch,
} = useRecipients();

const {
  editor,
  content,
  activeFormats,
  saveSelection,
  updateActiveFormats,
  format,
  updateContent,
  resetEditor,
} = useEditor();


// Message model
const message = ref<MessageModel>({
  subject: '',
  recipients: [],
  body: '',
  isDraft: true,
});

function updateMessage() {
  message.value = {
    id: draftId.value || undefined,
    subject: subject.value,
    recipients: selectedRecipients.value,
    body: content.value,
    isDraft: true,
  };
}


async function send() {
  updateMessage(); // Make sure message.value is up-to-date
  if (sending.value || selectedRecipients.value.length === 0) return;

  sending.value = true;
  sendError.value = null;
  try {
    await sendMessage({ ...message.value, isDraft: false });
    subject.value = '';
    selectedRecipients.value = [];
    resetEditor();
    draftId.value = null;
    draftSaved.value = false;
  } catch (e: any) {
    console.error(t('errors.sendError'), e);
    sendError.value = e.message || t('errors.sendMessage');
  } finally {
    sending.value = false;
  }
}

async function saveDraftManually() {
  await saveOrUpdateDraft();
}


async function saveOrUpdateDraft() {
  updateMessage();
  if (!subject.value.trim() || selectedRecipients.value.length === 0) {
    return;
  }
  try {
    let result: MessageModel;
    if (draftId.value) {
      result = await updateDraft(message.value);
    } else {
      result = await saveDraft(message.value);
      draftId.value = result.id || null;
    }
    draftSaved.value = true;
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => (draftSaved.value = false), 2000);
  } catch (e) {
    // opcjonalnie obsłuż błąd
  }
}


onMounted(() => {
  // Jeśli w query jest draft, załaduj go
  if (route.query.draft) {
    try {
      const draft: MessageModel = JSON.parse(route.query.draft as string);
      subject.value = draft.subject || '';
      selectedRecipients.value = draft.recipients || [];
      content.value = draft.body || '';
      draftId.value = draft.id || null;
      // Wyczyść query po załadowaniu, by nie nadpisywać przy kolejnych wejściach
      router.replace({ query: { ...route.query, draft: undefined } });
    } catch (e) {
      // niepoprawny draft w query
    }
  }
  if (editor.value) {
    editor.value.innerHTML = content.value;
  }
});

watch(
  [subject, content, selectedRecipients],
  () => {
    // autozapis po 1s od ostatniej zmiany
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => {
      saveOrUpdateDraft();
    }, 1000);
    updateMessage();
  },
  { deep: true }
);
</script>

<style scoped>
.wysiwyg-editor {
  padding: 20px;
  max-width: 800px;
}

.title input {
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid #ddd;
  padding: 10px 0;
  margin-bottom: 20px;
  outline: none;
}

.title input:focus {
  border-bottom-color: #007bff;
}

.recipients-box {
  margin-bottom: 20px;
}

.recipient-input {
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.recipient-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.toolbar {
  display: flex;
  gap: 8px;
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.toolbar button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s;
}

.toolbar button:hover {
  background-color: #f0f0f0;
}

.toolbar button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 200px;
  padding: 12px;
  margin: 15px 0;
  font-size: 14px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.editor:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-send {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-send:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-send:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

ul li div {
  animation: fadeIn 0.2s ease-out;
}
</style>
