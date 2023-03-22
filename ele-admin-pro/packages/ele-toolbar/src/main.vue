<!-- 表格工具栏组件 license by http://eleadmin.com -->
<template>
  <div :class="['ele-table-tool', {'ele-table-tool-default': 'default'===theme}]">
    <div class="ele-table-tool-title ele-cell">
      <div v-if="title||subTitle" style="margin-right: 8px;">
        <h6 v-if="title">{{ title }}</h6>
        <div v-if="subTitle">{{ subTitle }}</div>
      </div>
      <div class="ele-cell-content" style="margin-left: 0;">
        <slot/>
      </div>
    </div>
    <ele-pro-table-tools
      v-if="tools"
      ref="tool"
      :size="size"
      :columns="columns"
      :tools="tools"
      :space="space"
      :columns-sort="columnsSort"
      :custom-style="toolkitStyle"
      :is-fullscreen="isFullscreen||fullscreen"
      @reload="reload"
      @update:size="updateSize"
      @update:columns="updateColumns"
      @fullscreen="toggleFullscreen">
      <slot name="action"/>
    </ele-pro-table-tools>
  </div>
</template>

<script>
import EleProTableTools from '../../ele-pro-table-tools';

export default {
  name: 'EleToolbar',
  components: {EleProTableTools},
  emits: [
    'reload',
    'update:size',
    'update:columns',
    'fullscreen'
  ],
  props: {
    // 主题风格
    theme: String,
    // 标题
    title: String,
    // 二级标题
    subTitle: String,
    // 表格尺寸
    size: {
      type: String,
      default: 'default'
    },
    // 表格列配置
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 工具按钮布局
    tools: {
      type: Array,
      default() {
        return ['reload', 'size', 'columns', 'fullscreen'];
      }
    },
    // 是否开启列拖拽排序
    columnsSort: {
      type: Boolean,
      default: true
    },
    // 工具栏右侧样式
    toolkitStyle: [Object, String],
    // 是否是全屏状态
    isFullscreen: Boolean
  },
  data() {
    return {
      fullscreen: false
    };
  },
  computed: {
    // 右侧工具按钮间距
    space() {
      return this.theme === 'default' ? 'small' : 'middle';
    }
  },
  methods: {
    /* 初始化列配置 */
    initColumnList() {
      this.$refs.tool.initColumnList();
    },
    /* 刷新表格 */
    reload() {
      this.$emit('reload');
    },
    /* 修改表格尺寸 */
    updateSize(value) {
      this.$emit('update:size', value);
    },
    /* 修改表格尺寸 */
    updateColumns(value) {
      this.$emit('update:columns', value);
    },
    /* 全屏切换 */
    toggleFullscreen(value) {
      if (this.isFullscreen !== null && this.isFullscreen !== undefined) {
        this.$emit('fullscreen', value);
      } else {
        this.fullscreen = !this.fullscreen;
        this.$emit('fullscreen', this.fullscreen);
      }
    }
  },
  /* 全屏切换 */
  toggleFullscreen(el, fullscreen) {
    EleProTableTools.toggleFullscreen(el, fullscreen);
  }
}
</script>
