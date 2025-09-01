import { createI18n } from 'vue-i18n';
import pl from '../locales/pl.json';
import eng from '../locales/eng.json';

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'eng',
  fallbackLocale: 'eng',
  messages: { eng, pl },
});
