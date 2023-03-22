<template>
  <a-modal
    :width="1200"
    :visible="visible"
    title="卷内文件调整"
    @update:visible="updateVisible"
    @cancel="close"
    @ok="save">
    <a-row :gutter="16">
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <!-- 表格 -->
        <ele-pro-table
          bordered
          ref="docTable"
          row-key="piece_no"
          sub-title="案卷列表"
          :columns="columns1"
          :datasource="documents"
          v-model:current="current"
          :scroll="{x: 'max-content'}"
          :row-selection="{columnWidth: 48}"
          :tool-style="{padding: '7px 14px'}"
          tools-theme="default"
          :need-page="false"
          :toolkit="[]">
        </ele-pro-table>
      </a-col>
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <!-- 表格 -->
        <ele-pro-table
          bordered
          ref="fileTable"
          :loading="loading"
          sub-title="卷内列表"
          :datasource="data1"
          :columns="columns2"
          row-key="archive_no"
          tools-theme="default"
          :scroll="{x: 'max-content'}"
          v-model:selection="selection1"
          :row-selection="{columnWidth: 48}"
          :need-page="false"
          :toolkit="[]">
          <template #toolkit>
            <a-space>
              <a-button
                @click="moveUp"
                type="primary"
                class="ele-btn-icon">
                <span><arrow-up-outlined/>上移</span>
              </a-button>
              <a-button
                type="primary"
                class="ele-btn-icon"
                @click="moveDown">
                <span><arrow-down-outlined/>下移</span>
              </a-button>
              <a-button
                type="primary"
                class="ele-btn-icon"
                @click="moveOut">
                <span>调出<arrow-right-outlined/></span>
              </a-button>
            </a-space>
          </template>
        </ele-pro-table>
      </a-col>
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <!-- 表格 -->
        <ele-pro-table
          bordered
          :loading="loading"
          :datasource="data2"
          :columns="columns2"
          sub-title="未归档列表"
          row-key="archive_no"
          tools-theme="default"
          :scroll="{x: 'max-content'}"
          v-model:selection="selection2"
          :row-selection="{columnWidth: 48}"
          :need-page="false"
          :toolkit="[]">
          <template #toolkit>
            <a-button
              type="primary"
              class="ele-btn-icon"
              @click="moveIn">
              <span><arrow-left-outlined/>调入</span>
            </a-button>
          </template>
        </ele-pro-table>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'FileSort',
  components: {
    ArrowUpOutlined,
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined
  },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 案卷列表
    documents: {
      type: Array,
      required: true
    }
  },
  emits: ['update:visible'],
  data() {
    return {
      // 案卷表格列配置
      columns1: [
        {
          title: '案卷题名',
          dataIndex: 'title'
        },
        {
          title: '案卷档号',
          dataIndex: 'piece_no'
        }
      ],
      // 卷内表格列配置
      columns2: [
        {
          title: '文件题名',
          dataIndex: 'title'
        },
        {
          title: '文件档号',
          dataIndex: 'archive_no'
        }
      ],
      // 案卷下的全部文件列表
      data: [],
      // 选中案卷
      current: null,
      // 加载loading
      loading: true,
      // 卷内列表选中数据
      selection1: [],
      // 未归档列表选中数据
      selection2: []
    };
  },
  computed: {
    // 选中案卷的卷内文件
    data1() {
      if (!this.current) {
        return [];
      }
      return this.data.filter(d => d.piece_no === this.current.piece_no);
    },
    // 未归档的卷内文件
    data2() {
      return this.data.filter(d => !d.piece_no);
    }
  },
  methods: {
    /* 查询所选案卷的卷内文件 */
    query() {
      this.loading = true;
      this.$http.get('https://cdn.eleadmin.com/20200610/archive.json').then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.data = res.data.data;
          this.current = this.documents[0];
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* 上移 */
    moveUp() {
      if (!this.selection1.length) {
        this.$message.error('请选择一条数据');
        return;
      }
      if (this.selection1.length > 1) {
        this.$message.error('只能选择一条数据');
        return;
      }
      if (this.data1.indexOf(this.selection1[0]) === 0) {
        return;
      }
      let index = this.data.indexOf(this.selection1[0]);
      let old = this.data[index - 1];
      this.data[index - 1] = this.selection1[0];
      this.data[index] = old;
      this.selection1 = [this.data[index - 1]];
    },
    /* 下移 */
    moveDown() {
      if (!this.selection1.length) {
        this.$message.error('请选择一条数据');
        return;
      }
      if (this.selection1.length > 1) {
        this.$message.error('只能选择一条数据');
        return;
      }
      if (this.data1.indexOf(this.selection1[0]) === this.data1.length - 1) {
        return;
      }
      let index = this.data.indexOf(this.selection1[0]);
      let old = this.data[index + 1];
      this.data[index + 1] = this.selection1[0];
      this.data[index] = old;
      this.selection1 = [this.data[index + 1]];
    },
    /* 调出 */
    moveOut() {
      if (!this.selection1.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.selection1.forEach(d => {
        d.piece_no = '';
      });
      this.selection1 = [];
    },
    /* 调入 */
    moveIn() {
      if (!this.current) {
        return;
      }
      if (!this.selection2.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.selection2.forEach(d => {
        d.piece_no = this.current.piece_no;
      });
      this.selection2 = [];
    },
    /* 保存 */
    save() {
      let result = this.data.map(d => {
        return {
          archive_no: d.archive_no,
          piece_no: d.piece_no
        };
      });
      console.log(result);
      this.$message.success('调整成功');
      this.close();
    },
    /* 关闭弹窗 */
    close() {
      this.data = [];
      this.selection1 = [];
      this.selection2 = [];
      this.updateVisible(false);
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.query();
      }
    },
    current() {
      this.selection1 = [];
    }
  }
}
</script>

<style scoped>
</style>
