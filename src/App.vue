<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ele-admin-pro/packages/lang/zh_CN';
import zh_TW from 'ele-admin-pro/packages/lang/zh_TW';
import en from 'ele-admin-pro/packages/lang/en_US';
const languages = {zh_CN, zh_TW, en};

export default {
  data() {
    return {
      locale: languages[this.$i18n.locale]
    };
  },
  computed: {
    language() {
      return this.$i18n.locale;
    }
  },
  watch: {
    language() {
      this.locale = languages[this.$i18n.locale];
    }
  }
};
</script>
