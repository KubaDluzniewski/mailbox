import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  timeoutMs: number;
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastItem[],
    _nextId: 1,
  }),
  actions: {
    push(type: ToastType, message: string, timeoutMs = 3000) {
      const id = this._nextId++;
      const item: ToastItem = { id, type, message, timeoutMs };
      this.toasts.push(item);
      if (timeoutMs > 0) {
        window.setTimeout(() => this.remove(id), timeoutMs);
      }
      return id;
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
    clear() {
      this.toasts = [];
    },
  },
});
