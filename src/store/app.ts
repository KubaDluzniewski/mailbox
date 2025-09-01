import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    lang: localStorage.getItem('lang') || (navigator.language.startsWith('pl') ? 'pl' : 'eng')
  }),
  actions: {
    setLang(l: string) {
      this.lang = l
      localStorage.setItem('lang', l)
    }
  }
})
