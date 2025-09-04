import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import './assets/tailwind.css';
import router from './router';

// removed primeicons as we no longer use PrimeVue icons

import { i18n } from './utils/i18n';

import { createPinia } from 'pinia';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

const pinia = createPinia();

// Stwórz aplikację i dodaj Pinia
const app = createApp(App);
app.config.globalProperties.$dayjs = dayjs;
app.use(pinia);
app.use(router);
// Teraz możemy użyć store
import { useAppStore } from './store/app';
import { useUserStore } from './store/user';
const appStore = useAppStore();
// Initialize auth from localStorage and schedule auto-logout if needed
useUserStore().initFromStorage();

// Ustaw język z store
i18n.global.locale.value = appStore.lang === 'pl' ? 'pl' : 'eng';
app.use(i18n);
app.mount('#app');
