<template>
  <a-card title="图片裁剪" :bordered="false">
    <a-space size="middle">
      <a-button
        type="primary"
        @click="visible1=true">1 : 1 裁剪
      </a-button>
      <a-button
        type="primary"
        @click="visible2=true">16 : 9 裁剪
      </a-button>
    </a-space>
    <div v-if="result" style="margin-top: 16px;">
      <img :src="result" style="height: 120px;width: auto;"/>
    </div>
    <!-- 图片裁剪 -->
    <ele-cropper-modal
      :src="src"
      v-model:visible="visible1"
      @done="onDone"/>
    <ele-cropper-modal
      :src="src"
      :aspect-ratio="16/9"
      v-model:visible="visible2"
      @done="onDone"/>
  </a-card>
</template>

<script>
import EleCropperModal from 'ele-admin-pro/packages/ele-cropper-modal';

export default {
  name: 'MoreCropper',
  components: {EleCropperModal},
  data() {
    return {
      visible1: false,
      visible2: false,
      src: 'https://cdn.eleadmin.com/20200610/LrCTN2j94lo9N7wEql7cBr1Ux4rHMvmZ.jpg',
      result: null
    };
  },
  methods: {
    onDone(result) {
      this.result = result;
      this.visible1 = false;
      this.visible2 = false;
    }
  }
}
</script>

<style scoped>
</style>
