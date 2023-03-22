<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="table"
        title="案卷列表"
        row-key="piece_no"
        :datasource="url"
        :columns="columns"
        v-model:selection="selection"
        :scroll="{x:'max-content'}">
        <template #toolkit>
          <a-button
            type="primary"
            @click="openFileSort">卷内文件调整
          </a-button>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 卷内文件调整弹窗 -->
    <file-sort
      v-model:visible="showFileSort"
      :documents="fileSortChoose"/>
  </div>
</template>

<script>
import FileSort from './file-sort';

export default {
  name: 'ExampleDocument',
  components: {FileSort},
  data() {
    return {
      // 列表接口地址
      url: 'https://cdn.eleadmin.com/20200610/document.json',
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '案卷档号',
          dataIndex: 'piece_no',
          sorter: true
        },
        {
          title: '案卷题名',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '年度',
          dataIndex: 'year',
          sorter: true
        },
        {
          title: '保管期限',
          dataIndex: 'retention',
          sorter: true
        },
        {
          title: '密级',
          dataIndex: 'secret',
          sorter: true
        },
        {
          title: '档案类别',
          dataIndex: 'type',
          sorter: true
        },
        {
          title: '载体规格',
          dataIndex: 'carrier',
          sorter: true
        }
      ],
      // 表格选中数据
      selection: [],
      // 是否显示卷内文件调整弹窗
      showFileSort: false,
      // 选中的案卷
      fileSortChoose: []
    };
  },
  methods: {
    /* 打开卷内文件调整弹窗 */
    openFileSort() {
      if (this.selection.length < 2) {
        this.$message.error('请至少选择两条数据');
        return;
      }
      // 实际项目用这一行
      /*this.fileSortChoose = this.selection.map(d => {
        return Object.assign({}, d);
      });*/
      // 演示强制选前三个演示
      this.fileSortChoose = this.$refs.table.data.slice(0, 3);
      this.showFileSort = true;
    }
  }
}
</script>

<style scoped>
</style>
