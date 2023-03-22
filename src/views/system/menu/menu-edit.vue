<!-- 编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改菜单':'新建菜单'"
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
          <a-form-item label="上级菜单" name="parentId">
            <a-tree-select
              allow-clear
              :tree-data="menuList"
              tree-default-expand-all
              placeholder="请选择上级菜单"
              v-model:value="form.parentId"
              :dropdown-style="{maxHeight: '360px', overflow: 'auto'}"/>
          </a-form-item>
          <a-form-item label="菜单名称" name="title">
            <a-input
              allow-clear
              placeholder="请输入菜单名称"
              v-model:value="form.title"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="菜单类型" name="menuType">
            <a-radio-group
              v-model:value="form.menuType"
              @change="onMenuTypeChange">
              <a-radio :value="0">菜单</a-radio>
              <a-radio :value="1">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="打开方式">
            <a-radio-group
              v-model:value="form.openType"
              :disabled="form.menuType === 1"
              @change="onOpenTypeChange">
              <a-radio :value="0">组件</a-radio>
              <a-radio :value="1">内链</a-radio>
              <a-radio :value="2">外链</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin-bottom: 22px;">
        <a-divider/>
      </div>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="菜单图标" name="icon">
            <ele-icon-picker
              v-model:value="form.icon"
              :disabled="form.menuType===1"
              placeholder="请选择菜单图标"/>
          </a-form-item>
          <a-form-item name="path">
            <template #label>
              <a-tooltip
                v-if="form.openType === 1 || form.openType === 2"
                title="需要以`http://`、`https://`、`//`开头,#{appUrl}指服务器的地址,#{token}指令牌">
                <question-circle-outlined
                  style="vertical-align: -2px;margin-right: 4px;"/>
              </a-tooltip>
              <span>{{ form.openType === 0 ?'路由地址': form.openType === 1 ?'内链地址' :'外链地址'   }}</span>
            </template>
            <a-textarea
              allow-clear
              :auto-size="{ minRows: 1 }"
              v-model:value="form.path"
              :placeholder="form.openType === 0 ?'请输入路由地址': form.openType === 1 ?'请输入内链地址' :'请输入外链地址'"/>
          </a-form-item>
          <a-form-item name="component">
            <template #label>
              <span>{{ '组件路径' }}</span>
            </template>
            <a-textarea
              allow-clear
              :auto-size="{ minRows: 1 }"
              v-model:value="form.component"
              :disabled="form.openType === 1 || form.openType === 2"
              :placeholder="'请输入组件路径'"

            />

          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="权限标识" name="authority">
            <a-input
              allow-clear
              placeholder="请输入权限标识"
              v-model:value="form.authority" />
          </a-form-item>
          <a-form-item label="排序号:" name="sortNumber">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"/>
          </a-form-item>
          <a-form-item label="是否可见">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              v-model:checked="form.isShow"
              :disabled="form.menuType === 1"/>
            <a-tooltip title="选择不可见只注册路由不显示在侧边栏，比如添加页面应该选择不可见">
              <question-circle-outlined
                style="vertical-align: -3px;margin-left: 16px;"/>
            </a-tooltip>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import EleIconPicker from 'ele-admin-pro/packages/ele-icon-picker';
import {QuestionCircleOutlined} from '@ant-design/icons-vue';

export default {
  name: 'MenuEdit',
  components: {EleIconPicker, QuestionCircleOutlined},
  emits: [
    'done',
    'update:visible'
  ],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部菜单数据
    menuList: Array
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        title: [
          {required: true, type: 'string', message: '请输入菜单名称', trigger: 'blur'}
        ],
        sortNumber: [
          {required: true, type: 'number', message: '请输入排序号', trigger: 'blur'}
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
      this.isUpdate = !!(this.data && this.data.menuId);
      this.form = this.initFormData(this.data);
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      debugger
      this.$refs.form.validate().then(() => {

        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post']('/sys/menu',
          Object.assign({}, this.form, {
            parentId: this.form.parentId || 0,
            hide: this.form.isShow ? 0 : 1
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
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
    /* menuType选择改变 */
    onMenuTypeChange() {
      if (this.form.menuType === 0) {
        this.form.authority = '';
      } else {
        this.form.openType = 0;
        this.form.icon = '';
        this.form.path = '';
        this.form.component = '';
        this.form.hide = 0;
        this.form.isShow = true;
      }
    },
    /* openType选择改变 */
    onOpenTypeChange() {
      // if (this.form.openType === 2) {
      //   this.form.component = '';
      // }
    },
    /* 初始化form数据 */
    initFormData(data) {

      let form = {
        menuType: 0,
        openType: 0,
        hide: 0,
        isShow: true
      };
      if (data) {
        // let openType = 0;
        // if (this.isUrl(data.path)) {
        //   openType = 2;
        // } else if (this.isUrl(data.component)) {
        //   openType = 1;
        // }
        Object.assign(form, data, {
          parentId: data.parentId === 0 ? null : data.parentId,
          isShow: data.hide === 0,
          openType: data.openType?data.openType:0
        });
      }
      return form;
    },
    /* 判断是否是网址 */
    isUrl(url) {
      return url && (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('://'));
    }
  }
}
</script>

<style scoped>
</style>
