import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import zh from '../messages/zh.json';

Vue.use(VueI18n);

store.dispatch('fetchLanguages');

const i18n = new VueI18n({
  messages: {
    zh,
  },
  locale: 'zh',
  fallbackLocale: 'zh',
});

export default i18n;
