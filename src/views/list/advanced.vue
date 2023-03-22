<template>
  <div class="ele-body ele-body-card">
    <a-card :bordered="false">
      <a-row>
        <a-col :md="8" :sm="24" :xs="24">
          <div class="ele-text-center">
            <div style="margin-bottom: 8px;">进行中的任务</div>
            <h2>10 个任务</h2>
          </div>
        </a-col>
        <a-col :md="8" :sm="24" :xs="24">
          <div class="ele-text-center">
            <div style="margin-bottom: 8px;">剩余任务</div>
            <h2>3 个任务</h2>
          </div>
        </a-col>
        <a-col :md="8" :sm="24" :xs="24">
          <div class="ele-text-center">
            <div style="margin-bottom: 8px;">任务总耗时</div>
            <h2>120 个小时</h2>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false">
      <!-- 头部工具栏 -->
      <div class="ele-table-tool">
        <h6 class="ele-table-tool-title">复杂列表</h6>
        <a-space size="middle">
          <a-radio-group
            v-model:value="search.state"
            @change="query">
            <a-radio-button value="0">全部</a-radio-button>
            <a-radio-button value="1">进行中</a-radio-button>
            <a-radio-button value="2">已完成</a-radio-button>
          </a-radio-group>
          <a-input-search
            v-model:value="search.keyword"
            placeholder="请输入"
            style="width: 200px"
            @search="query">
            <template #enterButton>
              <a-button>
                <template #icon>
                  <search-outlined/>
                </template>
              </a-button>
            </template>
          </a-input-search>
        </a-space>
      </div>
      <a-button
        block
        type="dashed"
        @click="openEdit()">
        <template #icon>
          <plus-outlined/>
        </template>
        <span>添加</span>
      </a-button>
      <!-- 数据列表 -->
      <a-spin :spinning="loading">
        <div v-for="(item,index) in data" :key="index">
          <div class="basic-list-item">
            <div class="ele-cell">
              <a-avatar
                shape="square"
                :size="60"
                :src="item.cover"/>
              <div class="ele-cell-content">
                <div class="ele-cell-title">{{ item.title }}</div>
                <div class="ele-cell-desc">{{ item.content }}</div>
              </div>
            </div>
            <div class="basic-list-item-owner">
              <div>发布人</div>
              <div class="ele-text-secondary">{{ item.user }}</div>
            </div>
            <div class="basic-list-item-time">
              <div>开始时间</div>
              <div class="ele-text-secondary">{{ item.time }}</div>
            </div>
            <div class="basic-list-item-progress">
              <a-progress
                :percent="item.progress"
                :status="item.status"/>
            </div>
            <div class="basic-list-item-tool">
              <a-space>
                <a @click="openEdit(item)">编辑</a>
                <a-divider type="vertical"/>
                <a-dropdown>
                  <a>
                    <span>更多<down-outlined class="ele-text-small"/></span>
                  </a>
                  <template #overlay>
                    <a-menu @click="(obj) => dropClick(obj.key, item)">
                      <a-menu-item key="share">分享</a-menu-item>
                      <a-menu-item key="remove">删除</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </div>
          </div>
          <a-divider/>
        </div>
        <div class="ele-text-center" style="margin-top: 18px;">
          <a-pagination
            v-model:current="page.page"
            :total="count"
            show-quick-jumper
            @change="query"/>
        </div>
      </a-spin>
    </a-card>
    <!-- 编辑弹窗 -->
    <a-modal
      :width="460"
      v-model:visible="showEdit"
      :confirm-loading="editLoading"
      :title="form.id?'任务编辑':'任务添加'"
      :body-style="{paddingBottom: '8px'}"
      @ok="save">
      <a-form
        ref="editForm"
        :model="form"
        :rules="rules"
        :label-col="{md: {span: 5}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
        <a-form-item label="任务名称:" name="title">
          <a-input
            v-model:value="form.title"
            placeholder="请输入任务名称"
            allow-clear/>
        </a-form-item>
        <a-form-item label="开始时间:" name="time">
          <a-date-picker
            v-model:value="form.time"
            placeholder="请选择开始时间"
            show-time
            value-format="YYYY-MM-DD hh:mm:ss"
            class="ele-fluid"/>
        </a-form-item>
        <a-form-item label="负责人:" name="user">
          <a-select
            v-model:value="form.user"
            placeholder="请选择负责人"
            allow-clear>
            <a-select-option value="SunSmile">SunSmile</a-select-option>
            <a-select-option value="Pojin">Pojin</a-select-option>
            <a-select-option value="SuperWill">SuperWill</a-select-option>
            <a-select-option value="Jasmine">Jasmine</a-select-option>
            <a-select-option value="Vast">Vast</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务描述:">
          <a-textarea
            v-model:value="form.content"
            placeholder="请输入任务描述"
            :rows="4"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {createVNode} from 'vue';
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'ListAdvanced',
  components: {
    SearchOutlined,
    PlusOutlined,
    DownOutlined
  },
  data() {
    return {
      // 列表加载状态
      loading: false,
      // 列表数据
      data: [
        {
          id: 1,
          title: 'ElementUI',
          time: '2020-06-13 08:33',
          user: 'SunSmile',
          progress: 87,
          content: 'Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的组件库，提供了配套设计资源，帮助你的网站快速成型。',
          cover: 'https://cdn.eleadmin.com/20200609/c184eef391ae48dba87e3057e70238fb.jpg'
        },
        {
          id: 2,
          title: 'Vue.js',
          time: '2020-06-13 06:40',
          user: 'Pojin',
          progress: 100,
          content: 'Vue 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。',
          cover: 'https://cdn.eleadmin.com/20200609/b6a811873e704db49db994053a5019b2.jpg'
        },
        {
          id: 3,
          title: 'Vuex',
          time: '2020-06-13 04:40',
          user: 'SuperWill',
          progress: 75,
          content: 'Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。',
          cover: 'https://cdn.eleadmin.com/20200609/948344a2a77c47a7a7b332fe12ff749a.jpg'
        },
        {
          id: 4,
          title: 'Vue Router',
          time: '2020-06-13 02:40',
          user: 'Jasmine',
          progress: 65,
          content: 'Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。',
          cover: 'https://cdn.eleadmin.com/20200609/f6bc05af944a4f738b54128717952107.jpg'
        },
        {
          id: 5,
          title: 'Sass',
          time: '2020-06-13 00:40',
          user: 'Vast',
          progress: 45,
          status: 'exception',
          content: 'Sass 是世界上最成熟、稳定、强大的专业级 CSS 扩展语言。',
          cover: 'https://cdn.eleadmin.com/20200609/2d98970a51b34b6b859339c96b240dcd.jpg'
        }
      ],
      // 搜索表单
      search: {
        state: '0',
        keyword: ''
      },
      // 分页参数
      page: {
        page: 1,
        limit: 5
      },
      // 数据总数
      count: 100,
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑弹窗数据
      form: {},
      // 编辑弹窗表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入任务名称', type: 'string', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '请选择开始时间', type: 'string', trigger: 'blur'}
        ],
        user: [
          {required: true, message: '请选择负责人', type: 'string', trigger: 'blur'}
        ]
      },
      // 编辑表单提交状态
      editLoading: false
    };
  },
  methods: {
    /* 查询数据 */
    query() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    /* 显示编辑弹窗 */
    openEdit(row) {
      if (row) {
        this.form = Object.assign({}, row);
      } else {
        this.form = {};
      }
      this.showEdit = true;
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    /* 保存编辑 */
    save() {
      this.$refs.editForm.validate().then(() => {
        this.editLoading = true;
        setTimeout(() => {
          this.editLoading = false;
          this.showEdit = false;
          this.$message.success('保存成功');
          if (this.form.id) {  // 保存修改
            Object.assign(this.data.filter(d => d.id === this.form.id)[0], this.form);
          } else {  // 保存添加
            this.data.push(Object.assign({
              id: new Date().getTime(),
              cover: 'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg'
            }, this.form));
          }
        }, 300);
      }).catch(() => {
      });
    },
    /* 下拉菜单点击事件 */
    dropClick(command, item) {
      console.log(item);
      if (command === 'remove') {  // 删除
        this.$confirm({
          title: '提示',
          content: '确定删除该任务吗?',
          icon: createVNode(ExclamationCircleOutlined),
          maskClosable: true,
          onOk: () => {
            this.$message.success('删除成功');
          }
        });
      } else if (command === 'share') {
        this.$message.success('点击了分享');
      }
    }
  }
}
</script>

<style scoped>
/** 列表样式 */
.basic-list-item {
  display: flex;
  align-items: center;
  padding: 16px 8px;
}

.basic-list-item .ele-cell {
  flex: 1;
}

.basic-list-item .basic-list-item-owner {
  width: 80px;
  padding: 0 16px;
  flex-shrink: 0;
}

.basic-list-item .basic-list-item-time {
  width: 160px;
  padding: 0 16px;
  flex-shrink: 0;
}

.basic-list-item .ele-text-secondary {
  margin-top: 8px;
}

.basic-list-item .basic-list-item-progress {
  width: 180px;
  flex-shrink: 0;
}

.basic-list-item .basic-list-item-tool {
  padding: 0 16px;
}

/* 响应式 */
@media screen and (max-width: 992px) {
  .basic-list-item .basic-list-item-owner,
  .basic-list-item .basic-list-item-time,
  .basic-list-item .basic-list-item-progress,
  .basic-list-item .basic-list-item-tool {
    width: auto;
    padding: 0 12px;
  }

  .basic-list-item .basic-list-item-progress {
    width: 100px;
  }
}

@media screen and (max-width: 768px) {
  .basic-list-item {
    display: block;
  }

  .basic-list-item .basic-list-item-owner,
  .basic-list-item .basic-list-item-time,
  .basic-list-item .basic-list-item-progress,
  .basic-list-item .basic-list-item-tool {
    width: auto;
    padding: 8px 0 0 0;
  }

  .basic-list-item .ele-text-secondary {
    margin-top: 0;
    padding-left: 16px;
  }

  .basic-list-item .basic-list-item-owner > div,
  .basic-list-item .basic-list-item-time > div {
    display: inline-block;
  }

  .basic-list-item .basic-list-item-tool {
    text-align: right;
  }

  .ele-table-tool .ant-input-search {
    display: none;
  }

  .ele-table-tool :deep(.ant-space-item) {
    margin: 0 !important;
  }
}
</style>
