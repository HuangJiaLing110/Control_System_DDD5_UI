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
            <a-form-item label="角色名称:">
              <a-input
                v-model:value.trim="where.roleName"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="角色标识:">
              <a-input
                v-model:value.trim="where.roleCode"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="备注:">
              <a-input
                v-model:value.trim="where.comments"
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
        row-key="roleId"
        :datasource="url"
        :columns="columns"
        :where="where"
        v-model:selection="selection"
        :scroll="{x: 'max-content'}">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="danger" @click="removeBatch">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)">修改</a>
            <a-divider type="vertical"/>
            <a @click="openAuth(record)">分配权限</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此角色吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <role-edit
    v-model:visible="showEdit"
    :data="current"
    @done="reload"/>
  <!-- 权限分配弹窗 -->
  <role-auth
    v-model:visible="showAuth"
    :data="current"/>
</template>

<script>
import {createVNode} from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import RoleEdit from './role-edit';
import RoleAuth from './role-auth';

export default {
  name: 'SystemRole',
  components: {
    PlusOutlined,
    DeleteOutlined,
    RoleEdit,
    RoleAuth
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/role/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          sorter: true
        },
        {
          title: '角色标识',
          dataIndex: 'roleCode',
          sorter: true
        },
        {
          title: '备注',
          dataIndex: 'comments',
          sorter: true
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
          width: 200,
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
      // 是否显示权限分配弹窗
      showAuth: false
    };
  },
  methods: {
    /* 搜索 */
    reload() {
      this.selection = [];
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/sys/role/' + row.roleId).then(res => {
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
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的角色吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/sys/role/batch', {
            data: this.selection.map(d => d.roleId)
          }).then(res => {
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
        }
      });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开权限分配弹窗 */
    openAuth(row) {
      this.current = row;
      this.showAuth = true;
    }
  }
}
</script>

<style scoped>
</style>
