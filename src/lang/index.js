/**
 * 国际化配置
 */
import {createI18n} from 'vue-i18n';
import enLocale from './en';
import zhCNLocale from './zh_CN';
import zhTWLocale from './zh_TW';

const messages = {
  en: enLocale,
  zh_CN: zhCNLocale,
  zh_TW: zhTWLocale
};

const i18n = createI18n({
  messages: messages,
  silentTranslationWarn: true,
  // 默认语言
  locale: localStorage.getItem('i18n-lang') || 'zh_CN'
});

export default i18n;
