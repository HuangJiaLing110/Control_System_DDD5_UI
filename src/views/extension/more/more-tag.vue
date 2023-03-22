<template>
  <a-card title="标签" :bordered="false">
    <div class="demo-tag-item">
      <div class="demo-tag-label">预设颜色:</div>
      <div class="demo-tag-content">
        <ele-tag
          :color="colors[type][0]"
          :size="size">标签一
        </ele-tag>
        <ele-tag
          :color="colors[type][1]"
          :size="size">标签二
        </ele-tag>
        <ele-tag
          :color="colors[type][2]"
          :size="size">标签三
        </ele-tag>
        <ele-tag
          :color="colors[type][3]"
          :size="size">标签四
        </ele-tag>
        <ele-tag
          :color="colors[type][4]"
          :size="size">标签五
        </ele-tag>
      </div>
    </div>
    <div class="demo-tag-item">
      <div class="demo-tag-label">圆角样式:</div>
      <div class="demo-tag-content">
        <ele-tag
          :color="colors[type][0]"
          :size="size"
          shape="round">标签一
        </ele-tag>
        <ele-tag
          :color="colors[type][1]"
          :size="size"
          shape="round">标签二
        </ele-tag>
        <ele-tag
          :color="colors[type][2]"
          :size="size"
          shape="round">标签三
        </ele-tag>
        <ele-tag
          :color="colors[type][3]"
          :size="size"
          shape="round">标签四
        </ele-tag>
        <ele-tag
          :color="colors[type][4]"
          :size="size"
          shape="round">标签五
        </ele-tag>
      </div>
    </div>
    <div class="demo-tag-item">
      <div class="demo-tag-label">圆形样式:</div>
      <div class="demo-tag-content">
        <ele-tag
          :color="colors[type][0]"
          :size="size"
          shape="circle">1
        </ele-tag>
        <ele-tag
          :color="colors[type][1]"
          :size="size"
          shape="circle">2
        </ele-tag>
        <ele-tag
          :color="colors[type][2]"
          :size="size"
          shape="circle">3
        </ele-tag>
        <ele-tag
          :color="colors[type][3]"
          :size="size"
          shape="circle">4
        </ele-tag>
        <ele-tag
          :color="colors[type][4]"
          :size="size"
          shape="circle">5
        </ele-tag>
      </div>
    </div>
    <div class="demo-tag-item" style="align-items: flex-start;">
      <div class="demo-tag-label">标签输入:</div>
      <div class="demo-tag-content">
        <ele-edit-tag
          v-model:data="tags"
          :color="colors[type][0]"
          :size="size"/>
        <div>{{ JSON.stringify(tags) }}</div>
      </div>
    </div>
    <div class="demo-tag-item">
      <div class="demo-tag-label">尺寸选择:</div>
      <div class="demo-tag-content">
        <a-radio-group
          :options="sizes"
          v-model:value="size"/>
      </div>
    </div>
    <div class="demo-tag-item">
      <div class="demo-tag-label">主题选择:</div>
      <div class="demo-tag-content">
        <a-radio-group
          :options="types"
          v-model:value="type"/>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'MoreTag',
  data() {
    return {
      size: 'mini',
      sizes: [
        {label: 'mini', value: 'mini'},
        {label: 'small', value: 'small'},
        {label: 'middle', value: 'middle'},
        {label: 'large', value: 'large'}
      ],
      colors: [
        ['', 'blue', 'green', 'orange', 'red'],
        ['#909399', '#1890ff', '#52c41a', '#fa8c16', '#f5222d']
      ],
      types: [
        {label: 'presets', value: 0},
        {label: 'custom', value: 1},
      ],
      type: 0,
      tags: ['标签一', '标签二', '标签三']
    };
  }
}
</script>

<style scoped>
.demo-tag-item {
  display: flex;
  align-items: center;
}

.demo-tag-item .demo-tag-label {
  padding-right: 16px;
}

.demo-tag-item .demo-tag-content {
  flex: 1;
}

.demo-tag-item + .demo-tag-item {
  margin-top: 22px;
}
</style>
