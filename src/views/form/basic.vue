<template>
  <a-page-header :ghost="false" title="基础表单">
    <div class="ele-text-secondary">表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</div>
  </a-page-header>
  <div class="ele-body">
    <a-card :bordered="false">
      <a-form
        ref="form"
        :model="form"
        :rules="rules"
        style="max-width: 800px;margin: 0 auto;"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-form-item label="标题:" name="title">
          <a-input
            v-model:value="form.title"
            placeholder="请输入标题"
            allow-clear/>
        </a-form-item>
        <a-form-item label="起止日期:" name="datetime">
          <a-range-picker
            v-model:value="form.datetime"
            value-format="YYYY-MM-DD"
            class="ele-fluid">
            <template #suffixIcon>
              <calendar-outlined/>
            </template>
          </a-range-picker>
        </a-form-item>
        <a-form-item label="目标描述:" name="goal">
          <a-textarea
            v-model:value="form.goal"
            placeholder="请输入目标描述"
            :rows="4"/>
        </a-form-item>
        <a-form-item label="衡量标准:" name="standard">
          <a-textarea
            v-model:value="form.standard"
            placeholder="请输入衡量标准"
            :rows="4"/>
        </a-form-item>
        <a-form-item label="地点:" name="address">
          <a-select
            v-model:value="form.address"
            placeholder="请选择地点"
            allow-clear>
            <a-select-option value="1">地点一</a-select-option>
            <a-select-option value="2">地点二</a-select-option>
            <a-select-option value="3">地点三</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邀评人:">
          <a-select
            v-model:value="form.invites"
            placeholder="请选择邀评人"
            mode="multiple"
            allow-clear>
            <a-select-option
              v-for="item in users"
              :key="item.id"
              :value="item.id">{{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="权重:">
          <a-space>
            <a-input-number
              v-model:value="form.weight"
              :min="0"
              :max="100"/>
            <span>%</span>
          </a-space>
        </a-form-item>
        <a-form-item label="目标公开:">
          <a-radio-group
            v-model:value="form.publicType"
            name="publicType">
            <a-radio :value="1">公开</a-radio>
            <a-radio :value="2">部分公开</a-radio>
            <a-radio :value="3">不公开</a-radio>
          </a-radio-group>
          <a-input
            v-if="form.publicType===2"
            placeholder="公开给"/>
          <div class="ele-text-secondary">客户、邀评人默认被分享</div>
        </a-form-item>
        <a-form-item :wrapper-col="{md: {offset: 6}}">
          <a-space size="middle">
            <a-button @click="closePage">关闭</a-button>
            <a-button
              type="primary"
              @click="submit"
              :loading="loading">提交
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import {CalendarOutlined} from '@ant-design/icons-vue';

export default {
  name: 'FormBasic',
  components: {CalendarOutlined},
  data() {
    return {
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        title: '',
        datetime: [],
        goal: '',
        standard: '',
        invites: [],
        weight: 0,
        publicType: 1
      },
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        datetime: [
          {required: true, message: '请选择起止日期', type: 'array', trigger: 'blur'}
        ],
        goal: [
          {required: true, message: '请输入目标描述', trigger: 'blur'}
        ],
        standard: [
          {required: true, message: '请输入衡量标准', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请选择地点', type: 'string', trigger: 'blur'}
        ]
      },
      // 邀评人下拉列表数据
      users: [
        {id: 1, name: 'SunSmile'},
        {id: 2, name: '你的名字很好听'},
        {id: 3, name: '全村人的希望'},
        {id: 4, name: 'Jasmine'},
        {id: 5, name: '酷酷的大叔'}
      ]
    };
  },
  methods: {
    /* 提交 */
    submit() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          // 重置表单
          this.form = {
            title: '',
            datetime: [],
            goal: '',
            standard: '',
            address: '',
            invites: [],
            weight: 0,
            publicType: 1
          };
          this.$message.success('提交成功');
        }, 1500);
      }).catch(() => {
      });
    },
    /* 关闭当前页面 */
    closePage() {
      this.$store.dispatch('user/tabRemove', this.$route.fullPath).then(({lastPath}) => {
        this.$router.push(lastPath || '/');
      });
    }
  }
}
</script>

<style scoped>
</style>
