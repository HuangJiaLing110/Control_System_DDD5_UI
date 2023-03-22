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
            <a-form-item label="操作模块:">
              <a-input
                v-model:value.trim="where.model"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="操作时间:">
              <a-range-picker
                v-model:value="daterange"
                :show-time="true"
                value-format="YYYY-MM-DD HH:mm:ss"
                class="ele-fluid">
                <template #suffixIcon>
                  <calendar-outlined/>
                </template>
              </a-range-picker>
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
        row-key="id"
        :datasource="url"
        :columns="columns"
        :where="where"
        :scroll="{x: 'max-content'}">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="exportData">
              <template #icon>
                <download-outlined/>
              </template>
              <span>导出</span>
            </a-button>
          </a-space>
        </template>
        <template #state="{ record }">
          <a-tag :color="['green', 'red'][record.state]">
            {{ ['正常', '异常'][record.state] }}
          </a-tag>
        </template>
        <template #action="{ record }">
          <a @click="openDetail(record)">详情</a>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 详情弹窗 -->
  <oper-record-detail
    v-model:visible="showInfo"
    :data="current||{}"/>
</template>

<script>
import XLSX from 'xlsx';
import {
  DownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue';
import OperRecordDetail from './oper-record-detail';

export default {
  name: 'SystemOperRecord',
  components: {
    DownloadOutlined,
    CalendarOutlined,
    OperRecordDetail
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/operRecord/page',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          align: 'center',
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '账号',
          dataIndex: 'username',
          sorter: true
        },
        {
          title: '用户名',
          dataIndex: 'nickname',
          sorter: true
        },
        {
          title: '操作模块',
          dataIndex: 'model',
          sorter: true
        },
        {
          title: '操作功能',
          dataIndex: 'description',
          sorter: true
        },
        {
          title: '请求地址',
          dataIndex: 'url',
          sorter: true
        },
        {
          title: '方式',
          dataIndex: 'requestMethod',
          sorter: true,
          width: 90
        },
        {
          title: '状态',
          dataIndex: 'state',
          sorter: true,
          width: 90,
          slots: {customRender: 'state'}
        },
        {
          title: '耗时',
          dataIndex: 'spendTime',
          sorter: true,
          width: 100,
          customRender: ({text}) => text / 1000 + 's'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          sorter: true,
          width: 150,
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 90,
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前选中数据
      current: null,
      // 是否显示查看弹窗
      showInfo: false,
      // 日期范围选择
      daterange: []
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.daterange = [];
      this.reload();
    },
    /* 详情 */
    openDetail(row) {
      this.current = row;
      this.showInfo = true;
    },
    /* 导出数据 */
    exportData() {
      let array = [['账号', '用户名', '操作模块', '操作功能', '请求地址', '请求方式', '状态', '耗时', '操作时间']];
      // 请求查询全部(不分页)的接口
      const hide = this.$message.loading('请求中..', 0);
      this.$http.get('/sys/loginRecord/page?page=1&limit=2000').then(res => {
        hide();
        if (res.data.code === 0) {
          res.data.data.forEach(d => {
            array.push([
              d.username,
              d.nickname,
              d.model,
              d.description,
              d.url,
              d.requestMethod,
              ['正常', '异常'][d.state],
              d.spendTime,
              this.$util.toDateString(d.createTime)
            ]);
          });
          this.$util.exportSheet(XLSX, array, '操作日志');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
    }
  },
  watch: {
    daterange() {
      if (this.daterange && this.daterange.length === 2) {
        this.where.createTimeStart = this.daterange[0];
        this.where.createTimeEnd = this.daterange[1];
      } else {
        this.where.createTimeStart = null;
        this.where.createTimeEnd = null;
      }
    }
  }
}
</script>

<style scoped>
</style>
