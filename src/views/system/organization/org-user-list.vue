<template>
  <!-- 表格 -->
  <ele-pro-table
    ref="table"
    row-key="eid"
    :datasource="url"
    :columns="columns"
    :where="where"
    tool-class="ele-toolbar-form"
    :scroll="{x: 'max-content'}">
    <template #toolbar>
      <a-row :gutter="16">
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-input
            v-model:value.trim="where.username"
            placeholder="请输入用户账号"
            allow-clear/>
        </a-col>
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-input
            v-model:value.trim="where.nickname"
            placeholder="请输入用户名"
            allow-clear/>
        </a-col>
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-space size="middle">
            <a-button
              type="primary"
              @click="reload">查询
            </a-button>
            <a-button
              type="primary"
              @click="openEdit()">新建
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </template>
    <template #roles="{ record }">
      <a-tag
        v-for="(item, index) in record.roles"
        :key="index"
        color="blue">{{ item.roleName }}
      </a-tag>
    </template>
    <template #state="{ text,record }">
      <a-switch
        :checked="text===0"
        @change="(checked) => changeState(checked, record)"/>
    </template>
    <template #action="{ record }">
      <a-space>
        <a @click="openEdit(record)">修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定要删除此用户吗？"
          @confirm="remove(record)">
          <a class="ele-text-danger">删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <org-user-edit
    v-model:visible="showEdit"
    :data="current"
    :organization-list="organizationList"
    :organization-id="organizationId"
    @done="reload"/>
</template>

<script>
import OrgUserEdit from './org-user-edit';

export default {
  name: 'SysOrgUserList',
  components: {OrgUserEdit},
  props: {
    // 机构id
    organizationId: Number,
    // 全部机构
    organizationList: Array
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/user/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          align: 'center',
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '用户账号',
          dataIndex: 'username',
          sorter: true
        },
        {
          title: '用户名',
          dataIndex: 'nickname',
          sorter: true
        },
        {
          title: '性别',
          dataIndex: 'sexName',
          sorter: true
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          sorter: true,
        },
        {
          title: '角色',
          key: 'roles',
          slots: {customRender: 'roles'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          width: 150,
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '状态',
          dataIndex: 'state',
          sorter: true,
          width: 90,
          align: 'center',
          slots: {customRender: 'state'}
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {
        organizationId: this.organizationId
      },
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      debugger
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/sys/user/' + row.eid).then(res => {
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
    /* 修改用户状态 */
    changeState(checked, row) {
      let params = new FormData();
      params.append('state', checked ? 0 : 1);
      this.$http.put('/sys/user/state/' + row.eid, params).then(res => {
        if (res.data.code === 0) {
          row.state = checked ? 0 : 1;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  },
  watch: {
    /* 监听机构id变化 */
    organizationId() {
      this.where.organizationId = this.organizationId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
