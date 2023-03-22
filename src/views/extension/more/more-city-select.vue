<template>
  <a-card title="省市区级联选择" :bordered="false">
    <a-space>
      <a-cascader
        v-model:value="city"
        :options="cityData.cityData"
        placeholder="请选择省市区"
        popup-class-name="ele-pop-wrap-higher"/>
      <a-cascader
        v-model:value="provinceCity"
        :options="cityData.provinceCityData"
        placeholder="请选择省市"
        popup-class-name="ele-pop-wrap-higher"/>
      <a-cascader
        v-model:value="province"
        :options="cityData.provinceData"
        placeholder="请选择省"
        popup-class-name="ele-pop-wrap-higher"/>
    </a-space>
  </a-card>
</template>

<script>
import regions from 'ele-admin-pro/packages/regions.js';

export default {
  name: 'MoreCitySelect',
  data() {
    return {
      // 省市区数据
      cityData: regions,
      // 选中的省市区
      city: [],
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
    };
  }
}
</script>

<style scoped>
</style>
