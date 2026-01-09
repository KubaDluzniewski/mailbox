<template>
  <div class="p-2 sm:p-4">
    <MessageList
      :messages="draftsForList"
      :loading="loading"
      :error="error"
      @select="onSelectDraft"
      :show-delete="true"
      @delete="removeDraft"
      :title="t('main.drafts')"
    />
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
import type { GetMessageModel } from '../models/GetMessageModel';

const { t } = useI18n();
const drafts = ref<MessageModel[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const emptyUser: UserModel = { id: 0, email: '', name: '', surname: '', isActive: false };
const draftsForList = computed(() =>
  drafts.value.map((d) => ({
    id: d.id,
    subject: d.subject || t('messageList.noSubject'),
    recipients: d.recipients ? d.recipients.map((r) => ({ userId: r.id })) : [],
    body: d.body,
    sentDate: d.createdAt ? new Date(d.createdAt) : new Date(0),
    sender: emptyUser,
    createdAt: d.createdAt,
  }))
);

async function fetchDrafts() {
  loading.value = true;
  error.value = null;
  try {
    drafts.value = await getDrafts();
  } catch (e: any) {
    error.value = e.message || t('errors.fetchDrafts');
  } finally {
    loading.value = false;
  }
}

async function removeDraft(message: GetMessageModel) {
  const id = message.id;
  if (!id) return;
  try {
    await deleteDraft(id);
    drafts.value = drafts.value.filter((d) => d.id !== id);
  } catch (e) {
    // obsłuż błąd
  }
}

function onSelectDraft({ message }: { message: any; index: number }) {
  const draft = drafts.value.find((d) => d.id === message.id);
  if (draft) {
    router.push({ name: 'Compose', query: { draft: JSON.stringify(draft) } });
  }
}

onMounted(fetchDrafts);
</script>
