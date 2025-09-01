<template>
  <div class="wysiwyg-editor">
    <div class="title">
      <input
        v-model="subject"
        :placeholder="t('compose.subjectPlaceholder')"
        @input="updateMessage"
      />
    </div>

    <!-- Odbiorcy -->
    <div class="recipients-box">
      <label class="block text-sm font-medium mb-1">{{ t('compose.recipients') }}</label>
      <div class="flex flex-wrap gap-2 mb-2">
        <span
          v-for="r in selectedUsers"
          :key="r.id"
          class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded flex items-center gap-1"
        >
          {{ r.email }}
          <button
            type="button"
            class="text-blue-600 hover:text-blue-900"
            @click="removeRecipient(r.id)"
            aria-label="Usuń odbiorcę"
          >
            ×
          </button>
        </span>
      </div>

      <input
        v-model="recipientQuery"
        :placeholder="t('compose.enterSurnameFragment')"
        @input="onRecipientInput"
        @keydown.enter.prevent="triggerSearch(true)"
        class="recipient-input"
      />

      <!-- Stan ładowania / błąd -->
      <div v-if="searchLoading" class="text-xs text-gray-500 mt-1">{{ t('common.searching') }}</div>
      <div v-else-if="searchError" class="text-xs text-red-600 mt-1">{{ searchError }}</div>

      <!-- Sugestie -->
      <ul
        v-if="suggestions.length > 0"
        class="mt-2 border border-gray-300 rounded bg-white max-h-40 overflow-auto text-sm"
      >
        <li
          v-for="u in suggestions"
          :key="u.id"
          class="px-3 py-1 hover:bg-gray-100 cursor-pointer flex justify-between"
          @click="addRecipient(u)"
        >
          <span>{{ u.email }}</span>
          <span class="text-gray-500">{{ u.surname }}</span>
        </li>
      </ul>
    </div>

    <div class="toolbar">
      <button
        @mousedown.prevent="
          saveSelection;
          format('bold');
        "
        :class="{ active: activeFormats.bold }"
      >
        <b>B</b>
      </button>
      <button
        @mousedown.prevent="
          saveSelection;
          format('italic');
        "
        :class="{ active: activeFormats.italic }"
      >
        <i>I</i>
      </button>
      <button
        @mousedown.prevent="
          saveSelection;
          format('underline');
        "
        :class="{ active: activeFormats.underline }"
      >
        <u>U</u>
      </button>
      <button
        @mousedown.prevent="
          saveSelection;
          insertLink;
        "
      >
        Link
      </button>
    </div>

    <div
      ref="editor"
      class="editor"
      contenteditable="true"
      @input="updateContent"
      @mouseup="
        saveSelection;
        updateActiveFormats;
      "
      @keyup="
        saveSelection;
        updateActiveFormats;
      "
      spellcheck="false"
    />

    <button @click="send" :disabled="sending">
      {{ sending ? '...' : t('compose.send') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { MessageModel, MessageRecipientModel } from '../models/MessageModel';
import { sendMessage } from '../services/message.service';
import type { UserModel } from '../models/UserModel';
import { searchUsersBySurname } from '../services/user.service';

const { t } = useI18n();
const content = ref(``);
const editor = ref<HTMLElement | null>(null);
const subject = ref();

const recipientQuery = ref('');
const suggestions = ref<UserModel[]>([]);
const selectedUsers = ref<UserModel[]>([]);
const searchLoading = ref(false);
const searchError = ref<string | null>(null);
const sending = ref(false);

// recipients = wynik mapowania selectedUsers -> MessageRecipientModel
const recipients = ref<MessageRecipientModel[]>([]);

const message = ref<MessageModel>({
  subject: subject.value,
  recipients: recipients.value,
  body: content.value,
});

const updateMessage = () => {
  message.value = {
    subject: subject.value,
    recipients: recipients.value,
    body: content.value,
  };
};

watch([subject, content, recipients], updateMessage, { deep: true });

const activeFormats = ref({
  bold: false,
  italic: false,
  underline: false,
});

const saveSelection = () => {
  // Tu mógłbyś zapisać range do późniejszego użycia
  window.getSelection();
};

const updateActiveFormats = () => {
  activeFormats.value.bold = document.queryCommandState('bold');
  activeFormats.value.italic = document.queryCommandState('italic');
  activeFormats.value.underline = document.queryCommandState('underline');
};

const format = (command: string) => {
  editor.value?.focus();
  document.execCommand(command, false, undefined);
  updateContent();
  updateActiveFormats();
};

const insertLink = () => {
  const url = prompt('Enter URL:');
  if (url) {
    document.execCommand('createLink', false, url);
    updateContent();
  }
};

const updateContent = () => {
  if (editor.value) {
    content.value = editor.value.innerHTML;
  }
};

function updateRecipientsFromSelected() {
  recipients.value = selectedUsers.value.map((u: UserModel) => ({ userId: u.id }));
}

const addRecipient = (u: UserModel) => {
  if (!selectedUsers.value.some((s: UserModel) => s.id === u.id)) {
    selectedUsers.value.push(u);
    updateRecipientsFromSelected();
    updateMessage();
  }
  // wyczyść podpowiedzi
  recipientQuery.value = '';
  suggestions.value = [];
};

const removeRecipient = (id: number) => {
  selectedUsers.value = selectedUsers.value.filter((u: UserModel) => u.id !== id);
  updateRecipientsFromSelected();
  updateMessage();
};

let debounceTimer: number | null = null;

function onRecipientInput() {
  if (debounceTimer) window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => triggerSearch(false), 300);
}

const triggerSearch = async (force: boolean) => {
  const term = recipientQuery.value.trim();
  if (!term) {
    suggestions.value = [];
    return;
  }
  if (!force) {
    suggestions.value = [];
    return;
  }
  searchError.value = null;
  searchLoading.value = true;
  suggestions.value = [];
  try {
    const users = await searchUsersBySurname(term);
    suggestions.value = users.filter(
      (u: UserModel) => !selectedUsers.value.some((s: UserModel) => s.id === u.id)
    );
  } catch (e: any) {
    searchError.value = e.message || 'Błąd wyszukiwania';
  } finally {
    searchLoading.value = false;
  }
};

const send = async () => {
  if (sending.value) return;
  sending.value = true;
  try {
    await sendMessage(message.value);
    // po sukcesie możesz wyczyścić formularz:
    // selectedUsers.value = [];
    // updateRecipientsFromSelected();
  } catch (e) {
    console.error('Błąd wysyłania', e);
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = content.value;
  }
  updateMessage();
});
</script>

<style scoped>
.editor {
  border: 1px solid #ccc;
  min-height: 200px;
  padding: 8px;
  margin-top: 8px;
}

.toolbar button {
  margin-right: 4px;
  padding: 4px 8px;
}

.toolbar button.active {
  background-color: #007bff;
  color: white;
}

.recipient-input {
  border: 1px solid #ccc;
  padding: 4px 6px;
  width: 100%;
  max-width: 320px;
}

.recipients-box {
  margin-bottom: 12px;
}
</style>
