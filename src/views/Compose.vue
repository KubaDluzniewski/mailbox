<template>
  <div class="wysiwyg-editor">
    <div class="title">
      <input v-model="subject" :placeholder="t('compose.subjectPlaceholder')" />
    </div>

    <div class="recipients-box">
      <label class="block text-sm font-medium mb-1">{{ t('compose.recipients') }}</label>

      <!-- Selected Recipients Tags -->
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
          <svg
            v-if="r.type === 'group'"
            class="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
            />
          </svg>
          <svg v-else class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>

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
            aria-label="Usuń odbiorcę"
          >
            ×
          </button>
        </span>
      </div>

      <!-- Search Input -->
      <div class="relative">
        <input
          v-model="recipientQuery"
          :placeholder="t('compose.searchUsersAndGroups')"
          @input="onRecipientInput"
          @keydown.escape="suggestions = []"
          class="recipient-input w-full"
        />

        <!-- Loading/Error State -->
        <div v-if="searchLoading" class="text-xs text-gray-500 mt-1">
          {{ t('common.searching') }}
        </div>
        <div v-else-if="searchError" class="text-xs text-red-600 mt-1">{{ searchError }}</div>

        <!-- Suggestions Dropdown -->
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
            @mouseenter="item.type === 'group' ? onGroupHover(item.id) : null"
            @mouseleave="item.type === 'group' ? onGroupLeave() : null"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <!-- Icon -->
              <svg
                v-if="item.type === 'group'"
                class="w-4 h-4 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4 text-blue-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>

              <div class="min-w-0">
                <div class="font-medium truncate">{{ item.displayName }}</div>
                <div class="text-xs text-gray-500 truncate">{{ item.subtitle }}</div>
              </div>
            </div>

            <span
              v-if="item.type === 'group'"
              class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded ml-2 flex-shrink-0"
            >
              Grupa
            </span>

            <!-- Tooltip dla grup -->
            <div
              v-if="item.type === 'group' && hoveredGroupId === item.id && currentGroupDetails"
              class="absolute left-full ml-2 top-0 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-max max-w-xs pointer-events-none"
            >
              <div v-if="loadingGroupDetails" class="text-sm text-gray-500">Ładowanie...</div>

              <div v-else-if="currentGroupDetails">
                <div class="font-semibold text-gray-800 mb-2 text-sm">
                  {{ currentGroupDetails.name }}
                </div>
                <div class="text-xs text-gray-600 mb-2">
                  {{ currentGroupDetails.memberCount }} członków
                </div>

                <!-- Members list -->
                <ul class="border-t border-gray-200 pt-2 space-y-1 max-h-64 overflow-y-auto">
                  <li
                    v-for="member in currentGroupDetails.members"
                    :key="member.id"
                    class="text-xs text-gray-700 flex items-center gap-2"
                  >
                    <svg
                      class="w-3 h-3 text-gray-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium truncate">{{ member.email }}</div>
                      <div class="text-gray-500 truncate text-xs">
                        {{ member.name }} {{ member.surname }}
                      </div>
                    </div>
                  </li>
                </ul>

                <!-- Empty state -->
                <div
                  v-if="currentGroupDetails.members.length === 0"
                  class="text-xs text-gray-500 italic py-2"
                >
                  Brak członków w grupie
                </div>
              </div>
            </div>
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

    <button
      @click="send"
      :disabled="sending || selectedRecipients.length === 0"
      type="button"
      class="btn-send"
    >
      {{ sending ? '...' : t('compose.send') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { sendMessage } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';
import { useRecipients } from '../composables/useRecipients';
import { useEditor } from '../composables/useEditor';

const { t } = useI18n();

// Form state
const subject = ref('');
const sending = ref(false);
const sendError = ref<string | null>(null);

const {
  recipientQuery,
  suggestions,
  selectedRecipients,
  searchLoading,
  searchError,
  hoveredGroupId,
  loadingGroupDetails,
  currentGroupDetails,
  onGroupHover,
  onGroupLeave,
  onRecipientInput,
  addRecipient,
  removeRecipient,
  prepareRecipientsForAPI,
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
});

function updateMessage() {
  message.value = {
    subject: subject.value,
    recipients: selectedRecipients.value,
    body: content.value,
  };
}

async function send() {
  if (sending.value || selectedRecipients.value.length === 0) return;

  sending.value = true;
  sendError.value = null;
  try {
    await sendMessage(message.value);
    // Success - reset form
    subject.value = '';
    selectedRecipients.value = [];
    resetEditor();
  } catch (e: any) {
    console.error('Błąd wysyłania:', e);
    sendError.value = e.message || 'Błąd wysyłania wiadomości';
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = content.value;
  }
});

watch([subject, content, selectedRecipients], () => {
  updateMessage();
}, { deep: true });
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