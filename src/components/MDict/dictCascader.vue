<template>
  <a-cascader
    :field-names="{ label: 'dictName', value: 'dictName' ,children:'children'}"
    :options="dictData"
    :show-search="{ filter }"
    :placeholder="placeholder"
    @change="onChange"
  />

</template>

<script>
import pinyinMatch from 'pinyin-match'
import mtUtil from '@/utils/mtUtil'

export default {
  name: "MDictCascader",
  props: {
    dict: String,
  },
  data() {
    return {
      dictData: [],
      placeholder: '请选择' + this.dict,
      //需要回传父组件的选中的值
      dictValue: "",
    }
  },
  methods: {
    //获取改变的value
    onChange(value, selectedOptions) {
      // debugger
      for (let key in selectedOptions) {
        if (key < selectedOptions.length - 1) {
          this.dictValue += selectedOptions[key].dictName + "/"
        } else {
          this.dictValue += selectedOptions[key].dictName
        }
      }
      //传回父组件
      this.$emit('change', this.dictValue)
      this.dictValue = ""
    },
    //搜索过滤
    filter(inputValue, path) {
      return path.some(option => pinyinMatch.match(option.dictName.toLowerCase(), inputValue.toLowerCase()) != false);
    },
  },

  mounted() {
    this.dictData = mtUtil.getDict(this.dict);
  },
}
</script>

<style scoped>

</style>
