<!-- 顶栏右侧区域按钮 -->
<template>
  <div class="ele-admin-header-tool">
    <div class="ele-admin-header-tool-item" @click="toggleFullscreen">
      <fullscreen-exit-outlined v-if="isFullscreen"/>
      <fullscreen-outlined v-else/>
    </div>
    <!-- 语言切换 -->
    <div class="ele-admin-header-tool-item">
      <a-dropdown placement="bottomCenter" :overlay-style="{minWidth: '120px', paddingTop: '17px'}">
        <global-outlined style="transform: scale(1.08);"/>
        <template #overlay>
          <a-menu :selected-keys="languages" @click="changeLanguage">
            <a-menu-item key="en">English</a-menu-item>
            <a-menu-item key="zh_CN">简体中文</a-menu-item>
            <a-menu-item key="zh_TW">繁體中文</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 消息通知 -->
    <div class="ele-admin-header-tool-item">
      <ele-notice/>
    </div>
    <!-- 用户信息 -->
    <div class="ele-admin-header-tool-item">
      <a-dropdown placement="bottomCenter" :overlay-style="{minWidth: '120px'}">
        <div class="ele-admin-header-avatar">
          <a-avatar :src="loginUser.avatar"/>
          <span>{{ loginUser.nickname }}&nbsp;</span>
          <down-outlined/>
        </div>
        <template #overlay>
          <a-menu @click="onUserDropClick">
            <a-menu-item key="user">
              <div class="ele-cell">
                <user-outlined/>
                <div class="ele-cell-content">{{ $t('layout.header.profile') }}</div>
              </div>
            </a-menu-item>
            <a-menu-item key="password">
              <div class="ele-cell">
                <key-outlined/>
                <div class="ele-cell-content">{{ $t('layout.header.password') }}</div>
              </div>
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="logout">
              <div class="ele-cell">
                <logout-outlined/>
                <div class="ele-cell-content">{{ $t('layout.header.logout') }}</div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 主题设置 -->
    <div v-if="showSetting" class="ele-admin-header-tool-item" @click="openSetting">
      <MoreOutlined/>
    </div>
  </div>
</template>

<script>
import {createVNode} from 'vue';
import {
  DownOutlined,
  MoreOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue';
import EleNotice from './notice';

export default {
  name: 'EleHeaderRight',
  components: {
    DownOutlined,
    MoreOutlined,
    UserOutlined,
    KeyOutlined,
    LogoutOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    GlobalOutlined,
    EleNotice
  },
  emits: ['item-click', 'change-language'],
  props: {
    // 是否显示打开设置抽屉按钮
    showSetting: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    // 当前语言
    languages() {
      return [this.$i18n.locale];
    }
  },
  data() {
    return {
      // 是否全屏状态
      isFullscreen: false
    };
  },
  methods: {
    /* 个人信息下拉菜单点击 */
    onUserDropClick({key}) {
      if (key === 'user') {
        this.$router.push('/user/profile');
      } else if (key === 'password') {
        this.$emit('item-click', 'password');
      } else if (key === 'logout') {
        // 退出登录
        this.$confirm({
          title: this.$t('layout.logout.title'),
          content: this.$t('layout.logout.message'),
          icon: createVNode(ExclamationCircleOutlined),
          maskClosable: true,
          onOk: () => {
            let formData = new FormData();
            for (let key in this.form) {
              formData.append(key, this.form[key]);
            }

            // 清除缓存的token
            // debugger
            this.$http.post('/logout').then(() => {
              this.$message.success('成功退出登录');
              location.replace('/login');
              this.$store.dispatch('user/setToken').then(() => {
              });
              // this.$store.dispatch('user/setUser').then(() => {
              // });

              setTimeout(() => {
              }, 2000);
            });

          }
        });
      }
    },
    /* 打开设置抽屉 */
    openSetting() {
      this.$emit('item-click', 'setting');
    },
    /* 全屏切换 */
    toggleFullscreen() {
      try {
        this.isFullscreen = this.$util.toggleFullscreen();
      } catch (e) {
        this.$message.error('您的浏览器不支持全屏模式');
      }
    },
    /* 切换语言 */
    changeLanguage({key}) {
      this.$emit('change-language', key);
    }
  }
}
</script>
