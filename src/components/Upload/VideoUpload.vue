<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader el-upload--text"
      :action="uploadUrl()"
      :data="uploadData()"
      :show-file-list="false"
      :on-success="handleVideoSuccess"
      :before-upload="beforeUploadVideo"
      :on-progress="uploadVideoProcess"
      :on-error="uploadVideoError"
    >
      <video
        v-if="videoUrl !='' && videoFlag == false"
        :src="videoUrl"
        class="avatar"
        controls="controls"
      >您的浏览器不支持视频播放</video>
      <i v-else-if="videoUrl =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
      <el-progress
        v-if="videoFlag == true"
        type="circle"
        :percentage="videoUploadPercent"
        style="margin-top:30px;"
      ></el-progress>
      <div v-if="videoUrl !='' && videoFlag == false" class="image-preview-action">
        <i class="el-icon-delete" @click.stop="rmVideo"></i>
      </div>
    </el-upload>
    <P class="text">请保证视频格式正确，且不超过10M</P>
  </div>
</template>

<script>
import { getToken } from "@/api/qiniu";
import config from "@/api/config";
// 头像上传---进度条
export default {
  name: "VideoUpload",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      videoFlag: false,
      videoUploadPercent: 0
    };
  },
  computed: {
    videoUrl() {
      return this.value;
    }
  },
  methods: {
    uploadUrl() {
      return config.qiniuURL; //'https://bshop.fengzhankeji.com/api/../addons/qiniu/index/upload/'//"https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"; //'https://httpbin.org/post';//
    },

    uploadData() {
      return { uid: this.$store.getters.uid };
    },

    emitInput(val) {
      this.$emit("input", val);
    },

    rmVideo() {
      this.emitInput("");
    },
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      let videoType = [
        "video/mp4",
        "video/ogg",
        "video/flv",
        "video/avi",
        "video/wmv",
        "video/rmvb"
      ];
      if (videoType.indexOf(file.type) == -1) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    uploadVideoError() {
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.$message.error("视频上传失败，请重新上传！");
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = Math.floor(event.percent);
    },
    //获取上传图片地址
    handleVideoSuccess(res, file) {
      // let url =
      //   "https://www.fengzhankeji.com/qizhuhome/data/upload/2019-11-27/5dde39f275eea.mp4"; //URL.createObjectURL(file.raw);
      console.log("------ 视频上传成功：", res);
      if (res.code == 1) {
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        this.emitInput(res.data.url);
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 350px;
  position: relative;
  @include clearfix;
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    height: 178px;
    overflow: hidden;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 350px;
      height: 178px;
    }

    .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 350px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 350px;
      height: 178px;
      display: block;
    }

    .image-preview-action {
      position: absolute;
      width: 350px;
      height: 178px;
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
      line-height: 178px;
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

