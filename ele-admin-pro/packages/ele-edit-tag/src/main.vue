<!-- 标签输入框组件 license by http://eleadmin.com -->
<template>
  <div class="ele-edit-tag">
    <ele-tag
      v-for="(item,index) in data"
      :key="index"
      :closable="true"
      :color="color"
      :size="size"
      @close="onClose(index)">
      {{ item }}
    </ele-tag>
    <a-input
      v-if="edit"
      ref="input"
      v-model:value="value"
      :class="inputClass"
      @blur="onEdit"
      @keyup.enter="onEdit"/>
    <ele-tag
      v-else
      :size="size"
      class="ele-tag-add"
      @click="showEdit">
      <plus-outlined/>
      <span>{{ placeholder }}</span>
    </ele-tag>
  </div>
</template>

<script>
import {PlusOutlined} from '@ant-design/icons-vue';
import EleTag from '../../ele-tag';

export default {
  name: 'EleEditTag',
  components: {
    PlusOutlined,
    EleTag
  },
  emits: ['close', 'update:data'],
  props: {
    // tag数据
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    // 颜色
    color: String,
    // 尺寸
    size: {
      type: String,
      default: 'mini',
      validator: function (value) {
        return ['large', 'middle', 'small', 'mini'].indexOf(value) !== -1;
      }
    },
    // 提示文本
    placeholder: {
      type: String,
      default: 'New Tag'
    },
    // 添加tag是否唯一
    unique: {
      type: Boolean,
      default: true
    },
    // 自定义添加校验
    validator: [Function, Array],
    // 自定义移除校验
    beforeRemove: Function
  },
  data() {
    return {
      // 是否显示输入框
      edit: false,
      // 输入框的值
      value: ''
    };
  },
  computed: {
    /* 输入框class */
    inputClass() {
      return [
        'ele-tag-input',
        {'ele-tag-input-lg': this.size === 'large'},
        {'ele-tag-input-md': this.size === 'middle'},
        {'ele-tag-input-mini': this.size === 'mini'}
      ];
    }
  },
  methods: {
    /* 显示编辑框 */
    showEdit() {
      this.edit = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    /* 新增tag */
    onEdit() {
      if (this.value) {
        // 唯一验证
        if (this.unique && this.data.indexOf(this.value) !== -1) {
          return this.$message.error(this.value + ' 已经存在');
        }
        // 自定义验证
        if (this.validator) {
          if (typeof this.validator === 'function') {
            if (this.validator(this.value) === false) {
              return;
            }
          } else if (!new RegExp(this.validator[0]).test(this.value)) {
            return this.$message.error(this.validator[1]);
          }
        }
        this.$emit('update:data', this.data.concat([this.value]));
      }
      this.edit = false;
      this.value = '';
    },
    /* close事件 */
    onClose(index) {
      this.$emit('close', this.data[index]);
      if (this.beforeRemove && this.beforeRemove(index) === false) {
        return;
      }
      let data = this.data.slice(0, index).concat(this.data.slice(index + 1, this.data.length));
      this.$emit('update:data', data);
    }
  }
}
</script>

<style>
.ele-edit-tag .ele-tag {
  margin-bottom: 8px;
}

/* 添加按钮 */
.ele-edit-tag .ele-tag-add {
  background: none;
  border-style: dashed;
  cursor: text;
}

/* 输入框 */
.ele-edit-tag .ele-tag-input {
  width: 90px;
  height: 26px;
  padding: 0 6px;
  font-size: 12px;
  margin-bottom: 8px;
  vertical-align: top;
  line-height: 1;
}

.ele-edit-tag .ele-tag-input.ele-tag-input-md {
  width: 100px;
  height: 30px;
  padding: 0 8px;
  font-size: 14px;
}

.ele-edit-tag .ele-tag-input.ele-tag-input-lg {
  width: 110px;
  height: 34px;
  padding: 0 10px;
  font-size: 14px;
}

.ele-edit-tag .ele-tag-input.ele-tag-input-mini {
  width: 80px;
  height: 22px;
  font-size: 12px;
  padding: 0 4px;
}

.ele-edit-tag .ele-tag + .ele-tag-input {
  margin-left: 8px;
}
</style>
