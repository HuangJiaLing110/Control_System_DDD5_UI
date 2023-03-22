import axios from 'axios';

/**
 * 附件
 */
export default {
  //上传附件
  saveFile(formData){
    return axios({
      method: 'post',
      url: "/erp/system/Attachment/saveAttachment",
      data: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
    })
  },
  //返回已上传的附件
  findFile(id, name){
    return axios({
      method: 'get',
      url: "/erp/system/Attachment/findAllUploadedFilesByIdAndName",
      params: {
        id: id,
        name: name
      },
    })
  },
  //下载附件
  down(attachmentId){
    return axios({
      method: 'get',
      url: "/erp/system/Attachment/download",
      params: {
        isOnline: false,
        attachmentId:attachmentId,
      },
      responseType: 'blob',
    })
  },
  //删除附件
  deleteFile(attachmentId){
    return axios({
      method: 'post',
      url: "/erp/system/Attachment/deleteAttachmentOfAttId",
      params: {attachmentId: attachmentId}
    })
  },

  //查询
  findAttachment(attachmentId){
    return axios({
      method: 'post',
      url: "/erp/system/Attachment/findAttachment",
      params: {attachmentId: attachmentId}
    })
  }

}
