<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl()"
      :data="uploadData()"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
    >
      <div class="avatar-progress" v-if="progressFlag">
        <el-progress type="circle" :percentage="percent"></el-progress>
      </div>
      <div v-else>
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div v-if="imageUrl" class="image-preview-action">
          <i class="el-icon-delete" @click.stop="rmImage"></i>
        </div>
      </div>
    </el-upload>
  </div>
</template>


<script>
import { getToken } from "@/api/qiniu";
import config from "@/api/config";
// 头像上传---进度条
export default {
  name: "AvatarImage",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tempUrl: "",
      percent: 0,
      progressFlag: false
    };
  },
  computed: {
    imageUrl() {
      return this.value;
    }
  },
  methods: {
    uploadUrl() {
      return config.qiniuURL; //"https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"; //'https://httpbin.org/post';//
    },

    uploadData() {
      return { uid: this.$store.getters.uid };
    },

    emitInput(val) {
      this.$emit("input", val);
    },

    rmImage() {
      this.emitInput("");
    },

    handleError() {
      this.$message.error("上传失败!");
      this.progressFlag = false;
      this.percent = 0;
    },

    handleRemove(file, fileList) {
      //   this.tempUrl = "";
      this.emitInput("");
    },

    handleSuccess(res, file, fileList) {
      // let url = URL.createObjectURL(file.raw);
      console.log("-----上传成功：", res);
      if (res.code == 1) {
        this.progressFlag = false;
        this.percent = 0;
        this.emitInput(res.data.url);
      }else{
        this.$message.error("图片上传失败，请重新上传！");
      }
    },

    handleProgress(event, file, fileList) {
      console.log("--------- progress:", event, file, fileList);
      this.progressFlag = true;
      this.percent = Math.floor(event.percent);
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
.upload-container {
  width: 128px;
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
