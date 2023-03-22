<template>
  <div class="ele-body">
    <a-card
      :bordered="false"
      :body-style="{padding: 0, minHeight: '520px'}">
      <div style="padding: 16px 16px 0 16px;">
        <!-- 工具栏 -->
        <div class="ele-table-tool">
          <div class="ele-table-tool-title">
            <a-space>
              <a-upload
                :showUploadList="false"
                :customRequest="doUpload">
                <a-button type="primary">上传</a-button>
              </a-upload>
              <a-button type="primary">新建文件夹</a-button>
              <a-button type="danger">删除</a-button>
            </a-space>
          </div>
          <!-- 搜索框 -->
          <div style="max-width: 240px;">
            <a-input-search
              v-model:value="search"
              placeholder="搜索您的文件"/>
          </div>
          <!-- 显示方式切换 -->
          <menu-outlined
            v-if="grid"
            class="ele-file-tool-btn"
            @click="grid=!grid"/>
          <appstore-outlined
            v-else
            class="ele-file-tool-btn"
            @click="grid=!grid"/>
        </div>
        <!-- 文件目录面包屑 -->
        <div class="ele-file-breadcrumb-group ele-cell">
          <div class="ele-cell-content ele-cell">
            <div
              v-if="directory.length"
              class="ele-file-breadcrumb-back ele-text-primary"
              @click="back">返回上一级
            </div>
            <div class="ele-file-breadcrumb-list ele-cell-content ele-cell">
              <div
                :class="['ele-file-breadcrumb-item ele-cell', {'ele-text-primary': directory.length}]"
                @click="listAll">
                <div class="ele-file-breadcrumb-item-title">全部文件</div>
                <right-outlined v-if="directory.length"/>
              </div>
              <div
                v-for="(item,index) in directory"
                :key="index"
                @click="listDir(index)"
                :class="['ele-file-breadcrumb-item ele-cell', {'ele-text-primary': index!==directory.length-1}]">
                <div class="ele-file-breadcrumb-item-title">{{ item }}</div>
                <right-outlined v-if="index!==directory.length-1"/>
              </div>
            </div>
          </div>
          <div>已全部加载，共 {{ data.length }} 个</div>
        </div>
      </div>
      <a-spin :spinning="loading">
        <!-- 文件展示列表 -->
        <ele-file-list
          :data="data"
          v-model:checked="checked"
          :grid="grid"
          :sort="sort"
          :order="order"
          @item-click="onItemClick"
          @sort-change="onSortChange">
        </ele-file-list>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import EleFileList from 'ele-admin-pro/packages/ele-file-list';
import {
  MenuOutlined,
  AppstoreOutlined,
  RightOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'ExtensionFile',
  components: {
    EleFileList,
    MenuOutlined,
    AppstoreOutlined,
    RightOutlined
  },
  data() {
    return {
      // 加载状态
      loading: true,
      // 是否网格展示
      grid: true,
      // 文件列表数据
      data: [],
      // 选中数据
      checked: [],
      // 文件目录面包屑数据
      directory: [],
      // 搜索
      search: '',
      // 排序字段
      sort: '',
      // 排序方式
      order: '',
      // 图片预览文件
      currentImage: '',
    };
  },
  computed: {
    // 图片预览列表
    previewList() {
      return this.data.filter(d => d.thumbnail).map(d => d.url);
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 查询文件列表 */
    query() {
      this.checked = [];
      this.loading = true;
      this.$http.get('/file/list', {
        params: {
          directory: this.directory.join('/'),
          sort: this.sort,
          order: this.order
        }
      }).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          res.data.data.forEach(d => {
            // 文件地址加baseURL
            if (d.url) {
              d.url = this.$http.defaults.baseURL + '/' + d.url;
            }
            if (d.thumbnail) {
              d.thumbnail = this.$http.defaults.baseURL + '/' + d.thumbnail;
            }
            // 文件大小格式化
            if (d.isDirectory) {
              d.length = '-';
            } else {
              d.length = this.getFileSize(d.length);
            }
            // 修改时间格式化
            if (d.updateTime) {
              d.updateTime = this.$util.toDateString(d.updateTime);
            }
          });
          this.data = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* item点击事件 */
    onItemClick(item) {
      if (item.isDirectory) {  // 文件夹
        this.directory.push(item.name);
        this.query();
      } /*else if (item.thumbnail) {
        this.currentImage = item.url;
      }*/ else if (this.checked.indexOf(item) !== -1) {
        this.checked.splice(this.checked.indexOf(item), 1);
      } else {
        this.checked.push(item);
      }
    },
    /* 返回上级 */
    back() {
      this.directory.splice(this.directory.length - 1, 1);
      this.query();
    },
    /* 全部文件 */
    listAll() {
      if (!this.directory.length) {
        return;
      }
      this.directory = [];
      this.query();
    },
    /* 回到指定目录 */
    listDir(index) {
      if (index === this.directory.length - 1) {
        return;
      }
      this.directory.splice(index, this.directory.length - index);
      this.query();
    },
    /* 文件大小格式化 */
    getFileSize(value) {
      if (value < 1024) {
        return value + 'B';
      } else if (value < 1024 * 1024) {
        return (value / 1024).toFixed(1) + 'KB';
      } else if (value < 1024 * 1024 * 1024) {
        return (value / 1024 / 1024).toFixed(1) + 'M';
      } else {
        return (value / 1024 / 1024 / 1024).toFixed(1) + 'G';
      }
    },
    /* 文件列表排序方式改变 */
    onSortChange(obj) {
      this.order = obj.order;
      this.sort = obj.sort;
      this.query();
    },
    /* 查看文件 */
    view(item) {
      if (item.isDirectory) {
        this.onItemClick(item);
      } else if (item.url) {
        window.open(item.url);
      }
    },
    /* 上传 */
    doUpload(file) {
      let formData = new FormData();
      formData.append('file', file);
      const hide = this.$message.loading('上传中..', 0);
      this.$http.post('/sys/user/import', formData).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.directory = [file.response.dir.replace(/\//, '')];
          this.query();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
      return false;
    }
  }
}
</script>

<style scoped>
/* 图标按钮 */
.ele-file-tool-btn {
  font-size: 20px;
  margin-left: 16px;
  cursor: pointer;
}

/* 文件目录面包屑 */
.ele-file-breadcrumb-group {
  margin-bottom: 12px;
  line-height: 1;
}

.ele-file-breadcrumb-back {
  padding-right: 12px;
  border-right: 1px solid hsla(0, 0%, 60%, .3);
}

.ele-file-breadcrumb-back:hover,
.ele-file-breadcrumb-item.ele-text-primary:hover > .ele-file-breadcrumb-item-title {
  text-decoration: underline;
  cursor: pointer;
}

.ele-file-breadcrumb-item .anticon {
  margin: 0 4px;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .ele-table-tool > .ele-table-tool-title + div,
  .ele-file-breadcrumb-group > .ele-cell-content + div {
    display: none;
  }
}
</style>
