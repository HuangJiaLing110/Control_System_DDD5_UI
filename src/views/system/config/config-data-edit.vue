<!-- 用户编辑弹窗 -->
<template>
  <a-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改参数':'新增参数'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save"
    >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 7}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 17}, sm: {span: 24}}">
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="参数名字:" name="name">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入参数名字"
              v-model:value="form.name"/>
          </a-form-item>
          <a-form-item label="参数值:" name="value">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入参数值"
              v-model:value="form.value"/>
          </a-form-item>
          <a-form-item label="参数说明:" name="description">
            <a-input
              allow-clear
              placeholder="请输入参数说明"
              v-model:value="form.description">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="参数选项:" name="options">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="每个参数选项用逗号隔开"
              v-model:value="form.options"/>
          </a-form-item>
          <a-form-item label="参数类别:" name="type">
            <a-select
              allow-clear
              :maxlength="11"
              placeholder="请选择参数类别"
              v-model:value="form.type">
              <a-select-option
                v-for="item in types"
                :key="item.index"
                :value="item.dictName">
                {{ item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="前台参数:" name="isFrontConfig">
            <a-select
              allow-clear
              :maxlength="11"
              placeholder="请选择是否是前台参数"
              v-model:value="form.isFrontConfig">
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>

import mtUtil from "@/utils/mtUtil";

export default {
  name: 'configDataEdit',
  emits: ['done','update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {
            required: true,
            type: 'string',
            trigger: 'blur',
            message: '请输入参数名称'

          }
        ],
        value: [
          {required: true, message: '请输入参数值', type: 'string', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入参数说明', type: 'string', trigger: 'blur'}
        ],
        options: [
          {required:true, message: '请输入参数选项', type: 'string', trigger: 'blur'}
        ],
        type: [
          {required:true, message: '请选择参数类型', type: 'string', trigger: 'blur'}
        ],
        isFrontConfig: [
          {required:true, message: '请选择是否是前台参数', type: 'number', trigger: 'blur'}
        ],

      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      //系统参数类别
      types:[],
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  mounted() {
    //查询类型列表
    this.types = mtUtil.getDict("系统参数");
    //this.queryTypes();//查询类型列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/con', this.form).then(res => {
          this.$store.dispatch('SET_CONFIGS',res.data.con);
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            if (!this.isUpdate) {
              this.form = {};
            }
            this.updateVisible(false);
            this.$emit('done');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 查询系统参数类型列表 */
    queryTypes() {
      this.$http.get('/sys/dictdata?dictName=' + '参数类别').then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data);
          console.log(this.$store.state.dict["系统参数"].children);
          this.types = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
