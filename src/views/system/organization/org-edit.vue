<!-- 机构编辑弹窗 -->
<template>
  <a-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改机构':'添加机构'"
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
          <a-form-item label="上级机构:" name="parentId">
            <a-tree-select
              allow-clear
              tree-default-expand-all
              placeholder="请选择上级机构"
              v-model:value="form.parentId"
              :tree-data="organizationList"
              :dropdown-style="{maxHeight: '360px', overflow: 'auto'}"/>
          </a-form-item>
          <a-form-item label="机构名称:" name="organizationName">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入机构名称"
              v-model:value="form.organizationName"/>
          </a-form-item>
          <a-form-item label="机构全称:" name="organizationFullName">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="请输入机构全称"
              v-model:value="form.organizationFullName"/>
          </a-form-item>
          <a-form-item label="机构代码:" name="organizationCode">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入机构代码"
              v-model:value="form.organizationCode"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="机构类型:" name="organizationType">
            <a-select
              allow-clear
              placeholder="请选择机构类型"
              v-model:value="form.organizationType">
              <a-select-option
                v-for="item in organizationTypeList"
                :key="item.dictDataId"
                :value="item.dictDataId">
                {{ item.dictDataName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="排序号:" name="sortNumber">
            <a-input-number
              :min="0"
              :max="99999"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"/>
          </a-form-item>
          <a-form-item label="备注:">
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="请输入备注"
              v-model:value="form.comments"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'OrgEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部机构
    organizationList: Array
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data, {
        parentId: this.data ? (this.data.parentId === 0 ? null : this.data.parentId) : null
      }),
      // 表单验证规则
      rules: {
        organizationName: [
          {required: true, message: '请输入机构名称', type: 'string', trigger: 'blur'}
        ],
        organizationFullName: [
          {required: true, message: '请输入机构全称', type: 'string', trigger: 'blur'}
        ],
        organizationCode: [
          {required: true, message: '请输入机构代码', type: 'string', trigger: 'blur'}
        ],
        organizationType: [
          {required: true, message: '请选择机构类型', type: 'number', trigger: 'blur'}
        ],
        sortNumber: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 机构类型列表
      organizationTypeList: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        console.log(this.data)
        this.form = Object.assign({}, this.data, {
          parentId: this.data.parentId === 0 ? null : this.data.parentId
        });
        this.isUpdate = !!this.data.eid;
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
    this.queryOrganizationType();  // 获取机构类型
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/organization',
          Object.assign({}, this.form, {
            parentId: this.form.parentId || 0
          })
        ).then(res => {
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
    /* 查询机构类型 */
    queryOrganizationType() {
      this.$http.get('/sys/dictdata', {
        params: {
          dictCode: 'organization_type'
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.organizationTypeList = res.data.data;
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
