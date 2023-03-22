<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 按钮 -->
      <a-space class="ele-table-tool">
        <a-button
          type="primary"
          @click="showHtml">获取html
        </a-button>
        <a-button
          type="primary"
          @click="showText">获取文本
        </a-button>
        <a-button
          type="primary"
          @click="setContent">修改内容
        </a-button>
      </a-space>
      <!-- 编辑器 -->
      <tinymce-editor
        v-model:value="value"
        :init="{height: 525}"/>
    </a-card>
  </div>
</template>

<script>
import TinymceEditor from '@/components/TinymceEditor';
import {Modal} from 'ant-design-vue';

export default {
  name: 'ExtensionEditor',
  components: {TinymceEditor},
  data() {
    return {
      value: ''
    };
  },
  methods: {
    /* 获取编辑器内容 */
    showHtml() {
      Modal.info({
        maskClosable: true,
        content: this.value
      });
    },
    /* 获取编辑器纯文本内容 */
    showText() {
      Modal.info({
        maskClosable: true,
        content: this.$util.htmlToText(this.value)
      });
    },
    /* 修改编辑器内容 */
    setContent() {
      this.value = [
        '<div style="text-align:center;color:#fff;background-image:linear-gradient(-90deg,rgb(62,119,255),rgb(159,98,212),rgb(255,78,170));padding:32px 0;">',
        '   <div style="font-size:28px;margin-bottom:16px;">EleAdminPro后台管理模板</div>',
        '   <div style="font-size:18px">通用型后台管理模板，界面美观、开箱即用，拥有丰富的组件和模板</div>',
        '</div><br/>'
      ].join('');
    }
  }
}
</script>

<style scoped>
</style>
