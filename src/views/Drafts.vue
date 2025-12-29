
<template>
  <div class="p-2 sm:p-4">
    <MessageList
      :messages="draftsForList"
      :loading="loading"
      :error="error"
      @select="onSelectDraft"
      :show-actions="false"
    />
    <div v-if="drafts.length > 0" class="mt-4 flex flex-col gap-2">
      <button
        v-for="draft in drafts"
        :key="'delete-' + draft.id"
        @click="removeDraft(draft.id ?? -1)"
        class="text-red-600 hover:underline self-end text-sm"
        :disabled="!draft.id"
      > 
        {{ t('common.delete') }}: {{ draft.subject || t('common.noSubject') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getDrafts, deleteDraft } from '../services/message.service';
import type { MessageModel } from '../models/MessageModel';
import { useI18n } from 'vue-i18n';
import MessageList from '../components/MessageList.vue';
import type { UserModel } from '../models/UserModel';

const { t } = useI18n();
const drafts = ref<MessageModel[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const emptyUser: UserModel = { id: 0, email: '', name: '', surname: '', isActive: false };
const draftsForList = computed(() =>
  drafts.value.map(d => ({
    subject: d.subject || t('messageList.noSubject'),
    recipients: d.recipients ? d.recipients.map(r => ({ userId: r.id })) : [],
    body: d.body,
    sentDate: new Date(0),
    sender: emptyUser,
  }))
);

async function fetchDrafts() {
  loading.value = true;
  error.value = null;
  try {
    drafts.value = await getDrafts();
    console.log(drafts.value)
  } catch (e: any) {
    error.value = e.message || 'Błąd pobierania roboczych';
  } finally {
    loading.value = false;
  }
}

async function removeDraft(id: number) {
  if (id < 0) return;
  try {
    await deleteDraft(id);
    drafts.value = drafts.value.filter(d => d.id !== id);
  } catch (e) {
    // obsłuż błąd
  }
}

function onSelectDraft({ message }: { message: any; index: number }) {
  const draft = drafts.value.find(d => d.subject === message.subject && d.body === message.body);
  if (draft) {
    router.push({ name: 'Compose', query: { draft: JSON.stringify(draft) } });
  }
}

onMounted(fetchDrafts);
</script>
