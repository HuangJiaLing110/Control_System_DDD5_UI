<!-- 修改密码弹窗 -->
<template>
  <a-modal
    :width="460"
    title="修改密码"
    :visible="visible"
    :confirm-loading="loading"
    :body-style="{paddingBottom: '16px'}"
    @update:visible="onUpdateVisible"
    @cancel="onCancel"
    @ok="onOk">
    <a-form
      ref="pswForm"
      :model="form"
      :rules="rules"
      :label-col="{sm: {span: 6}}"
      :wrapper-col="{sm: {span: 18}}">
      <a-form-item
        label="旧密码:"
        name="old">
        <a-input-password
          v-model:value="form.old"
          placeholder="请输入旧密码"/>
      </a-form-item>
      <a-form-item
        label="新密码:"
        name="password">
        <a-input-password
          v-model:value="form.password"
          placeholder="请输入新密码"/>
      </a-form-item>
      <a-form-item
        label="确认密码:"
        name="password2">
        <a-input-password
          v-model:value="form.password2"
          placeholder="请再次输入新密码"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'ElePassword',
  emits: ['update:visible'],
  props: {
    visible: Boolean
  },
  data() {
    let rePswRule = async (rule, value) => {
      if (!value) {
        return Promise.reject('请再次输入新密码');
      }
      if (value === this.form.password) {
        return Promise.resolve();
      }
      return Promise.reject('两次输入密码不一致');
    };
    return {
      // 表单数据
      form: {
        old: '',
        password: '',
        password2: ''
      },
      // 表单验证
      rules: {
        old: [
          {required: true, message: '请输入旧密码', type: 'string', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入新密码', type: 'string', trigger: 'blur'}
        ],
        password2: [
          {required: true, validator: rePswRule, type: 'string', trigger: 'blur'}
        ]
      },
      // 按钮loading
      loading: false
    };
  },
  methods: {
    /* 保存修改 */
    onOk() {
      this.$refs.pswForm.validate().then(() => {
        this.loading = true;
        this.$http.put('/main/password', {
          oldPsw: this.form.old,
          newPsw: this.form.password
        }).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.onUpdateVisible(false);
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
    /* 关闭回调 */
    onCancel() {
      this.form = {};
      this.$refs.pswForm.resetFields();
      this.loading = false;
    },
    /* 修改visible */
    onUpdateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>
