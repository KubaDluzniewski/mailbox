import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Tooltip from 'primevue/tooltip';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
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
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
});
app.component('Password', Password);
app.component('InputText', InputText);
app.component('InputSwitch', InputSwitch);
app.component('SelectButton', SelectButton);
app.component('Button', Button);
app.component('Avatar', Avatar);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.directive('tooltip', Tooltip);
import { useAppStore } from './store/app';
import { useUserStore } from './store/user';
import { i18n } from './utils/i18n';
const appStore = useAppStore();

useUserStore().initFromStorage();

i18n.global.locale.value = appStore.lang === 'pl' ? 'pl' : 'eng';
app.use(i18n);
app.mount('#app');
