import { ref } from 'vue';
import type { Recipient } from '../types/vicons';
import { getGroupsSuggestions } from '../services/group.service';
import { getUserSuggestions } from '../services/user.service';
import { UserRole, type UserModel } from '../models/UserModel';
import type { GroupModel } from '../models/GroupModel';
import { useUserStore } from '../store/user';

export function useRecipients() {
  const recipientQuery = ref('');
  const suggestions = ref<Recipient[]>([]);
  const selectedRecipients = ref<Recipient[]>([]);
  const searchLoading = ref(false);
  const searchError = ref<string | null>(null);
  const loadingGroupDetails = ref(false);
  let lastQuery = '';
  const userStore = useUserStore();

  async function triggerSearch() {
    const queryValue = recipientQuery.value.trim();
    if (!queryValue || queryValue.length < 3) {
      suggestions.value = [];
      return;
    }

    if (queryValue === lastQuery) {
      return;
    }

    lastQuery = queryValue;
    searchError.value = null;
    searchLoading.value = true;
    suggestions.value = [];
    try {
      const user = userStore.user;
      const roles = user?.roles || [];
      const canSendToGroups = roles.includes(UserRole.ADMIN) || roles.includes(UserRole.LECTURER);

      let groupResults: GroupModel[] = [];
      if (canSendToGroups) {
        groupResults = await getGroupsSuggestions(queryValue);
      }

      const userResults: UserModel[] = await getUserSuggestions(queryValue);

      // Filter users if current user is Student (and not higher)
      // Student can only send to ADMIN or LECTURER
      let filteredUsers = userResults;
      if (!canSendToGroups) {
        filteredUsers = userResults.filter(
          (u) => u.roles.includes(UserRole.ADMIN) || u.roles.includes(UserRole.LECTURER)
        );
      }

      const groupSuggestions: Recipient[] = groupResults.map((g: GroupModel) => ({
        id: g.id,
        type: 'group',
        displayName: g.name,
        subtitle: 'Grupa',
      }));

      const userSuggestions: Recipient[] = filteredUsers.map((u: UserModel) => ({
        id: u.id,
        type: 'user',
        displayName: `${u.name} ${u.surname}`,
        subtitle: u.email,
      }));

      suggestions.value = [...groupSuggestions, ...userSuggestions];
    } catch (e: any) {
      searchError.value = e.message || 'Błąd wyszukiwania';
    } finally {
      searchLoading.value = false;
    }
  }

  function addRecipient(item: Recipient) {
    if (
      !selectedRecipients.value.some((s: Recipient) => s.type === item.type && s.id === item.id)
    ) {
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

  return {
    recipientQuery,
    suggestions,
    selectedRecipients,
    searchLoading,
    searchError,
    loadingGroupDetails,
    addRecipient,
    removeRecipient,
    triggerSearch,
  };
}
