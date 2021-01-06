import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en/index.js';
import zhLocale from './zh/index.js';
import axios from 'axios';

/* 导入上海农商行国际化文件 */
import {backend_en} from '@/modules/backend';// 英文
import {backend_zh} from '@/modules/backend';// 中文

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...backend_en
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...backend_zh,
  }
}

const i18n = new VueI18n({
  locale: 'en',
  messages
});

const loadedLanguages = {}; // 我们的预装默认语言

function setI18nLanguage(lang = 'cn') {
  i18n.locale = lang;
	axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html').setAttribute('lang', lang);
	return lang;
}

export function loadLanguageAsync(lang = 'cn') {
	let langData = loadedLanguages[lang];
		if (!langData) {
			return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}/index.js`).then(msgs => {
				i18n.mergeLocaleMessage(lang, msgs.default);
				return setI18nLanguage(lang);
      });
            // eslint-disable-next-line no-unreachable
      loadedLanguages[lang] = true;
		} else {
			return Promise.resolve(setI18nLanguage(lang));
		}
}

loadLanguageAsync('en');

export default i18n;
