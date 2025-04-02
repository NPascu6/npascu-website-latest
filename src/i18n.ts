// src/i18n.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)             // Load translations using HTTP (from your public folder)
    .use(LanguageDetector)        // Detects the user language automatically
    .use(initReactI18next)        // Pass the i18n instance to react-i18next
    .init({
        fallbackLng: 'en',
        defaultNS: 'translation',
        ns: ['translation'],
        debug: true,
        interpolation: {
            escapeValue: false,       // React already escapes values
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',  // Make sure your translation files are here
        },
    });

export default i18n;
