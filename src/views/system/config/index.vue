<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="6" :md="10" :sm="24" :xs="24">
        <a-card
          :bordered="false"
          :body-style="{padding: '24px 16px'}">
          <!-- 表格 -->
          <ele-pro-table
            ref="table"
            row-key="dictId"
            :datasource="config"
            :columns="columns"
            :expandIconColumnIndex="-1"
            v-model:current="current"
            :need-page="true"
            @done="done">
          </ele-pro-table>
        </a-card>
      </a-col>
      <a-col :lg="18" :md="14" :sm="24" :xs="24">
        <a-card :bordered="false">
          <config-data
            v-if="current"
            :type="current.dictName"/>
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import configData from './config-data'
import mtUtil from "@/utils/mtUtil";
export default {
  name: "systemConfig",
  components: {
    configData,
  },
  data() {
    return {
      // 表格数据接口
      config: mtUtil.getDict("系统参数")?mtUtil.getDict("系统参数"):null,
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 38,
          customRender: ({index}) => index + 1
        },
        {
          title: '参数类别',
          dataIndex: 'dictName'
        }
      ],
      // 表格选中数据
      current: null,
    }
  },
  //数据初始化周期
  created() {
    console.log(mtUtil.getConfig("结算日").value)
  },
  mounted() {

  },
  methods: {
    /* 表格渲染完成回调 */
    done(res) {
      if (res.data.length > 0) {
        this.current = res.data[0];
      }
    },
  }
}
</script>

<style scoped>

</style>
