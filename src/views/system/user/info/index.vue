<template>
  <div class="ele-body">
    <a-card title="基本信息" :bordered="false">
      <a-form
        class="ele-form-detail"
        :label-col="{md: {span: 2}, sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{md: {span: 22}, sm: {span: 20}, xs: {span: 18}}">
        <a-form-item label="账号">
          <div class="ele-text-secondary">{{ user.username }}</div>
        </a-form-item>
        <a-form-item label="用户名">
          <div class="ele-text-secondary">{{ user.nickname }}</div>
        </a-form-item>
        <a-form-item label="性别">
          <div class="ele-text-secondary">{{ user.sexName }}</div>
        </a-form-item>
        <a-form-item label="手机号">
          <div class="ele-text-secondary">{{ user.phone }}</div>
        </a-form-item>
        <a-form-item label="角色">
          <a-tag v-for="item in user.roles" :key="item.roleId" color="blue">
            {{ item.roleName }}
          </a-tag>
        </a-form-item>
        <a-form-item label="创建时间">
          <div class="ele-text-secondary">{{ $util.toDateString(user.createTime) }}</div>
        </a-form-item>
        <a-form-item label="状态">
          <a-badge
            :status="['processing', 'error'][user.state]"
            :text="['正常', '冻结'][user.state]"/>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'SystemUserInfo',
  data() {
    return {
      user: {},
      loading: true
    };
  },
  mounted() {
    this.query(this.$route.query.id);
  },
  methods: {
    /* 查询用户信息 */
    query(id) {
      if (!id) {
        return;
      }
      this.loading = true;
      this.$http.get('/sys/user/' + id).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          this.user = res.data.data;
          // 修改页签标题
          this.$store.dispatch('user/tabSetTitle', {
            fullPath: this.$route.fullPath,
            title: this.user.nickname + '的信息'
          });
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((e) => {
        this.loading = false;
        this.$message.error(e.message);
      });
    }
  },
  watch: {
    $route() {
      this.query(this.$route.query.id);
    }
  }
}
</script>

<style scoped>
</style>
