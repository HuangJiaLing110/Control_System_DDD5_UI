<!-- 角色编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改角色':'添加角色'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 5}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
      <a-form-item label="角色名称:" name="roleName">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入角色名称"
          v-model:value="form.roleName"/>
      </a-form-item>
      <a-form-item label="角色标识:" name="roleCode">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入角色标识"
          v-model:value="form.roleCode"/>
      </a-form-item>
      <a-form-item label="备注:">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入备注"
          v-model:value="form.comments"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'RoleEdit',
  emits: ['done', 'update:visible'],
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
        roleName: [
          {required: true, message: '请输入角色名称', type: 'string', trigger: 'blur'}
        ],
        roleCode: [
          {required: true, message: '请输入角色标识', type: 'string', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
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
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/role', this.form).then(res => {
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
    }
  }
}
</script>

<style scoped>
</style>
