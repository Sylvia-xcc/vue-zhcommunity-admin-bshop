<template>
    <div style="padding:30px;">
        <div class="title">基础信息</div>
        <el-form :model="form" label-width="100px" class="store-form">
            <el-form-item label="店铺名称" prop="name" :required="true">
                <el-input v-model="form.name" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 30px;" prop="thumb" label="店铺标志" :required="true">
                <Upload v-model="form.thumb"/>
            </el-form-item>
            <el-form-item label="店铺简介" prop="desc" >
                <el-input type="textarea" v-model="form.desc" :rows="5" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Upload from "@/components/Upload/AvatarImage";
const defaultForm = {
  name: "",
  thumb: "",
  desc: ""
};
export default {
  name: "StoreInfo",
  components: { Upload },
  data() {
    return {
      form: Object.assign({}, defaultForm)
    };
  },
  methods: {
    submitForm() {}
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
  margin: 40px 50px;
}
</style>

