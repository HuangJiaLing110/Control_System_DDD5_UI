<!-- 表格工具按钮组件 license by http://eleadmin.com -->
<template>
  <locale-receiver component-name="ele">
    <template #default="locale">
      <a-space :size="space" class="ele-tool" :style="customStyle">
        <slot/>
        <template v-for="tool in tools">
          <template v-if="tool==='reload'">
            <div class="ele-tool-item" :key="tool">
              <a-tooltip :title="locale.tableTools.refresh" :placement="tipsPlacement">
                <reload-outlined @click="reload"/>
              </a-tooltip>
            </div>
          </template>
          <template v-if="tool==='size'">
            <div class="ele-tool-item" :key="tool">
              <a-tooltip :title="locale.tableTools.size" :placement="tipsPlacement">
                <a-dropdown
                  :trigger="['click']"
                  :overlay-style="{minWidth: '80px'}"
                  placement="bottomRight">
                  <column-height-outlined/>
                  <template #overlay>
                    <a-menu
                      :selected-keys="selectedKeys"
                      @click="updateSize">
                      <a-menu-item key="default">{{ locale.tableTools.sizeOption.medium }}</a-menu-item>
                      <a-menu-item key="middle">{{ locale.tableTools.sizeOption.small }}</a-menu-item>
                      <a-menu-item key="small">{{ locale.tableTools.sizeOption.mini }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-tooltip>
            </div>
          </template>
          <template v-if="tool==='columns'">
            <div class="ele-tool-item" :key="tool">
              <a-tooltip :title="locale.tableTools.columns" :placement="tipsPlacement">
                <a-dropdown
                  :trigger="['click']"
                  placement="bottomRight">
                  <setting-outlined/>
                  <template #overlay>
                    <div class="ant-dropdown-menu ele-tool-column">
                      <div @click.stop="">
                        <div class="ele-tool-column-header ele-tool-column-item">
                          <div v-if="columnsSort" style="width: 20px;"></div>
                          <div v-else style="width: 10px;"></div>
                          <a-checkbox
                            v-model:checked="columnIsAllChecked"
                            :indeterminate="columnIsIndeterminate"
                            @change="onColumnCheckAllChange">
                            {{ locale.tableTools.columnsOption.columns }}
                          </a-checkbox>
                          <a @click="resetColumnChecked">
                            {{ locale.tableTools.columnsOption.reset }}</a>
                        </div>
                        <a-divider/>
                        <a-checkbox-group
                          v-model:value="columnChecked"
                          @change="onColumnCheckedChange">
                          <draggable
                            v-model="columnList"
                            item-key="key"
                            animation="300"
                            handle=".ele-tool-column-handle"
                            @change="onColumnSortChange">
                            <template #item="{element}">
                              <div class="ele-tool-column-item">
                                <div class="ele-tool-column-handle" v-if="columnsSort">
                                  <more-outlined/>
                                  <more-outlined/>
                                </div>
                                <div v-else style="width: 10px;"></div>
                                <a-checkbox :value="element.key">
                                  {{
                                    element.title || (element.key === 'index' ? locale.tableTools.columnsOption.index : locale.tableTools.columnsOption.untitled)
                                  }}
                                </a-checkbox>
                              </div>
                            </template>
                          </draggable>
                        </a-checkbox-group>
                      </div>
                    </div>
                  </template>
                </a-dropdown>
              </a-tooltip>
            </div>
          </template>
          <template v-if="tool==='fullscreen'">
            <div
              class="ele-tool-item"
              :key="tool"
              @click="toggleFullscreen">
              <a-tooltip :title="locale.tableTools.fullscreen" :placement="tipsPlacement">
                <fullscreen-exit-outlined v-if="isFullscreen"/>
                <fullscreen-outlined v-else/>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-space>
    </template>
  </locale-receiver>
</template>

<script>
import LocaleReceiver from 'ant-design-vue/es/locale-provider/LocaleReceiver';
import {
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  MoreOutlined
} from '@ant-design/icons-vue';
import draggable from 'vuedraggable';
import util from '../../util.js';

export default {
  name: 'EleProTableTools',
  components: {
    LocaleReceiver,
    ReloadOutlined,
    ColumnHeightOutlined,
    SettingOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    MoreOutlined,
    draggable
  },
  emits: [
    'reload',
    'update:size',
    'update:columns',
    'fullscreen'
  ],
  props: {
    // 间距
    space: {
      type: String,
      default: 'middle'
    },
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
    // 是否是全屏状态
    isFullscreen: Boolean,
    // 自定义样式
    customStyle: Object
  },
  data() {
    return {
      // 列配置原始数据
      orgColumns: this.columns,
      // 列配置下拉列表数据
      columnList: [],
      // 列配置下拉列表选中数据
      columnChecked: [],
      // 列配置下拉列表是否全选
      columnIsAllChecked: false,
      // 列配置下拉列表是否半选
      columnIsIndeterminate: false
    };
  },
  computed: {
    // 表格尺寸下拉选中
    selectedKeys() {
      return [this.size];
    },
    // tooltips的方向
    tipsPlacement() {
      return this.isFullscreen ? 'bottom' : 'top';
    }
  },
  mounted() {
    // 获取列配置下拉列表数据
    this.initColumnList();
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$emit('reload');
    },
    /* 修改表格尺寸 */
    updateSize({key}) {
      this.$emit('update:size', key);
    },
    /* 获取列配置下拉列表数据 */
    initColumnList(reset) {
      let data = [];
      util.eachTreeData(this.orgColumns, d => {
        if (d.children && d.children.length) {
          return;
        }
        if (d.dataIndex || d.key) {
          data.push({
            key: d.key || d.dataIndex,
            title: d.title/* || (d.key === 'index' ? '序号' : '无标题')*/,
            show: d.show !== false
          });
        }
      });
      this.columnList = data;
      this.columnChecked = data.filter(d => d.show).map(d => d.key);
      this.columnIsAllChecked = this.columnList.length && this.columnList.length === this.columnChecked.length;
      this.columnIsIndeterminate = this.columnList.length !== this.columnChecked.length;
      // 默认有隐藏列或者强制重置
      if (reset || !this.columnIsAllChecked) {
        let columns = this.getCheckedColumns(this.orgColumns, this.columnChecked);
        this.$emit('update:columns', columns);
      }
    },
    /* 列配置改变 */
    onColumnCheckedChange() {
      this.columnIsAllChecked = !!this.columnList.length && this.columnList.length === this.columnChecked.length;
      this.columnIsIndeterminate = !!this.columnChecked.length && this.columnList.length !== this.columnChecked.length;
      let columns = this.getCheckedColumns(this.orgColumns, this.columnChecked);
      this.$emit('update:columns', columns);
    },
    /* 列配置全选/取消全选 */
    onColumnCheckAllChange() {
      if (this.columnIsAllChecked) {
        this.columnChecked = this.columnList.map(d => d.key);
      } else {
        this.columnChecked = [];
      }
      this.columnIsIndeterminate = false;
      let columns = this.getCheckedColumns(this.orgColumns, this.columnChecked);
      this.$emit('update:columns', columns);
    },
    /* 重置列配置 */
    resetColumnChecked() {
      this.initColumnList(true);
    },
    /* 获取显示的列配置 */
    getCheckedColumns(columns, checked) {
      let data = [];
      columns.forEach(d => {
        if (this.columnList.some(c => c.key === d.key || c.key === d.dataIndex)) {
          if (checked.indexOf(d.key) === -1 && checked.indexOf(d.dataIndex) === -1) {
            return;
          }
        }
        if (d.children) {
          let children = this.getCheckedColumns(d.children, checked);
          if (children.length) {
            data.push(Object.assign({}, d, {children: children}));
          }
        } else {
          data.push(Object.assign({}, d));
        }
      });
      // 排序
      if (this.columnsSort) {
        data.sort((a, b) => {
          let ai = this.columnList.findIndex(c => c.key === a.key || c.key === a.dataIndex),
            bi = this.columnList.findIndex(c => c.key === b.key || c.key === b.dataIndex);
          // 父级列处理
          if (ai === -1 && a.children && a.children.length) {
            ai = this.columnList.findIndex(c => c.key === a.children[0].key || c.key === a.children[0].dataIndex);
          }
          if (bi === -1 && b.children && b.children.length) {
            bi = this.columnList.findIndex(c => c.key === b.children[0].key || c.key === b.children[0].dataIndex);
          }
          // 固定列处理
          if (a.fixed === true || a.fixed === 'left') {
            ai -= this.columnList.length;
          } else if (a.fixed === 'right') {
            ai += this.columnList.length;
          }
          if (b.fixed === true || b.fixed === 'left') {
            bi -= this.columnList.length;
          } else if (b.fixed === 'right') {
            bi += this.columnList.length;
          }
          return ai - bi;
        });
      }
      return data;
    },
    /* 列配置拖动改变顺序 */
    onColumnSortChange() {
      let columns = this.getCheckedColumns(this.orgColumns, this.columnChecked);
      this.$emit('update:columns', columns);
    },
    /* 全屏切换 */
    toggleFullscreen() {
      this.$emit('fullscreen', !this.isFullscreen);
    }
  },
  /* 全屏切换 */
  toggleFullscreen(el, fullscreen) {
    try {
      util.toggleFullscreen(el, fullscreen);
    } catch (e) {
      alert('您的浏览器不支持全屏模式');
    }
  }
}
</script>

<style>
/* 列配置 */
.ele-tool-column-item {
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 4px;
}

.ele-tool-column-header {
  padding: 5px 16px 10px 4px;
  min-width: 180px;
}

.ele-tool-column .ant-checkbox-group {
  padding: 4px 0;
  display: block;
}

.ele-tool-column-item .ant-checkbox-wrapper {
  flex: 1;
}

.ele-tool-column-item .ele-tool-column-handle {
  opacity: .8;
  cursor: move;
}

.ele-tool-column-item .ele-tool-column-handle .anticon-more {
  font-size: 12px;
  margin-top: 2px;
}

.ele-tool-column-item .ele-tool-column-handle .anticon-more + .anticon-more {
  margin: 2px 4px 0 -8px;
}

.ele-tool-column-item.sortable-chosen {
  background: hsla(0, 0%, 60%, .1);
}
</style>
