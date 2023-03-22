<template>
  <!-- 表格 -->
  <ele-pro-table
    ref="table"
    row-key="dictDataId"
    :datasource="url"
    :columns="columns"
    :where="where"
    tool-class="ele-toolbar-form"
    v-model:selection="selection"
    :scroll="{x: 'max-content'}">
    <template #toolbar>
      <a-row :gutter="16">
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-input
            v-model:value.trim="where.keywords"
            placeholder="输入关键字搜索"
            allow-clear/>
        </a-col>
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-space size="middle">
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button type="primary" @click="openEdit()">新建</a-button>
            <a-button type="danger" @click="removeBatch">删除</a-button>
          </a-space>
        </a-col>
      </a-row>
    </template>
    <template #action="{ record }">
      <a-space>
        <a @click="openEdit(record)">修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定要删除此字典项吗？"
          @confirm="remove(record)">
          <a class="ele-text-danger">删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <sys-dict-data-edit
    v-model:visible="showEdit"
    :data="current"
    :dict-id="dictId"
    @done="reload"/>
</template>

<script>
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import SysDictDataEdit from './sys-dict-data-edit';

export default {
  name: 'SysDictData',
  components: {SysDictDataEdit},
  props: {
    // 字典id
    dictId: Number
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/dictdata/page',
      // 表格列配置
      columns: [
        {
          title: '字典项名称',
          dataIndex: 'dictDataName',
          sorter: true
        },
        {
          title: '字典项值',
          dataIndex: 'dictDataCode',
          sorter: true
        },
        {
          title: '排序号',
          dataIndex: 'sortNumber',
          sorter: true,
          width: 120,
          align: 'center'
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
          width: 130,
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {
        dictId: this.dictId
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
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
      this.$http.delete('/sys/dictdata/' + row.dictDataId).then(res => {
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
        content: '确定要删除选中的字典项吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/sys/dictdata/batch', {
            data: this.selection.map(d => d.dictDataId)
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
    }
  },
  watch: {
    // 监听字典id变化
    dictId() {
      this.where.dictId = this.dictId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
