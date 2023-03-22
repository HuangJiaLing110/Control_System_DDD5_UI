<!-- 字典编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改字典':'添加字典'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span:7}, sm: {span: 24}}"
      :wrapper-col="{md: {span:17}, sm: {span: 24}}">
      <a-form-item label="字典名称:" name="dictName">
        <a-input
          allow-clear
          :maxlength="30"
          @keyup.enter="enterEvent"
          placeholder="请输入字典名称"
          v-model:value="form.dictName"/>
      </a-form-item>
      <a-form-item label="排序号:" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
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
    </a-form>


    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
      <a-button type="primary" v-show="!isUpdate" @click="saveAndUpdate">保存并更新</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'SysDictEdit',
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
        dictName: [
          {required: true, message: '请输入字典名称', type: 'string', trigger: 'blur'}
        ],
        sortNumber: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
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
      //对更新与新建进行操作
      if (this.data!==null && this.data.dictName){
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      }else {
        this.form = Object.assign({}, this.data);
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/dictmanagement', this.form).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            //将dict缓存到全局
            this.$store.dispatch('SET_DICTS',res.data.dict);
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
    /* 取消*/
    handleCancel(){
      this.form={}
      this.updateVisible(false);
    },
    /*保存并更新*/
    saveAndUpdate(){
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http.post('/sys/dictmanagement', this.form).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            //将dict缓存到全局
            this.$store.dispatch('SET_DICTS',res.data.dict);
            this.$message.success(res.data.msg);
            //重置form
            this.form={"parentId":this.form.parentId,"dict_name":'',"sortNumber":this.form.sortNumber+1,"comments":''}
            this.updateVisible(true);
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
    /*回车事件*/
    enterEvent(){
      if (this.isUpdate){
        this.save()
      }else {
        this.saveAndUpdate()
      }
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
