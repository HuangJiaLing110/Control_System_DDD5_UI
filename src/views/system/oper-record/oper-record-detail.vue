<!-- 详情弹窗 -->
<template>
  <a-modal
    title="详情"
    :width="640"
    :footer="null"
    :visible="visible"
    @update:visible="updateVisible">
    <a-form
      class="ele-form-detail"
      :label-col="{sm: {span: 8}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 16}, xs: {span: 18}}">
      <a-row :gutter="16">
        <a-col :sm="12" :xs="24">
          <a-form-item label="操作人:">
            <div class="ele-text-secondary">
              {{ data.nickname }}({{ data.username }})
            </div>
          </a-form-item>
          <a-form-item label="操作模块:">
            <div class="ele-text-secondary">
              {{ data.model }}
            </div>
          </a-form-item>
          <a-form-item label="操作时间:">
            <div class="ele-text-secondary">
              {{ $util.toDateString(data.createTime) }}
            </div>
          </a-form-item>
          <a-form-item label="请求方式:">
            <div class="ele-text-secondary">
              {{ data.requestMethod }}
            </div>
          </a-form-item>
        </a-col>
        <a-col :sm="12" :xs="24">
          <a-form-item label="IP地址:">
            <div class="ele-text-secondary">
              {{ data.ip }}
            </div>
          </a-form-item>
          <a-form-item label="操作功能:">
            <div class="ele-text-secondary">
              {{ data.description }}
            </div>
          </a-form-item>
          <a-form-item label="请求耗时:">
            <div class="ele-text-secondary">
              {{ data.spendTime / 1000 }}s
            </div>
          </a-form-item>
          <a-form-item label="请求状态:">
            <a-tag :color="['green', 'red'][data.state]">
              {{ ['正常', '异常'][data.state] }}
            </a-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin: 12px 0;">
        <a-divider/>
      </div>
      <a-form-item
        label="请求地址:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.url }}
        </div>
      </a-form-item>
      <a-form-item
        label="调用方法:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.operMethod }}
        </div>
      </a-form-item>
      <a-form-item
        label="请求参数:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.param }}
        </div>
      </a-form-item>
      <a-form-item
        label="返回结果:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.result }}
        </div>
      </a-form-item>
      <a-form-item
        label="备注:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.comments }}
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'OperRecordDetail',
  emits: ['update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 数据
    data: Object
  },
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
