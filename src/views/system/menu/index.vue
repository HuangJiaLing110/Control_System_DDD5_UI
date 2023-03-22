<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <a-form
        :model="where"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-row>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="菜单名称:">
              <a-input
                v-model:value.trim="where.title"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="菜单地址:">
              <a-input
                v-model:value.trim="where.path"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="权限标识:">
              <a-input
                v-model:value.trim="where.authority"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item class="ele-text-right" :wrapper-col="{span: 24}">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <ele-pro-table
        ref="table"
        row-key="menuId"
        :datasource="url"
        :columns="columns"
        :where="where"
        :need-page="false"
        :parse-data="parseData"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        :scroll="{x: 'max-content'}"
        @expandedRowsChange="onExpandedRowsChange">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button @click="expandAll">展开全部</a-button>
            <a-button @click="foldAll">折叠全部</a-button>
          </a-space>
        </template>
        <template #menuType="{ record }">
          <a-tag
            v-if="isUrl(record.path)"
            color="orange">外链
          </a-tag>
          <a-tag
            v-else-if="isUrl(record.component)"
            color="green">内链
          </a-tag>
          <a-tag
            v-else
            :color="['blue', ''][record.menuType]">
            {{ ['菜单', '按钮'][record.menuType] }}
          </a-tag>
        </template>
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(null, record.menuId)">添加</a>
            <a-divider type="vertical"/>
            <a @click="openEdit(record)">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm @confirm="remove(record)" title="确定要删除此菜单吗？">
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <menu-edit
    v-model:visible="showEdit"
    :data="current"
    :menu-list="menuList"
    @done="reload"/>
</template>

<script>
import {PlusOutlined} from '@ant-design/icons-vue';
import MenuEdit from './menu-edit';

export default {
  name: 'SystemMenu',
  components: {PlusOutlined, MenuEdit},
  data() {
    return {
      // 表格数据接口
      url: '/sys/menu',
      // 表格列配置
      columns: [
        {
          key: 'index',
          dataIndex: 'index',
          width: 48,
          align: 'center',
          customRender: ({index}) => index + 1
        },
        {
          title: '菜单名称',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '路由地址',
          dataIndex: 'path',
          sorter: true
        },
        {
          title: '组件路径',
          dataIndex: 'component',
          sorter: true
        },
        {
          title: '权限标识',
          dataIndex: 'authority',
          sorter: true
        },
        {
          title: '排序',
          dataIndex: 'sortNumber',
          sorter: true
        },
        {
          title: '可见',
          dataIndex: 'hide',
          sorter: true,
          customRender: ({text}) => ['是', '否'][text]
        },
        {
          title: '类型',
          dataIndex: 'menuType',
          sorter: true,
          slots: {customRender: 'menuType'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格展开的行
      expandedRowKeys: [],
      // 全部菜单数据
      menuList: []
    };
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data.map(d => {
        d.key = d.menuId;
        d.value = d.menuId;
        return d;
      }), 'menuId', 'parentId');
      if (!Object.keys(this.where).length) {
        this.menuList = res.data;
      }
      if (!this.expandedRowKeys.length) {
        this.expandAll();
      }
      return res;
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 打开编辑弹窗 */
    openEdit(row, parentId) {
      this.current = Object.assign({
        menuType: 0,
        hide: 0,
        parentId: parentId
      }, row);
      this.showEdit = true;
    },
    /* 删除单个 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除子节点');
        return;
      }
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/sys/menu/' + row.menuId).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
    },
    /* 展开全部 */
    expandAll() {
      let keys = [];
      this.$util.eachTreeData(this.menuList, (d) => {
        if (d.children && d.children.length) {
          keys.push(d.menuId);
        }
      });
      this.expandedRowKeys = keys;
    },
    /* 折叠全部 */
    foldAll() {
      this.expandedRowKeys = [];
    },
    /* 展开的行变化 */
    onExpandedRowsChange(expandedRows) {
      this.expandedRowKeys = expandedRows;
    },
    /* 判断是否是网址 */
    isUrl(url) {
      return url && (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('://'));
    }
  }
}
</script>

<style scoped>
</style>
