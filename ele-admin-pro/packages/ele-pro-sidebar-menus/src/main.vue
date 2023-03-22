<!-- 侧边栏菜单item2 license by http://eleadmin.com -->
<template>
  <a-menu
    mode="inline"
    :theme="theme"
    :open-keys="openKeys"
    :inline-indent="inlineIndent"
    :selected-keys="selectedKeys"
    :inline-collapsed="inlineCollapsed"
    @openChange="onOpenChange">
    <template v-for="m1 in menus">
      <template v-if="!m1.meta.hide">
        <a-sub-menu v-if="haveChildren(m1)" :key="m1.path">
          <template #title>
            <component v-if="m1.meta.icon" :is="m1.meta.icon"/>
            <span>{{ m1.meta.title }}</span>
          </template>
          <template v-for="m2 in m1.children">
            <template v-if="!m2.meta.hide">
              <a-sub-menu v-if="haveChildren(m2)" :key="m2.path">
                <template #title>
                  <component v-if="m2.meta.icon" :is="m2.meta.icon"/>
                  <span>{{ m2.meta.title }}</span>
                </template>
                <template v-for="m3 in m2.children">
                  <template v-if="!m3.meta.hide">
                    <a-sub-menu v-if="haveChildren(m3)" :key="m3.path">
                      <template #title>
                        <component v-if="m3.meta.icon" :is="m3.meta.icon"/>
                        <span>{{ m3.meta.title }}</span>
                      </template>
                      <template v-for="m4 in m3.children">
                        <template v-if="!m4.meta.hide">
                          <a-sub-menu v-if="haveChildren(m4)" :key="m4.path">
                            <template #title>
                              <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                              <span>{{ m4.meta.title }}</span>
                            </template>
                            <template v-for="m5 in m4.children">
                              <template v-if="!m5.meta.hide">
                                <a-sub-menu v-if="haveChildren(m5)" :key="m5.path">
                                  <template #title>
                                    <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                    <span>{{ m5.meta.title }}</span>
                                  </template>
                                  <template v-for="m6 in m5.children">
                                    <template v-if="!m6.meta.hide">
                                      <a-sub-menu v-if="haveChildren(m6)" :key="m6.path">
                                        <template #title>
                                          <component v-if="m6.meta.icon" :is="m6.meta.icon"/>
                                          <span>{{ m6.meta.title }}</span>
                                        </template>
                                        <template v-for="m7 in m6.children">
                                          <template v-if="!m7.meta.hide">
                                            <a-sub-menu v-if="haveChildren(m7)" :key="m7.path">
                                              <template #title>
                                                <component v-if="m7.meta.icon" :is="m7.meta.icon"/>
                                                <span>{{ m7.meta.title }}</span>
                                              </template>
                                              <template v-for="m8 in m7.children">
                                                <a-menu-item v-if="!m8.meta.hide" :key="m8.path">
                                                  <a v-if="isUrl(m8)" :href="m8.path" @click.prevent="open(m8)"
                                                     target="_blank">
                                                    <component v-if="m8.meta.icon" :is="m8.meta.icon"/>
                                                    <span>{{ m8.meta.title }}</span>
                                                  </a>
                                                  <router-link v-else :to="m8.path">
                                                    <component v-if="m8.meta.icon" :is="m8.meta.icon"/>
                                                    <span>{{ m8.meta.title }}</span>
                                                  </router-link>
                                                </a-menu-item>
                                              </template>
                                            </a-sub-menu>
                                            <a-menu-item v-else :key="m7.path">
                                              <a v-if="isUrl(m7)" :href="m7.path" @click.prevent="open(m7)"  target="_blank">
                                                <component v-if="m7.meta.icon" :is="m7.meta.icon"/>
                                                <span>{{ m7.meta.title }}</span>
                                              </a>
                                              <router-link v-else :to="m7.path">
                                                <component v-if="m7.meta.icon" :is="m7.meta.icon"/>
                                                <span>{{ m7.meta.title }}</span>
                                              </router-link>
                                            </a-menu-item>
                                          </template>
                                        </template>
                                      </a-sub-menu>
                                      <a-menu-item v-else :key="m6.path">
                                        <a v-if="isUrl(m6)" :href="m6.path" @click.prevent="open(m6)"  target="_blank">
                                          <component v-if="m6.meta.icon" :is="m6.meta.icon"/>
                                          <span>{{ m6.meta.title }}</span>
                                        </a>
                                        <router-link v-else :to="m6.path">
                                          <component v-if="m6.meta.icon" :is="m6.meta.icon"/>
                                          <span>{{ m6.meta.title }}</span>
                                        </router-link>
                                      </a-menu-item>
                                    </template>
                                  </template>
                                </a-sub-menu>
                                <a-menu-item v-else :key="m5.path">
                                  <a v-if="isUrl(m5)" :href="m5.path" @click.prevent="open(m5)"  target="_blank">
                                    <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                    <span>{{ m5.meta.title }}</span>
                                  </a>
                                  <router-link v-else :to="m5.path">
                                    <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                    <span>{{ m5.meta.title }}</span>
                                  </router-link>
                                </a-menu-item>
                              </template>
                            </template>
                          </a-sub-menu>
                          <a-menu-item v-else :key="m4.path">
                            <a v-if="isUrl(m4)" :href="m4.path" @click.prevent="open(m4)"  target="_blank">
                              <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                              <span>{{ m4.meta.title }}</span>
                            </a>
                            <router-link v-else :to="m4.path">
                              <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                              <span>{{ m4.meta.title }}</span>
                            </router-link>
                          </a-menu-item>
                        </template>
                      </template>
                    </a-sub-menu>
                    <a-menu-item v-else :key="m3.path">
                      <a v-if="isUrl(m3)" :href="m3.path"  @click.prevent="open(m3)"  target="_blank">
                        <component v-if="m3.meta.icon" :is="m3.meta.icon"/>
                        <span>{{ m3.meta.title }}</span>
                      </a>
                      <router-link v-else :to="m3.path">
                        <component v-if="m3.meta.icon" :is="m3.meta.icon"/>
                        <span>{{ m3.meta.title }}</span>
                      </router-link>
                    </a-menu-item>
                  </template>
                </template>
              </a-sub-menu>
              <a-menu-item v-else :key="m2.path">
                <a v-if="isUrl(m2)" :href="m2.path" @click.prevent="open(m2)"  target="_blank">
                  <component v-if="m2.meta.icon" :is="m2.meta.icon"/>
                  <span>{{ m2.meta.title }}</span>
                </a>
                <router-link v-else :to="m2.path">
                  <component v-if="m2.meta.icon" :is="m2.meta.icon"/>
                  <span>{{ m2.meta.title }}</span>
                </router-link>
              </a-menu-item>
            </template>
          </template>
        </a-sub-menu>
        <a-menu-item v-else :key="m1.path">
          <a v-if="isUrl(m1)" :href="m1.path"  @click.prevent="open(m1)" target="_blank">
            <component v-if="m1.meta.icon" :is="m1.meta.icon"/>
            <span>{{ m1.meta.title }}</span>
          </a>
          <router-link v-else :to="m1.path">
            <component v-if="m1.meta.icon" :is="m1.meta.icon"/>
            <span>{{ m1.meta.title }}</span>
          </router-link>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>

<script>
  import * as antIcons from '@ant-design/icons-vue';
  // import util from '../../util.js';

  export default {
    name: 'EleProSidebarMenus',
    components: {...antIcons},
    emits: ['openChange'],
    props: {
      inlineIndent: Number,
      inlineCollapsed: Boolean,
      theme: String,
      selectedKeys: Array,
      openKeys: Array,
      menus: Array
    },
    methods: {
      onOpenChange(e) {
        this.$emit('openChange', e);
      },
      /* 是否有子级 */
      haveChildren(item) {
        return !!(item.children && item.children.filter(d => !d.meta.hide).length);
      },
      /* 是否是网址 */
      isUrl(item) {
        return item.openType == 2;
      },
      open(item)
      {
        if(item.openUrl)
        {
          item.openUrl(item)
        }
      }


    }
  }
</script>
