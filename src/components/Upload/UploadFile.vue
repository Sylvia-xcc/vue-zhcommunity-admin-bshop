<template>
  <div class="upload-container-file">
    <el-upload
      class="upload-demo"
      style="width:400px;"
      :action="uploadUrl()"
      :data="uploadData()"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove"
      :on-error="handleError"
      :file-list="fileList"
      :on-success="handleSuccess"
      list-type="picture"
    >
      <el-button size="small" type="primary"><i class="el-icon-upload el-icon--left"></i>选择图片</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif/bmp文件，且不超过2MB</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from "@/api/qiniu";
import config from "@/api/config";
// 头像上传---进度条
export default {
  name: "UploadFile",
  props: {
    fileList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  methods: {
    uploadUrl() {
      return config.qiniuURL; //'https://bshop.fengzhankeji.com/api/../addons/qiniu/index/upload/'//"https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"; //'https://httpbin.org/post';//
    },

    uploadData() {
      return { uid: this.$store.getters.uid };
    },

    emitInput(val) {
      this.$emit("uploadfile", val);
    },

    handleError() {
      this.$message.error("上传失败!");
    },

    handleRemove(file, fileList) {
      console.log("-------", file, fileList);
      this.emitInput(fileList);
    },

    handleSuccess(res, file, fileList) {
      console.log("-----上传成功：", res, file, fileList);
      if (res.code == 1) {
        let temp = this.fileList;
        temp.push({
          url: file.response.data.url,
          name: file.name
        });
        this.emitInput(temp);
      } else {
        this.$message.error("图片上传失败，请重新上传！");
      }
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传图片必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.el-upload {
  text-align: left !important;
}
.upload-container-file {
  position: relative;
  @include clearfix;

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 128px;
    height: 128px;
    .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
    }
    .avatar {
      width: 128px;
      height: 128px;
      display: block;
    }
    .avatar-progress {
      position: absolute;
      left: 0;
      top: 0;
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 128px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
