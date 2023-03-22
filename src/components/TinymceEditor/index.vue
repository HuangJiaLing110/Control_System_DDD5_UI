<!-- tinymce富文本编辑器组件 license by http://eleadmin.com -->
<template>
  <editor
    :init="config"
    :disabled="disabled"
    :model-value="value"
    @update:model-value="updateValue"/>
</template>

<script>
const BASE_URL = process.env.BASE_URL;
import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/code';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/save';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/link';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/emoticons/js/emojis';
import Editor from '@tinymce/tinymce-vue';
// 默认配置
const defaultConfig = {
  height: 300,
  branding: false,
  skin_url: BASE_URL + 'tinymce/skins/ui/oxide',
  content_css: BASE_URL + 'tinymce/skins/content/default/content.min.css',
  language_url: BASE_URL + 'tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  plugins: [
    'code',
    'print',
    'preview',
    'fullscreen',
    'paste',
    'searchreplace',
    'save',
    'autosave',
    'link',
    'autolink',
    'image',
    'imagetools',
    'media',
    'table',
    'codesample',
    'lists',
    'advlist',
    'hr',
    'charmap',
    'emoticons',
    'anchor',
    'directionality',
    'pagebreak',
    'quickbars',
    'nonbreaking',
    'visualblocks',
    'visualchars',
    'wordcount'
  ].join(' '),
  toolbar: [
    'fullscreen',
    'preview',
    'code',
    '|',
    'undo',
    'redo',
    '|',
    'forecolor',
    'backcolor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'alignleft',
    'aligncenter',
    'alignright',
    'alignjustify',
    '|',
    'outdent',
    'indent',
    '|',
    'numlist',
    'bullist',
    '|',
    'formatselect',
    'fontselect',
    'fontsizeselect',
    '|',
    'link',
    'image',
    'media',
    'emoticons',
    'charmap',
    'anchor',
    'pagebreak',
    'codesample',
    '|',
    'ltr',
    'rtl'
  ].join(' '),
  toolbar_drawer: 'sliding',
  images_upload_handler: (blobInfo, success) => {
    success('data:image/jpeg;base64,' + blobInfo.base64());
  },
  file_picker_types: 'media',
  file_picker_callback: () => {
  }
};

export default {
  name: 'TinymceEditor',
  components: {Editor},
  emits: ['update:value'],
  props: {
    // 值
    value: String,
    // 编辑器配置
    init: Object,
    // 是否禁用
    disabled: Boolean,
    // 自动跟随框架暗黑主题
    autoTheme: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let theme;
    if (this.autoTheme) {
      const darkMode = this.$store.state.theme.darkMode;
      theme = {
        skin_url: BASE_URL + (darkMode ? 'tinymce/skins/ui/oxide-dark' : 'tinymce/skins/ui/oxide'),
        content_css: BASE_URL + (darkMode ? 'tinymce/skins/content/dark/content.min.css' : 'tinymce/skins/content/default/content.min.css')
      }
    }
    let config = Object.assign({}, defaultConfig, this.init, theme);
    return {
      // 编辑器配置
      config: config
    };
  },
  computed: {
    // 是否是暗黑模式
    darkMode() {
      try {
        return this.$store.state.theme.darkMode;
      } catch (e) {
        return null;
      }
    }
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    /* 更新value */
    updateValue(value) {
      this.$emit('update:value', value);
    },
    /* 切换编辑器主题 */
    changeTheme(darkMode) {
      document.head.querySelectorAll('[id^="mce-"]').forEach(elem => {
        let href = elem.getAttribute('href');
        if (href.indexOf('/oxide-dark/') !== -1) {
          if (!darkMode) {
            href = href.replace('/oxide-dark/', '/oxide/');
            elem.setAttribute('href', href);
          }
        } else {
          if (darkMode) {
            href = href.replace('/oxide/', '/oxide-dark/');
            elem.setAttribute('href', href);
          }
        }
      });
      this.changeContentTheme(darkMode);
    },
    /* 切换编辑器内容区的主题 */
    changeContentTheme(darkMode) {
      document.body.querySelectorAll('iframe[id^="tiny-vue_"]').forEach(frame => {
        const win = frame.contentWindow;
        if (win) {
          const doc = win.document;
          if (doc) {
            doc.head.querySelectorAll('[id^="mce-"]').forEach(elem => {
              let href = elem.getAttribute('href');
              if (href.indexOf('/skins/ui/') !== -1) {
                if (href.indexOf('/oxide-dark/') !== -1) {
                  if (!darkMode) {
                    href = href.replace('/oxide-dark/', '/oxide/');
                    elem.setAttribute('href', href);
                  }
                } else {
                  if (darkMode) {
                    href = href.replace('/oxide/', '/oxide-dark/');
                    elem.setAttribute('href', href);
                  }
                }
              } else if (href.indexOf('/skins/content/') !== -1) {
                if (href.indexOf('/dark/') !== -1) {
                  if (!darkMode) {
                    href = href.replace('/dark/', '/default/');
                    elem.setAttribute('href', href);
                  }
                } else {
                  if (darkMode) {
                    href = href.replace('/default/', '/dark/');
                    elem.setAttribute('href', href);
                  }
                }
              }
            });
          }
        }
      });
    }
  },
  watch: {
    darkMode() {
      if (this.autoTheme) {
        this.changeTheme(this.darkMode);
      }
    }
  }
}
</script>

<style>
body .tox-tinymce-aux {
  z-index: 19892000;
}
</style>
