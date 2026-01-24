import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getMessages,
  getDrafts,
  getUnreadCount as fetchUnreadCount,
} from '../services/message.service';

export const useMessageStore = defineStore('message', () => {
  const inboxCount = ref(0);
  const unreadCount = ref(0);
  const draftsCount = ref(0);

  async function fetchCounts() {
    try {
      // Parallelize requests for better performance
      const [inbox, drafts, unread] = await Promise.all([
        getMessages().catch(() => []),
        getDrafts().catch(() => []),
        fetchUnreadCount().catch(() => 0),
      ]);

      inboxCount.value = inbox.length;
      draftsCount.value = drafts.length;
      unreadCount.value = unread;
    } catch (error) {
      console.error('Failed to update message counts', error);
    }
  }

  return {
    inboxCount,
    unreadCount,
    draftsCount,
    fetchCounts,
  };
});
