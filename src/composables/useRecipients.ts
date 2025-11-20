import { ref, computed } from 'vue';
import type { Recipient, GroupInfo } from '../types/vicons';
import { searchRecipients as apiSearchRecipients, getGroupDetails as apiGetGroupDetails } from '../services/api';

export function useRecipients() {
  const recipientQuery = ref('');
  const suggestions = ref<Recipient[]>([]);
  const selectedRecipients = ref<Recipient[]>([]);
  const searchLoading = ref(false);
  const searchError = ref<string | null>(null);
  const hoveredGroupId = ref<number | null>(null);
  const groupDetails = ref<Map<number, GroupInfo>>(new Map());
  const loadingGroupDetails = ref(false);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const currentGroupDetails = computed(() => {
    if (!hoveredGroupId.value) return null;
    return groupDetails.value.get(hoveredGroupId.value) || null;
  });

  async function fetchGroupDetails(groupId: number) {
    if (groupDetails.value.has(groupId)) {
      return groupDetails.value.get(groupId)!;
    }

    loadingGroupDetails.value = true;
    try {
      const groupInfo = await apiGetGroupDetails(groupId);
      groupDetails.value.set(groupId, groupInfo);
      return groupInfo;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    } finally {
      loadingGroupDetails.value = false;
    }
  }

  async function onGroupHover(groupId: number) {
    hoveredGroupId.value = groupId;
    await fetchGroupDetails(groupId);
  }

  function onGroupLeave() {
    hoveredGroupId.value = null;
  }

  function onRecipientInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => triggerSearch(), 300);
  }

  async function triggerSearch() {
    const term = recipientQuery.value.trim();
    if (!term) {
      suggestions.value = [];
      return;
    }

    searchError.value = null;
    searchLoading.value = true;
    suggestions.value = [];

    try {
      const results = await apiSearchRecipients(term);
      suggestions.value = results.filter(
        (item: Recipient) =>
          !selectedRecipients.value.some((s: Recipient) => s.type === item.type && s.id === item.id)
      );
    } catch (e: any) {
      searchError.value = e.message || 'Błąd wyszukiwania';
    } finally {
      searchLoading.value = false;
    }
  }

  function addRecipient(item: Recipient) {
    if (!selectedRecipients.value.some((s: Recipient) => s.type === item.type && s.id === item.id)) {
      selectedRecipients.value.push(item);
    }
    recipientQuery.value = '';
    suggestions.value = [];
  }

  function removeRecipient(item: Recipient) {
    selectedRecipients.value = selectedRecipients.value.filter(
      (r: Recipient) => !(r.type === item.type && r.id === item.id)
    );
  }

  function prepareRecipientsForAPI() {
    return {
      userIds: selectedRecipients.value.filter((r) => r.type === 'user').map((r) => r.id),
      groupIds: selectedRecipients.value.filter((r) => r.type === 'group').map((r) => r.id),
    };
  }

  return {
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
  };
}
