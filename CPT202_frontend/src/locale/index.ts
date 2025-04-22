import {createI18n} from "vue-i18n";
import en from './en.ts'
import zh from './zh.ts'

const i18n = createI18n({
  locale: 'en',
  legacy: false,
  messages: {
    en: en,
    zh: zh
  }
})
export default i18n
