<template>
  <div class="ele-body">
    <a-card
      :bordered="false"
      :body-style="{padding: '0 24px'}">
      <h5 style="padding: 16px 0 24px 0;">卡片列表</h5>
      <div class="ele-text-center">
        <a-input-search
          v-model:value="keyword"
          placeholder="请输入内容"
          enter-button
          style="max-width: 500px;"
          size="large"/>
      </div>
      <a-tabs
        class="list-card-tabs"
        :active-key="active"
        @tabClick="onTabChange">
        <a-tab-pane key="/list/card/project" tab="项目"/>
        <a-tab-pane key="/list/card/application" tab="应用"/>
        <a-tab-pane key="/list/card/article" tab="文章"/>
      </a-tabs>
    </a-card>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'ListCard',
  data() {
    return {
      keyword: ''
    };
  },
  computed: {
    active() {
      return this.$route.path;
    }
  },
  methods: {
    /* 切换tab */
    onTabChange(key) {
      this.$router.push(key);
    }
  }
}
</script>

<style scoped>
.list-card-tabs {
  margin-top: 24px;
}

.list-card-tabs :deep(.ant-tabs-bar) {
  margin-bottom: 0;
  border-bottom-color: transparent;
}

.list-card-tabs :deep(.ant-tabs-tab) {
  padding: 12px 4px;
}
</style>
