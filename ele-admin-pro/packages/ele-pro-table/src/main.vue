<!-- 高级表格组件 license by http://eleadmin.com -->
<template>
  <div
    :class="['ele-pro-table ele-bg-white', {'ele-pro-table-fullscreen': isFullscreen}]"
    :style="{zIndex: fullZIndex}">
    <ele-toolbar
      v-if="toolbar"
      ref="toolbar"
      :theme="toolsTheme"
      :title="title"
      :sub-title="subTitle"
      :size="tableSize"
      :columns="cols"
      :tools="toolkit"
      :columns-sort="columnsSort"
      :toolkit-style="toolkitStyle"
      :style="toolStyle"
      :class="toolClass"
      :is-fullscreen="isFullscreen"
      @reload="onRefresh"
      @update:size="updateSize"
      @update:columns="updateColumns"
      @fullscreen="toggleFullscreen">
      <slot name="toolbar"/>
      <template #action>
        <slot name="toolkit"/>
      </template>
    </ele-toolbar>
    <!-- 表格 -->
    <a-table
      ref="table"
      :table-layout="tableLayout"
      :bordered="bordered"
      :children-column-name="childrenColumnName"
      :columns="cols"
      :components="components"
      :data-source="list"
      :default-expand-all-rows="defaultExpandAllRows"
      :default-expanded-row-keys="defaultExpandedRowKeys"
      :expanded-row-keys="expandedRowKeys"
      :expanded-row-render="expandedRowRender"
      :expand-icon="expandIcon"
      :expand-row-by-click="expandRowByClick"
      :expand-icon-column-index="expandIconColumnIndex"
      :footer="footer"
      :indent-size="indentSize"
      :loading="isLoading"
      :locale="localeText"
      :pagination="pagination"
      :row-class-name="rowClassName"
      :row-key="rowKey"
      :row-selection="tableRowSelection"
      :scroll="scroll"
      :show-header="showHeader"
      :size="tableSize"
      :custom-header-row="customHeaderRow"
      :custom-row="customRow"
      :get-popup-container="getPopupContainer"
      :transform-cell-text="transformCellText"
      @expandedRowsChange="onExpandedRowsChange"
      @change="onChange"
      @expand="onExpand">
      <template
        v-for="name in Object.keys($slots)"
        :key="name"
        v-slot:[name]="{text, record, index, indent, expanded, props}">
        <slot
          :name="name"
          :text="text"
          :record="record"
          :index="index"
          :indent="indent"
          :expanded="expanded"
          :props="props"/>
      </template>
    </a-table>
  </div>
</template>

<script>
import util from '../../util';
import EleToolbar from '../../ele-toolbar';
// 如果是服务端数据源默认请求参数名称
const defaultRequest = {
  // 页码的参数名称
  pageName: 'page',
  // 每页数据量的参数名
  limitName: 'limit',
  // 排序字段参数名称
  sortName: 'sort',
  // 排序方式的参数名称
  orderName: 'order'
};
// 如果是服务端数据源默认请求参数名称
const defaultResponse = {
  // 数据状态的字段名称
  statusName: 'code',
  // 成功的状态码
  statusCode: 0,
  // 信息的字段名称
  msgName: 'msg',
  // 数据列表的字段名称
  dataName: 'data',
  // 数据总数的字段名称
  countName: 'count'
};

export default {
  name: 'EleProTable',
  components: {EleToolbar},
  emits: [
    'done',
    'update:selection',
    'update:current',
    'columns-change',
    'size-change',
    'fullscreen-change',
    'refresh',
    'expandedRowsChange',
    'change',
    'expand'
  ],
  props: {
    // 数据源
    datasource: [String, Array, Function],
    // 如果是服务端数据源设定请求方式
    method: {
      type: String,
      default: 'GET'
    },
    // 如果是服务端数据源设定请求的参数
    where: Object,
    // 如果是服务端数据源设定请求的header
    headers: Object,
    // 如果是服务端数据源设定请求数据类型
    contentType: {
      type: String,
      default: 'application/json'
    },
    // 如果是服务端数据源设定请求参数名称
    request: Object,
    // 如果是服务端数据源设定响应参数名称
    response: Object,
    // 如果是服务端数据源自定义返回格式解析
    parseData: Function,
    // 如果是服务端数据源自定义参数格式解析
    parseParam: Function,
    // 列表选中数据(多选)，支持 v-model 绑定
    selection: Array,
    // 列表选中数据(单选)，支持 v-model 绑定
    current: Object,
    // 是否需要分页组件
    needPage: {
      type: Boolean,
      default: true
    },
    // 如果是服务端数据源默认是否请求数据
    initLoad: {
      type: Boolean,
      default: true
    },
    // 表格请求状态
    loading: Boolean,
    // 表格列配置
    columns: {
      type: Array,
      required: true
    },
    // 表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局
    tableLayout: String,
    // 是否展示外边框和列边框
    bordered: Boolean,
    // 指定树形结构的列名
    childrenColumnName: Array,
    // 覆盖默认的 table 元素
    components: Object,
    // 初始时，是否展开所有行
    defaultExpandAllRows: Boolean,
    // 默认展开的行
    defaultExpandedRowKeys: Array,
    // 展开的行，控制属性
    expandedRowKeys: Array,
    // 额外的展开行
    expandedRowRender: Function,
    // 自定义展开图标
    expandIcon: Object,
    // 通过点击行来展开子行
    expandRowByClick: Boolean,
    // 展开的图标显示在哪一列，如果没有 rowSelection，默认显示在第一列，否则显示在选择框后面
    expandIconColumnIndex: Number,
    // 表格尾部
    footer: Function,
    // 展示树形数据时，每层缩进的宽度，以 px 为单位
    indentSize: {
      type: Number,
      default: 15
    },
    // 默认文案设置，目前包括排序、过滤、空数据文案
    locale: Object,
    // 表格行的类名
    rowClassName: Function,
    // 表格行 key 的取值，可以是字符串或一个函数
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    // 列表项是否可选择
    rowSelection: Object,
    // 设置横向或纵向滚动，也可用于指定滚动区域的宽和高
    scroll: Object,
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 表格大小
    size: {
      type: String,
      default: 'middle'
    },
    // 设置头部行属性
    customHeaderRow: Function,
    // 设置行属性
    customRow: Function,
    // 设置表格内各类浮层的渲染节点，如筛选菜单
    getPopupContainer: Function,
    // 数据渲染前可以再次改变，一般用户空数据的默认配置
    transformCellText: Function,
    // 分页组件默认页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 分页组件每页显示条目个数
    pageSize: {
      type: Number,
      default: 10
    },
    // 分页组件只有一页时是否隐藏
    hideOnSinglePage: Boolean,
    // 分页组件每页显示个数选择器的选项设置
    pageSizeOptions: {
      type: Array,
      default() {
        return ['10', '20', '30', '40', '50', '100'];
      }
    },
    // 分页组件是否显示较少页面内容
    showLessItems: Boolean,
    // 分页组件是否可以快速跳转至某页
    showQuickJumper: {
      type: Boolean,
      default: true
    },
    // 分页组件是否可以改变 pageSize
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    // 分页组件用于显示数据总量
    showTotal: {
      type: Function,
      default(total) {
        return `共 ${total} 条`;
      }
    },
    // 分页组件是否显示为简单分页
    simple: Boolean,
    // 指定分页显示的位置
    position: {
      type: String,
      default: 'bottom'
    },
    // 表头工具栏主题风格
    toolsTheme: String,
    // 标题
    title: String,
    // 二级标题
    subTitle: String,
    // 表头工具按钮布局
    toolkit: {
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
    // 行点击选中
    rowClickChecked: Boolean,
    // 行点击选中当单个选中时互斥
    rowClickCheckedIntelligent: {
      type: Boolean,
      default: true
    },
    // 是否显示顶部工具栏
    toolbar: {
      type: Boolean,
      default: true
    },
    // 顶部工具栏样式
    toolStyle: [Object, String],
    // 自定义顶部工具栏class
    toolClass: String,
    // 顶部工具栏右侧样式
    toolkitStyle: [Object, String],
    // 表格全屏时的z-index
    fullZIndex: {
      type: Number,
      default: 999
    },
    // 是否自动修正页码
    autoAmendPage: {
      type: Boolean,
      default: true
    },
    // 单选多选列类型
    selectionType: String
  },
  data() {
    const globalRequest = this.$ELEADMIN ? this.$ELEADMIN.request : null;
    let isServer = !Array.isArray(this.datasource), order = {}, filters = {},
      requestNames = Object.assign({}, defaultRequest, globalRequest, this.request);
    // 获取默认的排序信息
    util.eachTreeData(this.columns, (d) => {
      if (d.defaultSortOrder && d.dataIndex) {
        order[requestNames.sortName] = d.dataIndex;
        order[requestNames.orderName] = {
          ascend: 'asc',
          descend: 'desc'
        }[d.defaultSortOrder];
      }
    });
    return {
      // 数据请求状态
      isLoading: isServer ? true : this.loading,
      // 是否是服务端返回数据
      isServer: isServer,
      // 全部数据
      data: isServer ? [] : this.datasource,
      // 数据总数量
      total: isServer ? 0 : this.datasource.length,
      // 当前在第几页
      page: this.currentPage,
      // 每页显示数量
      limit: this.pageSize,
      // 当前排序参数
      order: order,
      // 当前筛选参数
      filters: filters,
      // 请求参数名称
      requestNames: requestNames,
      // 请求错误后的提示信息
      errorText: null,
      // 表格列配置
      cols: this.columns,
      // 表格尺寸
      tableSize: this.size,
      // 是否是全屏状态
      isFullscreen: false,
      // 表格选中行的key
      selectedRowKeys: []
    };
  },
  computed: {
    // 表格当前显示数据
    list() {
      if (this.isServer) {
        return this.data;
      }
      let data = this.data,
        sort = this.order[this.requestNames.sortName],
        order = this.order[this.requestNames.orderName];
      // 前端排序
      if (sort) {
        data.sort((a, b) => {
          if (b[sort] == a[sort]) {
            return 0;
          }
          if (order === 'desc') {
            return (a[sort] < b[sort]) ? 1 : -1;
          }
          return (a[sort] < b[sort]) ? -1 : 1;
        });
      }
      // 前端分页
      if (this.needPage) {
        let start = (this.page - 1) * this.limit;
        let end = start + this.limit;
        if (end > data.length) {
          end = data.length;
        }
        return data.slice(start, end);
      }
      return data;
    },
    // 表格索引开始序号
    tableIndex() {
      return this.needPage ? ((this.page - 1) * this.limit + 1) : 1;
    },
    // 表格分页组件参数
    pagination() {
      if (!this.needPage) {
        return false;
      }
      return {
        position: this.position,
        current: this.page,
        pageSize: this.limit,
        hideOnSinglePage: this.hideOnSinglePage,
        pageSizeOptions: this.pageSizeOptions,
        showLessItems: this.showLessItems,
        showQuickJumper: this.showQuickJumper,
        showSizeChanger: this.showSizeChanger,
        showTotal: this.showTotal,
        simple: this.simple,
        size: this.tableSize === 'default' ? '' : 'small',
        total: this.total
      };
    },
    // 表格文案设置
    localeText() {
      if (this.errorText) {
        if (this.locale) {
          return Object.assign({}, this.locale, {
            emptyText: this.errorText
          });
        } else {
          return {emptyText: this.errorText};
        }
      }
      return this.locale;
    },
    // 表格复选框
    tableRowSelection() {
      let type;
      if (this.current || this.current === null) {
        type = 'radio';
      }
      if (!type && !this.selection && !this.rowSelection) {
        return null;
      }
      return Object.assign({}, this.rowSelection || {}, {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectionChange,
        type: this.selectionType || type
      });
    }
  },
  watch: {
    datasource() {
      this.isServer = !Array.isArray(this.datasource);
      if (!this.isServer) {
        this.total = this.datasource.length;
        if (this.needPage) {
          const maxPage = Math.ceil(this.total / this.limit);
          if (maxPage && this.page > maxPage) {
            this.page = maxPage;
          }
        }
        this.data = this.datasource;
      }
      this.reload();
    },
    request() {
      const globalRequest = this.$ELEADMIN ? this.$ELEADMIN.request : null;
      this.requestNames = Object.assign({}, defaultRequest, globalRequest, this.request);
    },
    pageSize() {
      this.limit = this.pageSize;
      this.reload();
    },
    currentPage() {
      this.page = this.currentPage;
      this.reload();
    },
    columns() {
      this.cols = this.columns;
      if (this.toolbar) {
        this.$refs.toolbar.initColumnList();
      }
    },
    size() {
      this.tableSize = this.size;
    },
    loading() {
      this.isLoading = this.loading;
    },
    selection() {
      this.selectedRowKeys = this.selection.map(d => d[this.rowKey]);
    },
    current() {
      if (this.current) {
        this.selectedRowKeys = [this.current[this.rowKey]];
      } else {
        this.selectedRowKeys = [];
      }
    }
  },
  mounted() {
    if (this.initLoad) {
      this.reload();
    }
  },
  methods: {
    /* 获取数据 */
    reload(obj) {
      if (obj) {
        if (obj.page) {
          this.page = obj.page;
        }
        if (obj.limit) {
          this.limit = obj.limit;
        }
      }
      this.errorText = null;
      // 前端分页
      if (!this.isServer) {
        this.total = this.datasource.length;
        //this.isLoading = false;
        this.$emit('done', {
            data: this.list,
            total: this.total
          },
          this.needPage ? this.page : 1,
          this.total,
          this.$refs.table
        );
        return;
      }
      // 后端分页
      this.isLoading = true;
      if (typeof this.datasource === 'function') {
        // 自定义请求方法
        this.datasource({
          page: this.page,
          limit: this.limit,
          where: Object.assign({}, ((obj && obj.where) || this.where) || {}),
          order: this.order,
          filters: this.filters
        }, (data, total) => {
          this.isLoading = false;
          if (Array.isArray(data)) {
            // 自动修正页码
            if (this.autoAmendPage && this.needPage && !data.length && total) {
              let maxPage = Math.ceil(total / this.limit);
              if (maxPage && this.page > maxPage) {
                this.page = maxPage;
                this.reload();
                return;
              }
            }
            // 获取返回的数据
            this.data = data;
            this.total = total || data.length;
            this.$emit('done', {
                data: data,
                total: total
              },
              this.needPage ? this.page : 1,
              this.total,
              this.$refs.table
            );
          } else if (typeof data === 'string') {
            this.errorText = data;
          } else {
            this.errorText = '获取数据失败';
            console.error('callback返回的data格式错误: ', data);
          }
        });
      } else {
        // 数据源为url方式
        let pageParam = {};
        if (this.needPage) {
          pageParam[this.requestNames.pageName] = this.page;
          pageParam[this.requestNames.limitName] = this.limit;
        }
        let params = Object.assign(
          {},
          ((obj && obj.where) || this.where) || {},
          this.filters,
          this.order,
          pageParam
        ), data = null;
        if (this.parseParam) {
          params = this.parseParam(params);
        }
        let method = this.method ? this.method.toUpperCase() : 'GET';
        if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
          data = params;
          params = null;
          if (this.contentType && this.contentType.toLowerCase().indexOf('form') !== -1) {
            let formData = new FormData();
            for (let key in data) {
              if (!Object.prototype.hasOwnProperty.call(data, key)) {
                continue;
              }
              formData.append(key, data[key]);
            }
            data = formData;
          }
        }
        this.$http.request({
          url: this.datasource,
          method: method,
          params: params,
          data: data,
          headers: this.headers
        }).then(res => {
          this.isLoading = false;
          const result = this.getResponseResult(res.data);
          if (result.code === 0) {
            // 自动修正页码
            if (this.autoAmendPage && this.needPage && result.data && !result.data.length && result.count) {
              let maxPage = Math.ceil(result.count / this.limit);
              if (maxPage && this.page > maxPage) {
                this.page = maxPage;
                this.reload();
                return;
              }
            }
            // 获取请求的数据
            this.data = result.data;
            this.total = result.count || result.data.length;
            this.$emit('done',
              res.data,
              this.needPage ? this.page : 1,
              this.total,
              this.$refs.table
            );
          } else {
            this.errorText = result.msg || '获取数据失败, 正确的状态码为0';
          }
        }).catch(e => {
          this.isLoading = false;
          this.errorText = e.message;
        });
      }
    },
    // 展开的行变化时触发
    onExpandedRowsChange(expandedRows) {
      this.$emit('expandedRowsChange', expandedRows);
    },
    // 分页、排序、筛选变化时触发
    onChange(pagination, filters, sorter, {currentDataSource}) {
      this.$emit('change', pagination, filters, sorter, {currentDataSource});
      // 更新分页信息
      this.limit = pagination.pageSize;
      this.page = pagination.current;
      // 更新排序信息
      let temp = {};
      if (sorter.order) {
        temp[this.requestNames.sortName] = sorter.field;
        temp[this.requestNames.orderName] = {ascend: 'asc', descend: 'desc'}[sorter.order];
      }
      this.order = temp;
      // 更新列筛选信息
      this.filters = Object.assign({}, filters);
      // 重新获取数据
      this.reload();
    },
    // 点击展开图标时触发
    onExpand(expanded, record) {
      this.$emit('expand', expanded, record);
    },
    /* 选择项发生变化时会触发 */
    onSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.$emit('update:selection', selectedRows);
      this.$emit('update:current', selectedRows.length ? selectedRows[0] : null);
    },
    /* 修改表格尺寸 */
    updateSize(value) {
      this.tableSize = value;
      this.$emit('size-change', value);
    },
    /* 修改表格列配置 */
    updateColumns(value) {
      this.cols = value;
      this.$emit('columns-change', value);
    },
    /* 全屏切换 */
    toggleFullscreen(value) {
      this.isFullscreen = value;
      this.$emit('fullscreen-change', value);
    },
    /* 工具栏刷新按钮点击 */
    onRefresh() {
      if (this.isServer) {
        this.reload();
      } else {
        this.$emit('refresh');
      }
    },
    /* 获取返回的结果(解析格式) */
    getResponseResult(data) {
      let result = this.parseData ? this.parseData(data) : data;
      const globalResponse = this.$ELEADMIN ? this.$ELEADMIN.response : null;
      const responseNames = Object.assign({}, defaultResponse, globalResponse, this.response);
      let code = this.getFieldValue(result, responseNames.statusName);
      if (responseNames.statusCode === code) {
        code = 0;
      }
      return {
        code: code,
        msg: this.getFieldValue(result, responseNames.msgName),
        data: this.getFieldValue(result, responseNames.dataName),
        count: this.getFieldValue(result, responseNames.countName)
      };
    },
    /* 获取字段的值(支持多层*.*) */
    getFieldValue(obj, field) {
      if (!field) {
        return;
      }
      let value = obj;
      field.split('.').forEach(f => {
        if (value) {
          value = value[f];
        } else {
          value = null;
        }
      });
      return value;
    }
  }
}
</script>

<style>
/* 表格全屏样式 */
.ele-pro-table.ele-pro-table-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  padding: 0 0 16px 0;
  box-sizing: border-box;
}

.ele-pro-table.ele-pro-table-fullscreen .ant-table-pagination {
  margin-bottom: 0;
  padding: 0 16px;
}

.ele-pro-table.ele-pro-table-fullscreen .ele-table-tool:not(.ele-table-tool-default) {
  margin-top: 10px;
  padding: 0 16px;
}
</style>
