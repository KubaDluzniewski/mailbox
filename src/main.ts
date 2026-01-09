import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';
import './assets/tailwind.css';
import router from './router';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
import { useAppStore } from './store/app';
import { useUserStore } from './store/user';
import { i18n } from './utils/i18n';
const appStore = useAppStore();

useUserStore().initFromStorage();

i18n.global.locale.value = appStore.lang === 'pl' ? 'pl' : 'eng';
app.use(i18n);
app.mount('#app');
