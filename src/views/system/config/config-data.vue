<template>
  <div class="ele-body">
    <a-card :bordered="false">
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
        </a-space>

      </template>
      <template #action="{ record }">
        <a-space>
          <a @click="openEdit(record)">修改</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="确定要删除此系统参数吗？"
            @confirm="remove(record)">
            <a class="ele-text-danger">删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <config-data-edit
    v-model:visible="showEdit"
    :data="current"
    @done="reload"
  />
</template>

<script>
import {createVNode} from 'vue';
import configDataEdit from './config-data-edit'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
export default {
  name: "configData",
  components: {
    PlusOutlined,
    DeleteOutlined,
    configDataEdit
  },
  props:{
    // 系统参数类型
    type: String
  },

  data() {
    return {
      // 表格数据接口
      url: '/sys/con/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          align: 'center',
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '参数名字',
          dataIndex: 'name',
          align: 'center',
          sorter: true
        },
        {
          title: '参数值',
          dataIndex: 'value',
          align: 'center',
          sorter: true
        },
        {
          title: '参数说明',
          dataIndex: 'description',
          align: 'center',
          sorter: true
        },
        {
          title: '参数选项',
          dataIndex: 'options',
          align: 'center',
          sorter: true
        },
        {
          title: '参数类别',
          dataIndex: 'type',
          align: 'center',
          sorter: true
        },
        {
          title: '是否前台参数',
          dataIndex: 'isFrontConfig',
          align: 'center',
          sorter: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格搜索条件
      where: {
        type: this.type,
      },
      // 表格选中数据
      selection: [],
      // 当前选择数据
      current: null,
    };
  },
  watch: {
    // 监听系统参数类型变化
    type() {
      this.where.type = this.type;
      this.reload();
    }
  },
  //数据初始化周期
  created() {
  },
  mounted() {

  },
  methods: {
    /*reload*/
    reload(){
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
      this.$http.delete('/sys/con/' + row.eid).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$store.dispatch('SET_CONFIGS',res.data.con);
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
        content: '确定要删除选中的系统参数吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/sys/con/batch', {
            data: this.selection.map(d => d.eid)
          }).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$store.dispatch('SET_CONFIGS',res.data.con);
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
  }
}
</script>

<style scoped>

</style>
