import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslation from './locales/en.json';
import srLatinTranslation from './locales/sr-Latn.json';
import srCyrillicTranslation from './locales/sr-Cyrl.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      'sr-Latn': {
        translation: srLatinTranslation
      },
      'sr-Cyrl': {
        translation: srCyrillicTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;