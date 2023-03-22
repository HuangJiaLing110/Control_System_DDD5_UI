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
            <a-form-item label="登录时间:">
              <a-range-picker
                v-model:value="daterange"
                value-format="YYYY-MM-DD"
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
        <template #operType="{ record }">
          <a-tag :color="['green', 'red', '', 'orange'][record.operType]">
            {{ ['登录成功', '登录失败', '退出登录', '刷新TOKEN'][record.operType] }}
          </a-tag>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import {
  DownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'SystemLoginRecord',
  components: {
    DownloadOutlined,
    CalendarOutlined
  },
  data() {
    return {
      // 表格数据接口
      url: '/sys/loginRecord/page',
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
          title: 'IP地址',
          dataIndex: 'ip',
          sorter: true
        },
        {
          title: '设备型号',
          dataIndex: 'device',
          sorter: true
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          sorter: true
        },
        {
          title: '浏览器',
          dataIndex: 'browser',
          sorter: true
        },
        {
          title: '操作类型',
          dataIndex: 'operType',
          sorter: true,
          width: 120,
          slots: {customRender: 'operType'}
        },
        {
          title: '备注',
          dataIndex: 'comments',
          sorter: true
        },
        {
          title: '登录时间',
          dataIndex: 'createTime',
          sorter: true,
          width: 150,
          customRender: ({text}) => this.$util.toDateString(text)
        }
      ],
      // 表格搜索条件
      where: {},
      // 日期范围选择
      daterange: []
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.daterange = [];
      this.reload();
    },
    /* 导出数据 */
    exportData() {
      let array = [['账号', '用户名', 'IP地址', '设备型号', '操作系统', '浏览器', '操作类型', '备注', '登录时间']];
      // 请求查询全部(不分页)的接口
      const hide = this.$message.loading('请求中..', 0);
      this.$http.get('/sys/loginRecord/page?page=1&limit=2000').then(res => {
        hide();
        if (res.data.code === 0) {
          res.data.data.forEach(d => {
            array.push([
              d.username,
              d.nickname,
              d.ip,
              d.device,
              d.os,
              d.browser,
              ['登录成功', '登录失败', '退出登录', '刷新TOKEN'][d.operType],
              d.comments,
              this.$util.toDateString(d.createTime)
            ]);
          });
          this.$util.exportSheet(XLSX, array, '登录日志');
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
        this.where.createTimeStart = this.daterange[0] + ' 00:00:00';
        this.where.createTimeEnd = this.daterange[1] + ' 23:59:59';
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
