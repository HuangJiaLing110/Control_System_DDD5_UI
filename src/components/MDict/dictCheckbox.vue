
<template>

  <a-checkbox-group @change="onChange">
    <a-checkbox  v-for="item in dictData"
                 :key="item.dictName"
                 :value="item.dictName">{{ item.dictName }}
    </a-checkbox>
  </a-checkbox-group>

</template>

<script>
  import mtUtil from "@/utils/mtUtil";

  export default {
    name: "MDictCheckbox",
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
    },
    methods: {}
  }
</script>

<style scoped>

</style>
