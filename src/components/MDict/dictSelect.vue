<template>
  <!--      :getPopupContainer="triggerNode => triggerNode.parentNode"-->
  <a-select
    allow-clear>
    <a-select-option
      v-for="item in dictData"
      :key="item.dictName"
      :value="item.dictName">{{ item.dictName }}
    </a-select-option>
  </a-select>

</template>

<script>
import mtUtil from "@/utils/mtUtil";

export default {
  name: "MDictSelect",
  props: {
    dict: String
  },
  data() {
    return {
      placeholder: '请选择' + this.dict,
      dictData: []
    }
  },
  mounted() {
    this.dictData = mtUtil.getDict(this.dict);
    let regex = /^lis_/;
    this.dictData.forEach(function (item) {
      if (regex.test(item.dictName)) {
        item.dictName = item.dictName.slice(4);
      }
    })
  },

}
</script>

<style scoped>

</style>
