<template>
  <div class="ele-body ele-body-card" style="padding-bottom: 48px;">
    <a-card title="发布实训活动" :bordered="false">
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{ md: {span: 18}, sm: {span: 24}}">
        <a-row :gutter="16">
          <a-col :md="8" :sm="24" :xs="24">
            <a-form-item label="实训名称:" name="title">
              <a-input
                v-model:value="form.title"
                placeholder="请输入实训名称"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" :xs="24">
            <a-form-item label="起止日期:" name="datetime">
              <a-range-picker
                v-model:value="form.datetime"
                class="ele-fluid">
                <template #suffixIcon>
                  <calendar-outlined/>
                </template>
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" :xs="24">
            <a-form-item label="实训地点:" name="address">
              <a-select
                v-model:value="form.address"
                placeholder="请选择地点"
                allow-clear>
                <a-select-option value="1">地点一</a-select-option>
                <a-select-option value="2">地点二</a-select-option>
                <a-select-option value="2">地点三</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          label="实训内容:"
          name="content"
          :label-col="{md: {span: 2}, sm: {span: 24}}"
          :wrapper-col="{ md: {span: 22}, sm: {span: 24}}">
          <a-textarea
            v-model:value="form.content"
            placeholder="请输入实训内容"
            :rows="4"/>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="选择实训班级:" :bordered="false">
      <a-row :gutter="16">
        <a-col :lg="12" :md="24" :sm="24" :xs="24">
          <!-- 未选择的班级数据表格 -->
          <ele-pro-table
            bordered
            :toolkit="[]"
            :columns="columns"
            row-key="classesId"
            sub-title="未选班级:"
            empty-text="已全部选择"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="unChooseClass"
            :scroll="{x: 'max-content'}">
            <template #toolkit>
              <a-button
                type="primary"
                @click="addAll">全部添加
              </a-button>
            </template>
            <template #action="{ record }">
              <a-button
                size="small"
                type="primary"
                @click="add(record)">添加
              </a-button>
            </template>
          </ele-pro-table>
        </a-col>
        <a-col :lg="12" :md="24" :sm="24" :xs="24">
          <!-- 已选择的班级数据表格 -->
          <ele-pro-table
            bordered
            :toolkit="[]"
            :columns="columns"
            row-key="classesId"
            sub-title="已选班级:"
            emptyText="未选择班级"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="chooseClasses"
            :scroll="{x: 'max-content'}">
            <template #toolkit>
              <a-button
                type="danger"
                @click="removeAll">全部移除
              </a-button>
            </template>
            <template #action="{ record }">
              <a-button
                size="small"
                type="danger"
                @click="remove(record)">移除
              </a-button>
            </template>
          </ele-pro-table>
        </a-col>
      </a-row>
    </a-card>
    <!-- 底部工具栏 -->
    <div class="ele-bottom-tool">
      <div class="ele-bottom-tool-actions">
        <a-button
          type="primary"
          :loading="loading"
          @click="submit">提交
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {CalendarOutlined} from '@ant-design/icons-vue';

export default {
  name: 'ExampleChoose',
  components: {CalendarOutlined},
  data() {
    return {
      // 加载状态
      loading: false,
      // 表单数据
      form: {},
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入实训名称', type: 'string', trigger: 'blur'}
        ],
        datetime: [
          {required: true, message: '请选择起止日期', type: 'array', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请选择实训地点', type: 'string', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入实训内容', type: 'string', trigger: 'blur'}
        ]
      },
      // 全部实训班级
      classes: [],
      // 已选择的班级数据
      chooseClasses: [],
      // 表格列配置
      columns: [
        {
          width: 90,
          title: '操作',
          key: 'action',
          align: 'center',
          slots: {customRender: 'action'}
        },
        {
          title: '班级名称',
          dataIndex: 'classesName'
        },
        {
          title: '专业',
          dataIndex: 'major'
        },
        {
          title: '学院',
          dataIndex: 'college'
        }
      ]
    };
  },
  computed: {
    /* 未选择的班级数据 */
    unChooseClass() {
      return this.classes.filter(d => this.chooseClasses.indexOf(d) === -1);
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 获取全部实训班级 */
    query() {
      this.$http.get('https://cdn.eleadmin.com/20200610/classes.json').then(res => {
        if (res.data.code === 0) {
          this.classes = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 提交 */
    submit() {
      this.$refs.form.validate().then(() => {
        if (!this.chooseClasses.length) {
          this.$message.error('请选择实训班级');
          return;
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.$message.success('提交成功');
        }, 1500);
      }).catch(() => {
      });
    },
    /* 添加 */
    add(row) {
      this.chooseClasses.push(row);
    },
    /* 移除 */
    remove(row) {
      this.chooseClasses.splice(this.chooseClasses.indexOf(row), 1);
    },
    /* 添加全部 */
    addAll() {
      this.unChooseClass.forEach(d => {
        this.chooseClasses.push(d);
      })
    },
    /* 移除所有 */
    removeAll() {
      this.chooseClasses.splice(0, this.chooseClasses.length);
    }
  }
}
</script>

<style scoped>
</style>
