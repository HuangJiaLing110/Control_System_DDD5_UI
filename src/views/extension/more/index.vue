<template>
  <div class="ele-body ele-body-card">
    <more-tag/>
    <more-city-select/>
    <more-cropper/>
    <more-count-up/>
  </div>
</template>

<script>
import MoreTag from './more-tag';
import MoreCitySelect from './more-city-select';
import MoreCropper from './more-cropper';
import MoreCountUp from './more-count-up';

export default {
  name: 'ExtensionMore',
  components: {
    MoreTag,
    MoreCitySelect,
    MoreCropper,
    MoreCountUp
  }
}
</script>

<style scoped>
</style>
