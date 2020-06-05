<template>
  <div style="padding:30px;">
    <el-form :model="form" label-width="100px" class="store-form">
      <div class="title" style="margin-bottom:50px;">基础信息</div>
      <!-- <el-form-item label="店铺名称" prop="name" :required="true">
        <el-input v-model="form.name" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 30px;" prop="thumb" label="店铺标志" :required="true">
        <Upload v-model="form.thumb"/>
      </el-form-item>
      <el-form-item label="店铺简介" prop="desc">
        <el-input type="textarea" v-model="form.desc" :rows="5" style="width:500px;"></el-input>
      </el-form-item>-->
      <el-form-item label="店铺地址：" prop="name">
        <el-input v-model="form.address" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="配送服务：" prop="name">
        <el-input v-model="form.delivery_service" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="配送时间：" prop="name">
        <el-input v-model="form.delivery_time" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="本店承诺：" prop="desc">
        <el-input type="textarea" v-model="form.promise" :rows="5" style="width:500px;"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px; text-align:left;" label="店铺图片：">
        <UploadFile :file-list="form.fileList" @uploadfile="uploadFile"/>
      </el-form-item>
      <!-- <el-form-item prop="content" style="margin-bottom: 30px;" label="商家资质：" >
        <Tinymce ref="editor" v-model="form.aptitude" :height="200"/>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/AvatarImage";
import UploadFile from "@/components/Upload/UploadFile";
import { storeDetail, storeDetailEdit} from "@/api/store";
const defaultForm = {
  name: "",
  thumb: "",
  desc: "",
  address: "",
  delivery_service: "",
  delivery_time: "",
  promise: "",
  fileList: [],
  aptitude: "",
  pic: ""
};
export default {
  name: "StoreInfo",
  components: { Upload, UploadFile, Tinymce  },
  data() {
    return {
      form: Object.assign({}, defaultForm)
    };
  },
  created() {
    this.getStoreDetail();
  },
  methods: {
    getStoreDetail() {
      storeDetail().then(res => {
        this.form = res;
        let tmp = [];
        if(res.pic!=''){
          let fileList = JSON.parse(res.pic);
          for (let i = 0; i < fileList.length; i++) {
              tmp.push({
                name: "轮播图",
                url: fileList[i]
            });
           }
        }       
        this.form.fileList = tmp;
        console.log("------ form", this.form);
      });
    },
    submitForm() {
      let fileList = this.form.fileList;
      let tmp = [];
      for (let i = 0; i < fileList.length; i++) {
        tmp.push(fileList[i].url);
      }
      this.form.pic = JSON.stringify(tmp);
      storeDetailEdit(this.form).then(res => {
        this.$message.success("保存成功");
      });
    },
    uploadFile(val) {
      console.log("------------ uploadFile", val);
      this.form.fileList = val;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.title {
  font-size: 14px;
  padding: 12px 20px;
  border-bottom: 1px solid #eef1f5;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 4px;
    height: 14px;
    background: #00aeff;
    top: 13px;
    left: 8px;
  }
}

.store-form {
  // margin: 40px 50px;
}
</style>

