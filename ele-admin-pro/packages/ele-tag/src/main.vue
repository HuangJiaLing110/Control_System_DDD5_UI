<!-- 标签组件 license by http://eleadmin.com -->
<template>
  <a-tag
    :class="tagClass"
    :closable="closable"
    :color="color"
    :visible="true"
    @close="onClose">
    <slot/>
  </a-tag>
</template>

<script>
export default {
  name: 'EleTag',
  props: {
    closable: Boolean,
    color: String,
    size: {
      type: String,
      default: 'mini',
      validator: function (value) {
        return ['large', 'middle', 'small', 'mini'].indexOf(value) !== -1;
      }
    },
    shape: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['round', 'default', 'circle'].indexOf(value) !== -1;
      }
    }
  },
  emits: ['close'],
  computed: {
    tagClass() {
      return [
        'ele-tag',
        {'ele-tag-round': this.shape === 'round'},
        {'ele-tag-circle': this.shape === 'circle'},
        {'ele-tag-lg': this.size === 'large'},
        {'ele-tag-md': this.size === 'middle'},
        {'ele-tag-mini': this.size === 'mini'}
      ];
    }
  },
  methods: {
    /* close事件 */
    onClose(e) {
      this.$emit('close', e);
    }
  }
}
</script>

<style>
.ele-tag.ant-tag {
  margin: 0;
  height: 24px;
  line-height: 24px;
  box-sizing: content-box;
  padding: 0 8px;
  transition: none;
}

.ele-tag.ant-tag .anticon-close {
  transition: none;
}

.ele-tag + .ele-tag {
  margin-left: 8px;
}

.ele-tag.ant-tag > .anticon + span,
.ele-tag.ant-tag > span + .anticon {
  margin-left: 4px;
}

/* 圆形、圆角 */
.ele-tag.ele-tag-circle {
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  padding: 0 !important;
}

.ele-tag.ele-tag-round {
  border-radius: 24px;
}

/* 中型尺寸 */
.ele-tag.ele-tag-md {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  font-size: 14px;
  vertical-align: top;
}

.ele-tag.ele-tag-md.ele-tag-circle {
  width: 28px;
}

.ele-tag.ele-tag-md.ele-tag-round {
  border-radius: 28px;
}

.ele-tag.ele-tag-md > .anticon + span,
.ele-tag.ele-tag-md > span + .anticon {
  margin-left: 6px;
}

/* 大型尺寸 */
.ele-tag.ele-tag-lg {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  font-size: 15px;
}

.ele-tag.ele-tag-lg.ele-tag-circle {
  width: 32px;
}

.ele-tag.ele-tag-lg.ele-tag-round {
  border-radius: 32px;
}

.ele-tag.ele-tag-lg > .anticon + span,
.ele-tag.ele-tag-lg > span + .anticon {
  margin-left: 8px;
}

/* 超小尺寸 */
.ele-tag.ele-tag-mini {
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
}

.ele-tag.ele-tag-mini.ele-tag-circle {
  width: 20px;
}

.ele-tag.ele-tag-mini.ele-tag-round {
  border-radius: 20px;
}

.ele-tag.ele-tag-mini > .anticon + span,
.ele-tag.ele-tag-mini > span + .anticon {
  margin-left: 2px;
}
</style>
