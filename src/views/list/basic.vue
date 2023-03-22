<template>
  <div class="ele-body ele-body-card">
    <a-card :bordered="false" :body-style="{paddingBottom: 0}">
      <!-- 搜索表单 -->
      <a-form
        :model="where"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-row>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="规则名称:">
              <a-input
                v-model:value="where.name"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="状态:">
              <a-select
                v-model:value="where.state"
                placeholder="请选择"
                allow-clear>
                <a-select-option value="0">运行中</a-select-option>
                <a-select-option value="1">已上线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="searchExpand" :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="描述:">
              <a-input
                v-model:value="where.desc"
                placeholder="请输入"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col v-if="searchExpand" :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="上次调度时间:">
              <a-date-picker
                v-model:value="where.lastTime"
                placeholder="请选择"
                show-time
                value-format="YYYY-MM-DD hh:mm:ss"
                class="ele-fluid"/>
            </a-form-item>
          </a-col>
          <a-col v-if="searchExpand" :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item label="服务调用次数:">
              <a-input-number
                v-model:value="where.callTimes"
                placeholder="请输入"
                :min="0"
                :max="100"
                class="ele-fluid"/>
            </a-form-item>
          </a-col>
          <a-col :lg="8" :md="12" :sm="24" :xs="24">
            <a-form-item
              class="ele-text-right"
              :wrapper-col="{span: 24}">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
                <a @click="searchExpand = !searchExpand">
                  <span v-if="searchExpand">收起 <up-outlined class="ele-text-small"/></span>
                  <span v-else>展开 <down-outlined class="ele-text-small"/></span>
                </a>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-alert
        type="info"
        show-icon
        style="margin-bottom: 16px;">
        <template #message>
          <span>已选择 <b class="ele-text-primary">{{ choose.length }}</b> 项<em/></span>
          <span>服务调用次数总计 <b>{{ sumTimes }} 万</b><em/><em/></span>
          <a @click="clearChoose">清空</a>
        </template>
      </a-alert>
      <!-- 表格 -->
      <ele-pro-table
        ref="table"
        row-key="id"
        title="基础列表"
        :datasource="url"
        :columns="columns"
        :where="where"
        v-model:selection="choose"
        :scroll="{x: 'max-content'}">
        <template #toolkit>
          <a-space size="middle">
            <a-button
              type="primary"
              @click="openEdit()"
              class="ele-btn-icon">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-dropdown :disabled="choose.length===0">
              <a-button class="ele-btn-icon">
                <span>批量操作 <down-outlined/></span>
              </a-button>
              <template #overlay>
                <a-menu @click="onDropClick">
                  <a-menu-item key="del">批量删除</a-menu-item>
                  <a-menu-item key="check">批量审批</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-divider type="vertical"/>
          </a-space>
        </template>
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)">配置</a>
            <a-divider type="vertical"/>
            <a @click="doRSS(record)">订阅警报</a>
          </a-space>
        </template>
        <template #state="{ record }">
          <a-badge
            :status="['processing', 'success', 'error', 'default'][record.state]"
            :text="['运行中', '已上线', '异常', '关闭'][record.state]"/>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="showEdit"
      :title="form.id?'配置规则':'新建规则'"
      :width="520"
      :confirm-loading="loading"
      :body-style="{paddingBottom: '16px'}"
      @ok="save">
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-form-item label="规则名称:" name="name">
          <a-input
            v-model:value="form.name"
            placeholder="请输入规则名称"
            allow-clear/>
        </a-form-item>
        <a-form-item label="描述:">
          <a-textarea
            v-model:value="form.desc"
            placeholder="请输入描述"
            :rows="4"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  DownOutlined,
  UpOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'ListBasic',
  components: {
    DownOutlined,
    UpOutlined,
    PlusOutlined
  },
  data() {
    return {
      // 数据接口
      url: 'https://cdn.eleadmin.com/20200610/list-demo-basic.json',
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({index}) => `${this.$refs.table.tableIndex + index}`
        },
        {
          title: '规则名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '描述',
          dataIndex: 'desc',
          sorter: true
        },
        {
          title: '服务调用次数',
          dataIndex: 'callTimes',
          customRender: ({text}) => `${text} 万`,
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'state',
          sorter: true,
          slots: {customRender: 'state'},
          filters: [
            {
              text: '运行中',
              value: '0'
            },
            {
              text: '已上线',
              value: '1'
            },
            {
              text: '异常',
              value: '2'
            },
            {
              text: '关闭',
              value: '3'
            }
          ]
        },
        {
          title: '上次调度时间',
          dataIndex: 'lastTime',
          sorter: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格选中数据
      choose: [],
      // 表格搜索条件
      where: {},
      // 编辑弹窗数据
      form: {},
      // 编辑弹窗表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入规则名称', type: 'string', trigger: 'blur'}
        ]
      },
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑表单提交状态
      loading: false,
      // 搜索表单是否展开
      searchExpand: false
    };
  },
  computed: {
    // 计算服务总调用次数
    sumTimes() {
      let sum = 0;
      this.choose.forEach(d => sum += d.callTimes);
      return sum;
    }
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 清空选择 */
    clearChoose() {
      this.choose = [];
    },
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.showEdit = false;
          this.$message.success('保存成功');
        }, 300);
      }).catch(() => {
      });
    },
    /* 编辑 */
    openEdit(row) {
      this.form = Object.assign({}, row);
      this.showEdit = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    /* 订阅 */
    doRSS(row) {
      console.log(row);
      this.$message.success('订阅成功');
    },
    /* 下拉按钮点击 */
    onDropClick(obj) {
      if (obj.key === 'del') {
        this.$message.info('点击了批量删除');
      } else if (obj.key === 'check') {
        this.$message.info('点击了批量审批');
      }
    }
  }
}
</script>

<style scoped>
</style>
