<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <a-button type="primary" title="新增" @click="openEdit(this.lastSortNumber)">新增顶级</a-button>
      <vxe-table
        border
        resizable
        highlight-current-row
        highlight-hover-row
        ref="vxeTable"
        :tree-config="{children: 'children', accordion: true,trigger:'cell'}"
        :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
        :data="testTableData"
        style="margin-top: 15px"
      >
        <vxe-table-column field="dictName" title="字典名称" tree-node></vxe-table-column>
        <vxe-table-column sortable field="sortNumber" title="排序号"></vxe-table-column>
        <vxe-table-column field="comments" title="备注"></vxe-table-column>
        <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row }">
            <a-space>
              <a-button type="primary" title="新增" @click="childrenSort(row)">新增</a-button>
              <a-button type="primary" title="编辑" @click="openEdit(row)">编辑</a-button>
              <a-button type="danger" title="删除" @click="remove(row)">删除</a-button>
            </a-space>
          </template>
        </vxe-table-column>
      </vxe-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <sys-dict-edit
    v-model:visible="showEdit"
    :data="editData"
    @done="reload"/>
</template>


<script>
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import SysDictEdit from "@/views/system/dictionary/sys-dict-edit";

export default {
  components: {SysDictEdit},
  data() {
    return {
      testTableData: [],
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null,
      //存放新增子级所传数据
      childrenData: null,
      //存放children的最大sortNumber
      childrenList: [],
      //存放最大的childrenSortNumber
      childrenSortNumber: 0,
      //顶级的最大sortNumber
      lastSortNumber: 0,
      //存放顶层dict
      topDictList: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //获取数据库字典数据
    getList() {
      this.$http.get('/sys/dictmanagement').then((response) => {
        if (response.data.code === 0) {
          this.testTableData = response.data.data;
          //获取顶层的最大的sortNumber
          this.topDictList = []
          for (let i = 0; i < this.testTableData.length; i++) {
            this.topDictList.push(this.testTableData[i].sortNumber)
          }
          //找出最大的sortNumber
          if (this.topDictList == undefined || this.topDictList.length <= 0) {
            var maxNumber = 0;
          } else {
            maxNumber = this.topDictList.reduce(function (a, b) {
              return b > a ? b : a
            })
          }
          this.lastSortNumber = {"sortNumber": maxNumber + 1}
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    /* 刷新表格 */
    reload() {
      this.getList();
      this.$refs.vxeTable.loadData(this.testTableData)  //获取dom，然后调用方法
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.editData = row;
      this.showEdit = true;
    },
    /*获取新增子级的最大sortNumber并传到编辑页面*/
    childrenSort(row) {
      // this.childrenSortNumber = row.children.length
      this.childrenList = []
      for (let i = 0; i < row.children.length; i++) {
        this.childrenList.push(row.children[i].sortNumber)
      }
      if (this.childrenList == undefined || this.childrenList.length <= 0) {
        var maxChildrenSortNumber = 0;
      } else {
        maxChildrenSortNumber = this.childrenList.reduce(function (a, b) {
          return b > a ? b : a
        })
      }
      this.childrenData = {"parentId": row.dictId, "sortNumber": maxChildrenSortNumber + 1}
      this.openEdit(this.childrenData)
    },
    /* 删除 */
    remove(row) {
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的字典吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/sys/dictmanagement/' + row.dictId).then(res => {
            hide();
            if (res.data.code === 0) {
              //将dict缓存到全局
              this.$store.dispatch('SET_DICTS', res.data.dict);
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
}
</script>
