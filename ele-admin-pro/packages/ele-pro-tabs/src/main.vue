<!-- 标签页 license by http://eleadmin.com -->
<template>
  <locale-receiver component-name="ele">
    <template #default="locale">
      <a-tabs
        :hide-add="true"
        :animated="false"
        :active-key="active"
        type="editable-card"
        class="ele-admin-tabs"
        @tabClick="onTabClick"
        @edit="onTabEdit">
        <a-tab-pane key="/" :tab="homeTitle" :closable="false"/>
        <a-tab-pane
          v-for="d in tabs"
          :key="d.key"
          :tab="d.title"
          :closable="d.closable"/>
        <template #tabBarExtraContent>
          <a-dropdown :overlay-style="{paddingRight: '5px', minWidth: '120px'}" placement="bottomRight">
            <div class="ele-admin-tabs-drop">
              <down-outlined/>
            </div>
            <template #overlay>
              <a-menu @click="onDropClick">
                <a-menu-item key="fullscreen">
                  <div v-if="bodyFullscreen" class="ele-cell">
                    <compress-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.fullscreenExit }}</div>
                  </div>
                  <div v-else class="ele-cell">
                    <expand-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.fullscreen }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item key="left">
                  <div class="ele-cell">
                    <arrow-left-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.closeLeft }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item key="right">
                  <div class="ele-cell">
                    <arrow-right-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.closeRight }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item key="other">
                  <div class="ele-cell">
                    <close-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.closeOther }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item key="all">
                  <div class="ele-cell">
                    <close-circle-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.closeAll }}</div>
                  </div>
                </a-menu-item>
                <a-menu-item v-if="showRefresh" key="reload">
                  <div class="ele-cell">
                    <reload-outlined/>
                    <div class="ele-cell-content">{{ locale.tabs.reload }}</div>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tabs>
    </template>
  </locale-receiver>
</template>

<script>
import LocaleReceiver from 'ant-design-vue/es/locale-provider/LocaleReceiver';
import {
  DownOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ExpandOutlined,
  CompressOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'EleProTabs',
  components: {
    LocaleReceiver,
    DownOutlined,
    ReloadOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseOutlined,
    CloseCircleOutlined,
    ExpandOutlined,
    CompressOutlined
  },
  emits: [
    'tab-add',
    'tab-remove',
    'tab-remove-all',
    'tab-remove-left',
    'tab-remove-right',
    'tab-remove-other',
    'reload-page',
    'fullscreen-body'
  ],
  props: {
    // 主页标题
    homeTitle: String,
    // 标签页数据
    tabs: Array,
    // 页签选中
    active: String,
    // 右侧下拉是否显示刷新按钮
    showRefresh: Boolean,
    // 是否再次点击选中tab刷新
    clickReload: Boolean,
    // 内容区域是否全屏
    bodyFullscreen: Boolean
  },
  methods: {
    /* 处理tab点击 */
    onTabClick(key) {
      if (this.active === key) {
        if (this.clickReload) {
          this.reloadPage();
        }
        return;
      }
      let tab;
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].key === key) {
          tab = this.tabs[i];
          break;
        }
      }
      this.$router.push(tab ? tab.fullPath : key);
    },
    /* 处理tab编辑 */
    onTabEdit(key, action) {
      if (action === 'remove') {
        this.$emit('tab-remove', {name: key, active: this.active});
      }
    },
    /* 下拉菜单点击 */
    onDropClick(obj) {
      if (obj.key === 'left') {  // 关闭左侧
        this.$emit('tab-remove-left', this.active);
      } else if (obj.key === 'right') {  // 关闭右侧
        if (this.active === '/') {
          this.removeAllTab();
        } else {
          this.$emit('tab-remove-right', this.active);
        }
      } else if (obj.key === 'other') {  // 关闭其他
        this.$emit('tab-remove-other', this.active);
      } else if (obj.key === 'all') {  // 关闭全部
        this.removeAllTab();
      } else if (obj.key === 'reload') {  // 刷新当前
        this.reloadPage();
      } else if (obj.key === 'fullscreen') {  // 内容全屏
        this.$emit('fullscreen-body', !this.bodyFullscreen);
      }
    },
    /* 关闭全部Tab */
    removeAllTab() {
      this.$emit('tab-remove-all');
    },
    /* 刷新页面 */
    reloadPage() {
      this.$emit('reload-page');
    }
  }
}
</script>
