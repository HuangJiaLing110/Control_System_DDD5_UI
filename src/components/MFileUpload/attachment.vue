<template>
  <div v-if="operatorType!=='view'" >
    <a-upload
      multiple
      :remove="handleRemove"
      :file-list="fileList"
      :before-upload="beforeUpload"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        选择文件
      </a-button>
    </a-upload>
  </div>
  <a-row v-else-if="operatorType==='view'">
    <div v-if="fileList.length ===0&&reFileList.length===0">
      <span style="color: blue;cursor: pointer">暂无附件</span>
    </div>
  </a-row>
  <div>
    <div v-if="reFileList.length!==0&&operatorType!=='upload'">
      <a-list
        size="small"
        class="demo-loadmore-list"
        item-layout="horizontal"
        :data-source="reFileList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-button type="link" @click="down(item)" class="action">下载</a-button>
              <a-button type="link" ghost @click="deleteFile(item)" class="action" v-if="operatorType!=='view'" style="color:red">删除</a-button>
            </template>
            <div class="atta-name">{{ item.attachmentRealName }}</div>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script>
import {message} from "ant-design-vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import FileSaver from "file-saver";
import uploadAttachmentService from './attachmentService'

export default {
  emits: ['fileList'],
  components: {
    UploadOutlined,
  },
  name: "MAttachment",
  props: ['associateFormId', 'associateFormName', 'operatorType'],
  created() {
    console.log(this.associateFormId)
    if (this.associateFormId!=null){
      this.findFile(this.associateFormId,this.associateFormName)
    }

  },
  data() {
    return {
      fileList: [],
      //接收回传文件
      reFileList: [],

    };
  },
  watch: {
    //监听fileList并将选中的文件传到父组件
    fileList:function (){
      //将文件回传到父组件进行上传
      this.$emit('fileList', this.fileList);
    },
    // //监听组件的状态的变化
    'operatorType':function (){
      this.findFile(this.associateFormId,this.associateFormName)
      this.fileList=[]
    },
  },
  methods: {
    //上传附件
    // saveFile() {
    //   let formData = new FormData();
    //   let associateFormName = "student"
    //   let fileUploadDto1 = {associateFormId: "1", associateFormName: associateFormName};
    //   var fileUploadDto = JSON.stringify(fileUploadDto1)
    //   formData.append("fileUploadDto", new Blob([fileUploadDto], {type: "application/json"}));
    //   this.fileList.forEach(file => {
    //     formData.append('files', file);
    //   });
    //   // uploading.value = true; // You can use any AJAX library you like
    //   if (this.fileList.length != 0) {
    //     uploadAttachmentService.saveFile(formData).then(() => {
    //       this.fileList = [];
    //       this.findFile(1,"student")
    //       message.success('上传成功');
    //     })
    //       .catch(() => {
    //         message.error('上传失败');
    //       });
    //   } else {
    //     message.warn("请选择文件")
    //   }
    // },
    //返回已上传的附件
    findFile(associateFormId, associateFormName) {
      if (associateFormId!=null && associateFormName!=null){
        uploadAttachmentService.findFile(associateFormId,associateFormName).then((res) => {
          this.reFileList = res.data

        })
      }
    },
    //下载附件
    down(file) {
      uploadAttachmentService.down(file.attachmentId).then((res) => {
        FileSaver.saveAs(
          new Blob([res.data], {type:"application/octet-stream"}),
          file.attachmentRealName
        )
      })
    },
    //通过附件id对附件进行删除
    deleteFile(item) {
      this.$XModal.confirm('您确定要删除吗？').then(type => {
        if (type === 'confirm'){
          uploadAttachmentService.deleteFile(item.attachmentId).then(() => {
            this.$XModal.message({ content: '删除成功' })
            this.findFile(this.associateFormId, this.associateFormName)
          })
        }
      })
    },
    //上传文件之前判断文件大小
    beforeUpload(file) {
      const maxSize = file.size / 1024 / 1024 < 100;
      if (!maxSize) {
        message.error('上传文件过大');
      } else {
        this.fileList = [...this.fileList, file];
      }
      return false;
    },
    //对选中的文件进行移除
    handleRemove(file) {
      var index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    //清空fileList
    cleanFileList(){
      this.fileList=[]
    }
  }
}
</script>
<style scoped >

.ant-list-item {
  background: #fff;
}
.ant-list-item:hover{background:#F5F7FA;}
.action{display: none}
.ant-list-item:hover .action{display: block}

</style>
