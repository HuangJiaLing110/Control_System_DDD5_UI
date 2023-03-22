<template>
  <a-card title="动画数字" :bordered="false">
    <h1 style="margin-bottom: 12px;">
      <ele-count-up
        :delay="0"
        :end-val="countUpVal"
        :options="countUpOptions"
        @ready="onCountUpReady"/>
    </h1>
    <a-space>
      <a-button
        type="primary"
        @click="startCountUp">重新开始
      </a-button>
      <a-button
        type="primary"
        @click="updateCountUp">更新数字
      </a-button>
    </a-space>
  </a-card>
</template>

<script>
import EleCountUp from 'ele-admin-pro/packages/ele-count-up';

export default {
  name: 'MoreCountUp',
  components: {EleCountUp},
  data() {
    return {
      // countUp值
      countUpVal: 6317,
      // countUp配置
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      // countUp实例
      countUpIns: null
    };
  },
  methods: {
    /* countUp渲染完成 */
    onCountUpReady(instance) {
      this.countUpIns = instance;
    },
    /* countUp重新开始 */
    startCountUp() {
      if (!this.countUpIns) {
        return;
      }
      this.countUpIns.reset();
      this.countUpIns.start();
    },
    /* countUp更新 */
    updateCountUp() {
      if (!this.countUpIns) {
        return;
      }
      this.countUpIns.update(1000 + Math.round(Math.random() * 9000));
    }
  }
}
</script>

<style scoped>
</style>
