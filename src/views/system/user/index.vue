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
            <a-form-item label="用户账号:">
              <a-input
                v-model:value.trim="where.username"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="用户名:">
              <a-input
                v-model:value.trim="where.nickname"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="性别:">
              <a-select
                v-model:value="where.sex"
                placeholder="请选择"
                allow-clear>
                <a-select-option :value="1">男</a-select-option>
                <a-select-option :value="2">女</a-select-option>
              </a-select>
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
        row-key="eid"
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
            <a-button @click="showImport=true">
              <template #icon>
                <upload-outlined/>
              </template>
              <span>导入</span>
            </a-button>
          </a-space>
        </template>
        <template #nickname="{ record }">
          <router-link :to="'/system/user/info?id=' + record.eid">
            {{ record.nickname }}
          </router-link>
        </template>
        <template #roles="{ record }">
          <a-tag
            v-for="(item, index) in record.roles"
            :key="index"
            color="blue">
            {{ item.roleName }}
          </a-tag>
        </template>
        <template #state="{ text, record }">
          <a-switch
            :checked="text===0"
            @change="(checked) => editState(checked, record)"/>
        </template>
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)">修改</a>
            <a-divider type="vertical"/>
            <a @click="resetPsw(record)">重置密码</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此用户吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <user-edit
    v-model:visible="showEdit"
    :data="current"
    @done="reload"/>
  <!-- 导入弹窗 -->
  <user-import
    v-model:visible="showImport"
    @done="reload"/>
</template>

<script>
import {createVNode} from 'vue';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import UserEdit from './user-edit';
import UserImport from './user-import';

export default {
  name: 'SystemUser',
  components: {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
    UserImport,
    UserEdit
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
          sorter: true,
          slots: {customRender: 'nickname'}
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
      // 是否显示用户导入弹窗
      showImport: false
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
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的用户吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/sys/user/batch', {
            data: this.selection.map(d => d.eid)
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
    /* 重置用户密码 */
    resetPsw(row) {
      this.$confirm({
        title: '提示',
        content: '确定要重置此用户的密码为"123456"吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.put('/sys/user/psw/' + row.eid, {
            password: '123456'
          }).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
    /* 修改用户状态 */
    editState(checked, row) {
      let params = new FormData();
      params.append('state', checked ? 0 : 1);
      this.$http.put('/sys/user/state/' + row.eid, params).then(res => {
        if (res.data.code === 0) {
          row.state = checked ? 0 : 1;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(error => {
        //error.data
        this.$message.error(error.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
