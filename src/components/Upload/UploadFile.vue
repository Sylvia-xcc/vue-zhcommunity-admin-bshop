<template>
    <div class="upload-container">
        <el-upload
            class="upload-demo"
            style="width:400px;"
            :action="uploadUrl()"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-error="handleError"
            :file-list="fileList"
            :on-success="handleSuccess"
            list-type="picture"
        >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import { getToken } from "@/api/qiniu";
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
    return {
      
    };
  },  
  methods: {
    uploadUrl() {
      return "https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"; //'https://httpbin.org/post';//
    },

    emitInput(val) {
      this.$emit("uploadfile", val);
    },

    handleError() {
      this.$message.error("上传失败!");
    },

    handleRemove(file, fileList) {
      console.log('-------', file, fileList)
      this.emitInput(fileList);
    },

    handleSuccess(res, file, fileList) {
      let url = URL.createObjectURL(file.raw);
      console.log("-----上传成功：", res, file, url);
      this.emitInput(fileList);
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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-upload {
  text-align: left !important;
}
.upload-container {
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
