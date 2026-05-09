import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './es.json'
import ca from './ca.json'
import en from './en.json'

const browserLang =
  typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'es'
const lng = ['es', 'ca', 'en'].includes(browserLang) ? browserLang : 'es'

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    ca: { translation: ca },
    en: { translation: en },
  },
  lng,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
