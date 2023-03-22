<!-- 主题设置抽屉 license by http://eleadmin.com -->
<template>
  <locale-receiver component-name="ele">
    <template #default="locale">
      <a-drawer
        :width="280"
        :visible="visible"
        :body-style="{padding: 0}"
        @update:visible="updateVisible">
        <div :class="['ele-setting-wrapper', {'ele-setting-dark': darkMode}]">
          <!-- 侧栏风格设置 -->
          <div class="ele-setting-title">{{ locale.setting.title }}</div>
          <div class="ele-setting-theme ele-text-primary">
            <a-tooltip :title="locale.setting.sideStyles.dark">
              <div class="ele-bg-base ele-side-dark" @click="setSideStyle(1)">
                <check-outlined v-if="sideStyle === 1"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="locale.setting.sideStyles.light">
              <div class="ele-bg-base" @click="setSideStyle(0)">
                <check-outlined v-if="sideStyle === 0"/>
              </div>
            </a-tooltip>
          </div>
          <!-- 顶栏风格设置 -->
          <div class="ele-setting-theme ele-text-primary">
            <a-tooltip :title="locale.setting.headStyles.light">
              <div class="ele-bg-base ele-head-light" @click="setHeadStyle(0)">
                <check-outlined v-if="headStyle === 0"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="locale.setting.headStyles.dark">
              <div class="ele-bg-base ele-head-dark" @click="setHeadStyle(1)">
                <check-outlined v-if="headStyle === 1"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="locale.setting.headStyles.primary">
              <div class="ele-bg-base ele-head-primary" @click="setHeadStyle(2)">
                <div class="ele-bg-primary"></div>
                <check-outlined v-if="headStyle === 2"/>
              </div>
            </a-tooltip>
          </div>
          <!-- 主题颜色设置 -->
          <template v-if="(typeof themes !== 'undefined') && (themes !== null)">
            <div v-if="themes.length" class="ele-setting-colors">
              <a-tooltip v-for="(d, i) in themes" :key="i" :title="d.name">
                <div
                  class="ele-setting-color-item"
                  :style="{'background-color': d.color}"
                  @click="setColor(d.value)">
                  <check-outlined v-if="color === d.value"/>
                </div>
              </a-tooltip>
            </div>
            <div v-else class="ele-setting-colors">
              <a-tooltip :title="locale.setting.colors.default">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #1890ff;"
                  @click="setColor(null)">
                  <check-outlined v-if="!color"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.dust">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #5f80c7;"
                  @click="setColor('dust')">
                  <check-outlined v-if="color === 'dust'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.sunset">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #faad14;"
                  @click="setColor('sunset')">
                  <check-outlined v-if="color === 'sunset'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.volcano">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #f5686f;"
                  @click="setColor('volcano')">
                  <check-outlined v-if="color === 'volcano'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.purple">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #9266f9;"
                  @click="setColor('purple')">
                  <check-outlined v-if="color === 'purple'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.cyan">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #2bccce;"
                  @click="setColor('cyan')">
                  <check-outlined v-if="color === 'cyan'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.green">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #33cc99;"
                  @click="setColor('green')">
                  <check-outlined v-if="color === 'green'"/>
                </div>
              </a-tooltip>
              <a-tooltip :title="locale.setting.colors.geekblue">
                <div
                  class="ele-setting-color-item"
                  style="background-color: #32a2d4;"
                  @click="setColor('geekblue')">
                  <check-outlined v-if="color === 'geekblue'"/>
                </div>
              </a-tooltip>
            </div>
          </template>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.darkMode }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="darkMode" @change="setDarkMode"/>
            </div>
          </div>
          <a-divider/>
          <!-- 导航模式设置 -->
          <div class="ele-setting-title ele-text-secondary">{{ locale.setting.layoutStyle }}</div>
          <div class="ele-setting-theme ele-text-primary">
            <a-tooltip :title="locale.setting.layoutStyles.side">
              <div class="ele-bg-base ele-side-dark" @click="setLayoutStyle(0)">
                <CheckOutlined v-if="layoutStyle === 0"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="locale.setting.layoutStyles.top">
              <div class="ele-bg-base ele-head-dark" @click="setLayoutStyle(1)">
                <CheckOutlined v-if="layoutStyle === 1"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="locale.setting.layoutStyles.mix">
              <div class="ele-bg-base ele-layout-mix" @click="setLayoutStyle(2)">
                <CheckOutlined v-if="layoutStyle === 2"/>
              </div>
            </a-tooltip>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.sideMenuStyle }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="sideMenuStyle === 'mix'" @change="setSideMenuStyle"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.bodyFull }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="bodyFull" @change="setBodyFull"/>
            </div>
          </div>
          <!-- 其它配置 -->
          <a-divider/>
          <div class="ele-setting-title ele-text-secondary">{{ locale.setting.other }}</div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.fixedHeader }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="fixedHeader" @change="setFixedHeader"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.fixedSidebar }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="fixedSidebar" @change="setFixedSidebar"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.fixedBody }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="fixedBody" @change="setFixedBody"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.logoAutoSize }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="logoAutoSize" @change="setLogoAutoSize"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.colorfulIcon }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="colorfulIcon" @change="setColorfulIcon"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.sideUniqueOpen }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="sideUniqueOpen" @change="setSideUniqueOpen"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.weakMode }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="weakMode" @change="setWeakMode"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.showFooter }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="showFooter" @change="setShowFooter"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.showTabs }}</div>
            <div class="setting-item-control">
              <a-switch size="small" :checked="showTabs" @change="setShowTabs"/>
            </div>
          </div>
          <div class="ele-setting-item">
            <div class="setting-item-title">{{ locale.setting.tabStyle }}</div>
            <div class="setting-item-control">
              <a-select size="small" :value="tabStyle" style="width: 95px;" @change="setTabStyle">
                <a-select-option :value="0">
                  {{ locale.setting.tabStyles.default }}
                </a-select-option>
                <a-select-option :value="1">
                  {{ locale.setting.tabStyles.dot }}
                </a-select-option>
                <a-select-option :value="2">
                  {{ locale.setting.tabStyles.card }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <template v-if="(typeof tips !== 'undefined') && (tips !== null)">
            <a-divider/>
            <a-alert show-icon type="warning" :message="tips || locale.setting.tips">
              <template #icon>
                <sound-outlined/>
              </template>
            </a-alert>
          </template>
        </div>
      </a-drawer>
    </template>
  </locale-receiver>
</template>

<script>
import LocaleReceiver from 'ant-design-vue/es/locale-provider/LocaleReceiver';
import {CheckOutlined, SoundOutlined} from '@ant-design/icons-vue';

export default {
  name: 'EleProSetting',
  components: {LocaleReceiver, CheckOutlined, SoundOutlined},
  emits: ['change-color', 'change-style', 'update:visible'],
  props: {
    // 是否显示, 支持 v-model 绑定
    visible: Boolean,
    // 顶栏风格
    headStyle: Number,
    // 侧边栏风格
    sideStyle: Number,
    // 布局风格
    layoutStyle: Number,
    // 侧栏边菜单风格
    sideMenuStyle: String,
    // 内容区域宽度是否铺满
    bodyFull: Boolean,
    // 是否固定顶栏
    fixedHeader: Boolean,
    // 是否固定侧栏
    fixedSidebar: Boolean,
    // 是否固定主体
    fixedBody: Boolean,
    // logo是否自适应宽度
    logoAutoSize: Boolean,
    // 侧栏是否多彩图标
    colorfulIcon: Boolean,
    // 侧边栏是否只保持一个子菜单展开
    sideUniqueOpen: Boolean,
    // 是否开启页脚
    showFooter: Boolean,
    // 是否色弱模式
    weakMode: Boolean,
    // 是否开启多标签
    showTabs: Boolean,
    // 标签页风格
    tabStyle: Number,
    // 是否暗黑模式
    darkMode: Boolean,
    // 当前主题色
    color: String,
    // 主题列表
    themes: Array,
    // 提示文字
    tips: String
  },
  methods: {
    /* 修改visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 切换主题色 */
    setColor(color, force) {
      if (force || color !== this.color) {
        this.$emit('change-color', color);
      }
    },
    /* 修改主题风格 */
    setStyle(key, value) {
      this.$emit('change-style', {key: key, value: value});
    },
    setHeadStyle(value) {
      this.setStyle('headStyle', value);
    },
    setSideStyle(value) {
      this.setStyle('sideStyle', value);
    },
    setLayoutStyle(value) {
      this.setStyle('layoutStyle', value);
    },
    setSideMenuStyle(value) {
      this.setStyle('sideMenuStyle', value ? 'mix' : 'default');
    },
    setBodyFull(value) {
      this.setStyle('bodyFull', value);
    },
    setFixedHeader(value) {
      this.setStyle('fixedHeader', value);
    },
    setFixedSidebar(value) {
      this.setStyle('fixedSidebar', value);
    },
    setFixedBody(value) {
      this.setStyle('fixedBody', value);
      if (value) {
        document.body.style.width = null;
      }
    },
    setLogoAutoSize(value) {
      this.setStyle('logoAutoSize', value);
    },
    setColorfulIcon(value) {
      this.setStyle('colorfulIcon', value);
    },
    setSideUniqueOpen(value) {
      this.setStyle('sideUniqueOpen', value);
    },
    setWeakMode(value) {
      this.setStyle('weakMode', value);
    },
    setDarkMode(value) {
      this.setStyle('darkMode', value);
      this.setColor(this.color, true);
    },
    setShowFooter(value) {
      this.setStyle('showFooter', value);
      if (!value) {
        document.body.style.width = null;
      }
    },
    setShowTabs(value) {
      this.setStyle('showTabs', value);
    },
    setTabStyle(value) {
      this.setStyle('tabStyle', value);
    }
  }
}
</script>

<style>
.ele-setting-wrapper {
  padding: 20px 18px;
}

.ele-setting-wrapper .ele-setting-title {
  font-size: 13px;
  margin-bottom: 15px;
}

/* 主题风格 */
.ele-setting-wrapper .ele-setting-theme > div {
  width: 52px;
  height: 36px;
  line-height: 1;
  border-radius: 3px;
  margin: 0 20px 30px 0;
  padding: 16px 0 0 26px;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .15);
  display: inline-block;
  vertical-align: top;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: background-color .6s;
}

.ele-setting-wrapper .ele-setting-theme > div:before,
.ele-setting-wrapper .ele-setting-theme > div:after,
.ele-setting-wrapper .ele-setting-theme > div > .ele-bg-primary {
  content: "";
  width: 100%;
  height: 10px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  transition: background-color .6s;
}

.ele-setting-dark .ele-setting-theme > div:before,
.ele-setting-dark .ele-setting-theme > div:after,
.ele-setting-dark .ele-setting-theme > div > .ele-bg-primary {
  background: #141414;
}

.ele-setting-wrapper .ele-setting-theme > div:after {
  width: 14px;
  height: 100%;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-side-dark:after,
.ele-setting-wrapper .ele-setting-theme > div.ele-head-dark:before,
.ele-setting-wrapper .ele-setting-theme > div.ele-layout-mix:before,
.ele-setting-wrapper .ele-setting-theme > div.ele-layout-mix:after {
  background: #001529;
}

.ele-setting-dark .ele-setting-theme > div.ele-side-dark:after,
.ele-setting-dark .ele-setting-theme > div.ele-head-dark:before,
.ele-setting-dark .ele-setting-theme > div.ele-layout-mix:before,
.ele-setting-dark .ele-setting-theme > div.ele-layout-mix:after {
  background: #1f1f1f;
}

.ele-setting-wrapper .ele-setting-theme > div.ele-head-light:before,
.ele-setting-wrapper .ele-setting-theme > div.ele-head-dark:before,
.ele-setting-wrapper .ele-setting-theme > div > .ele-bg-primary {
  z-index: 1;
}

/* 主题色选择 */
.ele-setting-wrapper .ele-setting-colors {
  color: #fff;
  margin-bottom: 20px;
}

.ele-setting-wrapper .ele-setting-color-item {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 2px;
  margin: 8px 8px 0 0;
  display: inline-block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .15);
  vertical-align: top;
  text-align: center;
  cursor: pointer;
}

/* 主题配置项 */
.ele-setting-wrapper .ele-setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.ele-setting-wrapper .ele-setting-item .setting-item-title {
  flex: 1;
  line-height: 28px;
}

.ele-setting-wrapper .ele-setting-item .setting-item-control {
  line-height: 1;
}

.ele-setting-wrapper .ant-divider {
  margin-bottom: 20px;
}
</style>
