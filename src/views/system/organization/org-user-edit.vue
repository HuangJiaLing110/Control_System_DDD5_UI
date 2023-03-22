<!-- 用户编辑弹窗 -->
<template>
  <a-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改用户':'新建用户'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 7}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 17}, sm: {span: 24}}">
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="用户账号:" name="username">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户账号"
              v-model:value="form.username"/>
          </a-form-item>
          <a-form-item label="用户名:" name="nickname">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户名"
              v-model:value="form.nickname"/>
          </a-form-item>
          <a-form-item label="性别:" name="sex">
            <a-select
              allow-clear
              placeholder="请选择性别"
              v-model:value="form.sex">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="角色:" name="roleIds">
            <a-select
              allow-clear
              mode="multiple"
              placeholder="请选择角色"
              v-model:value="form.roleIds">
              <a-select-option
                v-for="item in roleList"
                :key="item.roleId"
                :value="item.roleId">
                {{ item.roleName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="邮箱:" name="email">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="请输入邮箱"
              v-model:value="form.email"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="手机号:" name="phone">
            <a-input
              allow-clear
              :maxlength="11"
              placeholder="请输入手机号"
              v-model:value="form.phone"/>
          </a-form-item>
          <a-form-item label="出生日期:" name="birthday">
            <a-date-picker
              class="ele-fluid"
              value-format="YYYY-MM-DD"
              placeholder="请选择出生日期"
              v-model:value="form.birthday"/>
          </a-form-item>
          <a-form-item label="个人简介:">
            <a-textarea
              :rows="1"
              :maxlength="200"
              placeholder="请输入个人简介"
              v-model:value="form.introduction"/>
          </a-form-item>
          <a-form-item label="用户类型:">
            <a-select
              allow-clear
              placeholder="请选择用户类型"
              v-model:value="form.userType"
              :options="userTypeList"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="!isUpdate"
            label="登录密码:"
            name="password">
            <a-input-password
              :maxlength="20"
              v-model:value="form.password"
              placeholder="请输入登录密码"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import validate from 'ele-admin-pro/packages/validate';

export default {
  name: 'OrgUserEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部机构
    organizationList: Array,
    // 机构id
    organizationId: Number
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data, {
        organizationId: this.organizationId
      }),
      // 表单验证规则
      rules: {
        username: [
          {
            required: true,
            type: 'string',
            trigger: 'blur',
            asyncValidator: (rule, value) => {
              return new Promise((resolve, reject) => {
                if (!value) {
                  return reject('请输入用户账号');
                }
                this.$http.get('/sys/user?username=' + value).then(res => {
                  if (res.data.code !== 0 || !res.data.data.length) {
                    return resolve();
                  }
                  if (this.isUpdate && res.data.data[0].username === this.data.username) {
                    return resolve();
                  }
                  reject('账号已经存在');
                }).catch(() => {
                  resolve();
                });
              });
            }
          }
        ],
        nickname: [
          {required: true, message: '请输入用户名', type: 'string', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', type: 'number', trigger: 'blur'}
        ],
        roleIds: [
          {required: true, message: '请选择角色', type: 'array', trigger: 'blur'}
        ],
        email: [
          {pattern: validate.email, message: '邮箱格式不正确', type: 'string', trigger: 'blur'}
        ],
        password: [
          {required: true, pattern: /^[\S]{5,18}$/, message: '密码必须为5-18位非空白字符', type: 'string', trigger: 'blur'}
        ],
        phone: [
          {pattern: validate.phone, message: '手机号格式不正确', type: 'string', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      //用户类型
      userTypeList:[
        {
          label:"材料人员",
          value: 'materialStaff',
        },
        {
          label:"销售人员",
          value: 'saleStaff',
        },
        {
          label:"司机",
          value: 'driver',
        },
        {
          label:"供应商",
          value: 'supplier',
        },
        {
          label:"供应商司机",
          value: 'supplierDriver',
        },{
          label:"施工方",
          value: 'client',
        }
      ]
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          roleIds: this.data.roles.map(d => d.roleId)
        });
        this.isUpdate = true;
      } else {
        this.form = {organizationId: this.organizationId};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },
    organizationId() {
      if (!this.isUpdate) {
        this.form = {organizationId: this.organizationId};
      }
    }
  },
  mounted() {
    this.queryRoles();  // 查询角色列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/user', this.form).then(res => {
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
    /* 查询角色列表 */
    queryRoles() {
      this.$http.get('/sys/role').then(res => {
        if (res.data.code === 0) {
          this.roleList = res.data.data;
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
