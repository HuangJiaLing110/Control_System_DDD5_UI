<!-- 图片裁剪组件 license by http://eleadmin.com -->
<template>
  <locale-receiver component-name="ele">
    <template #default="locale">
      <div class="ele-cropper">
        <div class="ele-cropper-group">
          <div class="ele-cropper-img-group">
            <img
              ref="eleCropperImg"
              :src="imgSrc"
              style="max-width: 100%;"
              alt=""/>
          </div>
          <div
            v-if="showPreview"
            ref="eleCropperPreviews"
            :style="pStyle"
            class="ele-cropper-preview-group">
            <div
              :style="pItemStyle1"
              class="ele-cropper-preview">
            </div>
            <div
              v-if="this.aspectRatio===1"
              :style="pItemStyle2"
              class="ele-cropper-preview">
            </div>
            <div
              v-if="this.aspectRatio!==1"
              :style="pItemStyle3"
              class="ele-cropper-preview">
            </div>
            <div
              v-if="this.aspectRatio!==1"
              :style="pItemStyle4"
              class="ele-cropper-preview">
            </div>
          </div>
        </div>
        <div v-if="tools" class="ele-cropper-tool">
          <a-button-group
            v-for="(item, index) in toolGroup"
            :key="index"
            class="ele-cropper-tool-item">
            <template v-for="(btn, i) in item">
              <template v-if="btn==='zoomIn'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.zoomIn"
                  data-method="zoom"
                  data-option="0.1"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <zoom-in-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='zoomOut'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.zoomOut"
                  data-method="zoom"
                  data-option="-0.1"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <zoom-out-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='moveL'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.rotateLeft"
                  data-method="move"
                  data-option="-10"
                  data-option2="0"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <arrow-left-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='moveR'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.rotateRight"
                  data-method="move"
                  data-option="10"
                  data-option2="0"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <arrow-right-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='moveT'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.moveLeft"
                  data-method="move"
                  data-option="0"
                  data-option2="-10"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <arrow-up-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='moveB'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.moveRight"
                  data-method="move"
                  data-option="0"
                  data-option2="10"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <arrow-down-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='rotateL'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.moveUp"
                  data-method="rotate"
                  data-option="-45"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <rotate-left-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='rotateR'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.moveDown"
                  data-method="rotate"
                  data-option="45"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <rotate-right-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='scaleX'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.flipX"
                  data-method="scaleX"
                  data-option="-1"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <swap-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='scaleY'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.flipY"
                  data-method="scaleY"
                  data-option="-1"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <swap-outlined style="transform: rotate(90deg);"/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='reset'">
                <a-button
                  :key="i"
                  @click="onAction"
                  :title="locale.cropper.reset"
                  data-method="reset"
                  type="primary"
                  class="ele-cropper-tool-btn">
                  <template #icon>
                    <sync-outlined/>
                  </template>
                </a-button>
              </template>
              <template v-else-if="btn==='upload'">
                <a-upload
                  :key="i"
                  :before-upload="onUpload"
                  :accept="accept"
                  :show-upload-list="false">
                  <a-button
                    :title="locale.cropper.upload"
                    type="primary"
                    class="ele-cropper-tool-btn"
                    style="border-top-right-radius:2px;border-bottom-right-radius:2px;">
                    <template #icon>
                      <upload-outlined/>
                    </template>
                  </a-button>
                </a-upload>
              </template>
              <template v-else-if="btn==='crop'">
                <a-button
                  :key="i"
                  @click="onAction"
                  type="primary"
                  data-method="getCroppedCanvas"
                  data-option="{&quot;maxWidth&quot;:4096,&quot;maxHeight&quot;:4096}">
                  <template #icon>
                    <check-outlined/>
                  </template>
                  <span>{{ okText || locale.cropper.ok }}</span>
                </a-button>
              </template>
            </template>
          </a-button-group>
        </div>
      </div>
    </template>
  </locale-receiver>
</template>

<script>
import LocaleReceiver from 'ant-design-vue/es/locale-provider/LocaleReceiver';
import Cropper from 'cropperjs';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  SyncOutlined,
  UploadOutlined,
  CheckOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'EleCropper',
  components: {
    LocaleReceiver,
    ZoomInOutlined,
    ZoomOutOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    SyncOutlined,
    UploadOutlined,
    CheckOutlined
  },
  props: {
    // 图片地址
    src: String,
    // 裁剪比例
    aspectRatio: {
      type: Number,
      default: 1
    },
    // 裁剪组件模式
    viewMode: Number,
    dragMode: String,
    initialAspectRatio: Number,
    minContainerWidth: Number,
    minContainerHeight: Number,
    minCanvasWidth: Number,
    minCanvasHeight: Number,
    minCropBoxWidth: Number,
    minCropBoxHeight: Number,
    croppedWidth: Number,
    croppedHeight: Number,
    croppedMinWidth: Number,
    croppedMinHeight: Number,
    croppedMaxWidth: Number,
    croppedMaxHeight: Number,
    croppedFillColor: Number,
    imageSmoothingEnabled: Boolean,
    imageSmoothingQuality: String,
    // 是否返回blob数据
    toBlob: Boolean,
    // 允许上传的图片类型
    accept: {
      type: String,
      default: 'image/*'
    },
    // 操作按钮布局
    tools: {
      type: [Boolean, String],
      default: true
    },
    // 是否显示预览组件
    showPreview: {
      type: Boolean,
      default: true
    },
    // 完成按钮文字
    okText: String
  },
  emits: ['done'],
  data() {
    return {
      // cropper实例
      ins: null,
      // 图片base64数据
      imgSrc: '',
      // 当前图片类型
      imgType: 'image/jpeg',
      // 预览组件宽度
      previewWidth: 120
    };
  },
  computed: {
    // 预览组件样式
    pStyle() {
      return `width: ${this.previewWidth + 20}px;text-align: right;font-size: 0;`;
    },
    pItemStyle1() {
      const h = this.previewWidth / (this.aspectRatio || 1);
      return `width: ${this.previewWidth}px;height: ${h}px;`;
    },
    pItemStyle2() {
      return this.pItemStyle1 + 'border-radius: 50%;margin-top: 10px;';
    },
    pItemStyle3() {
      const w = this.previewWidth / 3 * 2 - 10, h = w / (this.aspectRatio || 1);
      return `width: ${this.previewWidth}px;height: ${h}px;margin-top: 10px;`;
    },
    pItemStyle4() {
      const w = this.previewWidth / 3, h = w / (this.aspectRatio || 1);
      return `width: ${this.previewWidth}px;height: ${h}px;margin: 10px 0 0 10px;`;
    },
    // 解析按钮布局
    toolGroup() {
      if (typeof this.tools === 'string') {
        let tool = [];
        this.tools.split('|').forEach(g => {
          tool.push(g.split(',').map(b => b.trim()));
        });
        return tool;
      } else if (this.tools) {
        return [
          ['zoomIn', 'zoomOut'],
          ['moveL', 'moveR', 'moveT', 'moveB'],
          ['rotateL', 'rotateR'],
          ['scaleX', 'scaleY'],
          ['reset', 'upload'],
          ['crop']
        ];
      }
      return [];
    }
  },
  mounted() {
    // ie兼容
    if (this.src && this.src.indexOf('data:image') !== 0 && (!!window.ActiveXObject || 'ActiveXObject' in window)) {
      let req = new window.XMLHttpRequest();
      req.open('GET', this.src, true);
      req.responseType = 'arraybuffer';
      req.onload = () => {
        if ([200, 201].indexOf(req.status) === -1) {
          console.error('cropper', req);
          return;
        }
        let bytes = new Uint8Array(req.response), binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        this.imgSrc = 'data:image/jpeg;base64,' + window.btoa(binary);
        this.$nextTick(() => {
          this.render();
        });
      };
      req.send();
    } else if (this.src) {
      this.imgSrc = this.src;
      this.$nextTick(() => {
        this.render();
      });
    } else {
      this.render();
    }
  },
  methods: {
    /* 渲染 */
    render() {
      if (this.ins) {
        this.ins.destroy();
      }
      let options = {
        aspectRatio: this.aspectRatio,
        viewMode: this.viewMode,
        dragMode: this.dragMode,
        initialAspectRatio: this.initialAspectRatio,
        minContainerWidth: this.minContainerWidth,
        minContainerHeight: this.minContainerHeight,
        minCanvasWidth: this.minCanvasWidth,
        minCanvasHeight: this.minCanvasHeight,
        minCropBoxWidth: this.minCropBoxWidth,
        minCropBoxHeight: this.minCropBoxHeight
      };
      if (this.showPreview) {
        options.preview = this.$refs.eleCropperPreviews.children;
      }
      this.ins = new Cropper(this.$refs.eleCropperImg, options);
    },
    /* 操作按钮点击事件 */
    onAction(e) {
      let method = this.getDataset(e.currentTarget, 'method'),
        option = this.getDataset(e.currentTarget, 'option'),
        secondOption = this.getDataset(e.currentTarget, 'option2');
      if (!this.ins || !method) {
        return;
      }
      let cropped = this.ins.cropped, result;
      switch (method) {
        case 'rotate':
          if (cropped && this.viewMode > 0) {
            this.in.clear();
          }
          break;
        case 'getCroppedCanvas':
          option = JSON.parse(option || '{}') || {};
          if (this.imgType === 'image/jpeg') {
            option.fillColor = '#fff';
          }
          option.width = this.croppedWidth;
          option.height = this.croppedHeight;
          option.minWidth = this.croppedMinWidth;
          option.minHeight = this.croppedMinHeight;
          option.maxWidth = this.croppedMaxWidth;
          option.maxHeight = this.croppedMaxHeight;
          option.fillColor = this.croppedFillColor;
          option.imageSmoothingEnabled = this.imageSmoothingEnabled;
          option.imageSmoothingQuality = this.imageSmoothingQuality;
          break;
      }
      result = this.ins[method](option, secondOption);
      switch (method) {
        case 'rotate':
          if (cropped && this.viewMode > 0) {
            this.ins.crop();
          }
          break;
        case 'scaleX':
        case 'scaleY':
          this.setDataset(e.currentTarget, 'option', -option);
          break;
        case 'getCroppedCanvas':
          if (result) {
            if (this.toBlob) {
              result.toBlob((blob) => {
                this.$emit('done', blob);
              }, this.imgType);
            } else {
              this.$emit('done', result.toDataURL(this.imgType));
            }
          } else {
            this.$message.error('裁剪失败');
          }
          break;
      }
    },
    /* 图片上传处理 */
    onUpload(file) {
      this.imgType = file.type;
      let reader = new FileReader();
      reader.onload = (e) => {
        this.ins.replace(e.target.result);
      };
      reader.readAsDataURL(file);
      return false;
    },
    /* 获取dataset属性 */
    getDataset(elem, key) {
      if (elem.dataset) {
        return elem.dataset[key];
      } else {
        return elem.getAttribute('data-' + key);
      }
    },
    /* 设置dataset属性 */
    setDataset(elem, key, value) {
      if (elem.dataset) {
        elem.dataset[key] = value;
      } else {
        elem.setAttribute('data-' + key, value);
      }
    }
  }
}
</script>

<style>
@import '~cropperjs/dist/cropper.css';

.ele-cropper .ele-cropper-group {
  display: flex;
}

.ele-cropper .ele-cropper-img-group {
  flex: 1;
}

.ele-cropper .ele-cropper-preview {
  display: inline-block;
  border: 1px solid hsla(0, 0%, 80%, .6);
  vertical-align: top;
  overflow: hidden;
}

/* 操作按钮 */
.ele-cropper .ele-cropper-tool {
  margin-top: 10px;
}

.ele-cropper .ele-cropper-tool-item {
  margin: 10px 18px 0 0;
}

.ele-cropper .ele-cropper-tool-item:last-child {
  margin-right: 0 !important;
}

.ele-cropper .ele-cropper-tool-btn {
  width: auto;
  padding: 0 10px;
}

.ele-cropper .ele-cropper-tool-item > .ant-btn + span {
  vertical-align: -1px;
}

/* 小屏幕适应 */
@media screen and (max-width: 768px) {
  .ele-cropper .ele-cropper-preview-group {
    display: none;
  }

  .ele-cropper .ele-cropper-tool-item {
    margin-right: 6px;
  }
}
</style>
