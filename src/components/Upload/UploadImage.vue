<template>
    <div class="upload-container">
        <el-upload
            class="upload-demo"
            :action="uploadUrl()"
            :data="uploadData()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture"
        >
            <el-button size="mini" type="primary"><i class="el-icon-upload el-icon--left"></i>选择图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
      } else {
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
