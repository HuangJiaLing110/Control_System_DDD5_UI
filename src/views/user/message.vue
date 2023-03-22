<template>
  <div class="ele-body">
    <a-card :bordered="false" class="user-message-card">
      <div class="ele-cell ele-cell-align-top">
        <a-menu v-model:selected-keys="active" mode="inline" @select="changeType(null)">
          <a-menu-item key="all">全部消息</a-menu-item>
          <a-menu-item key="notice">系统通知</a-menu-item>
          <a-menu-item key="message">用户私信</a-menu-item>
          <a-menu-item key="todo">代办事项</a-menu-item>
        </a-menu>
        <div class="ele-cell-content">
          <!-- 数据表格 -->
          <ele-pro-table
            ref="table"
            row-key="id"
            :loading="loading"
            :datasource="data"
            :columns="columns"
            v-model:selection="selection"
            :scroll="{x: 'max-content'}"
            @refresh="query">
            <template #toolbar>
              <a-space>
                <a-button type="primary" @click="read">标记已读</a-button>
                <a-button type="primary" @click="readAll">全部已读</a-button>
                <a-button type="danger" @click="removeBatch">删除消息</a-button>
              </a-space>
            </template>
            <template #state="{ text }">
              <span :class="['ele-text-warning', 'ele-text-info'][text]">
                {{ ['未读', '已读'][text] }}
              </span>
            </template>
            <template #action="{ record }">
              <a-space>
                <a @click="view(record)">查看</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定要删除此消息吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default {
  name: 'UserMessage',
  data() {
    return {
      // 导航选中
      active: ['all'],
      // 列表显示数据
      data: [],
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 38,
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '标题内容',
          dataIndex: 'title'
        },
        {
          title: '时间',
          dataIndex: 'time'
        },
        {
          title: '状态',
          dataIndex: 'state',
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
      // 列表选中数据
      selection: [],
      // 全部数据
      allData: [],
      // 加载状态
      loading: true
    };
  },
  mounted() {
    const type = this.$route.query.type;
    if (type) {
      this.active = [type];
    }
    this.query();
  },
  methods: {
    /* 查询全部数据 */
    query() {
      this.loading = true;
      this.$http.get('https://cdn.eleadmin.com/20200609/message.json').then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          this.allData = res.data.data;
          this.changeType();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((e) => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* 切换消息类型 */
    changeType(index) {
      if (index) {
        this.active = [index];
      }
      if (this.active.indexOf('all') !== -1) {
        this.data = [].concat(this.allData);
      } else {
        this.data = this.allData.filter((d) => this.active.indexOf(d.type) !== -1);
      }
      this.selection = [];
    },
    /* 查看 */
    view(row) {
      this.$message.info(row.title);
    },
    /* 删除单个 */
    remove(row) {
      this.allData.splice(this.allData.findIndex((t) => t.id === row.id), 1);
      this.$message.success('删除成功');
      this.changeType();
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        return this.$message.error('请至少选择一条数据');
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的消息吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          this.selection.forEach((d) => {
            this.allData.splice(this.allData.findIndex((t) => t.id === d.id), 1);
          });
          this.changeType();
        }
      });
    },
    /* 标记已读 */
    read() {
      if (!this.selection.length) {
        return this.$message.error('请至少选择一条数据');
      }
      this.selection.forEach((d) => {
        const index = this.allData.findIndex((t) => t.id === d.id);
        this.allData[index].state = 1;
      });
      this.changeType();
    },
    /* 全部标记已读 */
    readAll() {
      this.allData.forEach((d) => {
        d.state = 1;
      });
      this.changeType();
    }
  },
  watch: {
    $route() {
      const type = this.$route.query.type;
      this.changeType(type || 'all');
    }
  }
}
</script>

<style scoped>
.user-message-card :deep(.ant-card-body) {
  padding: 0;
}

.user-message-card .ant-menu {
  width: 150px;
  padding-top: 16px;
}

.user-message-card .ant-menu + .ele-cell-content {
  padding: 24px;
}

@media screen and (max-width: 768px) {
  .user-message-card .ant-menu {
    display: none;
  }
}
</style>
