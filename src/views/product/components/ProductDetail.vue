<template>
  <div class="createPost-container" style="padding:30px 50px;">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-width="120px"
    >
      <el-form-item style="margin-bottom: 40px;" prop="name" label="商品名称：" :required="true">
        <el-input v-model="postForm.name" placeholder=""  clearable style="width:205px;" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label="商品类目：" prop="classify" :required="true">
        <el-cascader v-model="postForm.classify" :options="options" placeholder="选择商品类目" clearable/>
      </el-form-item>
      <div v-if="type==3">
        <el-form-item style="margin-bottom: 40px;" label="拼团人数" prop="number" :required="true" :rules="{ required: true, message: '请输入拼团人数'}">
          <el-input v-model="postForm.number" placeholder="" clearable style="width:205px;"/>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label="拼团开始时间" prop="start_time" :required="true" :rules="{ required: true, message: '请选择拼团开始时间'}">
          <el-date-picker v-model="postForm.start_time" type="datetime" placeholder="选择拼团开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" label="拼团结束时间" prop="end_time" :required="true" :rules="{ required: true, message: '请选择拼团结束时间'}">
          <el-date-picker v-model="postForm.end_time" type="datetime" placeholder="选择拼团结束时间"></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item style="margin-bottom: 40px;" label="商品价格：" prop="price_yh" :required="true">
        <el-input v-model="postForm.price_yh" placeholder="" clearable style="width:205px;"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label="商品划线价：" prop="price" :required="true">
        <el-input v-model="postForm.price" placeholder="" clearable style="width:205px;"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label="库存：" prop="stock" :required="true">
        <el-input v-model="postForm.stock" placeholder="" clearable style="width:205px;"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label="店铺中分类：" prop="store" :required="true">
        <el-cascader v-model="postForm.store" placeholder="请选择店铺中分类" :options="classifyList" :show-all-levels="false" clearable :props="{value: 'id', label: 'name'}" />
        <router-link :to="'/store/store-classify-add'">
          <el-button type="text" size="mini" style="margin-left:10px;">去添加</el-button>
        </router-link>
      </el-form-item>
      <el-form-item style="margin-bottom: 30px;" prop="thumb" label="商品图片：" :required="true">
        <Upload v-model="postForm.thumb"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px; text-align:left;" label="轮播图：">
        <UploadFile :file-list="postForm.fileList" @uploadfile="uploadFile"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 30px;" label="视频：">
        <VideoUpload v-model="postForm.video"/>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="postForm.show">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-bottom: 30px;" label="选择快递模板：" :required="true">
        <el-select v-model="postForm.fid" placeholder="请选择">
          <el-option :value="0" label="包邮"></el-option>
          <el-option v-for="item in freight" :key="item.value" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <router-link :to="'/store/store-classify-add'">
          <el-button type="text" size="mini" style="margin-left:10px;">去添加</el-button>
        </router-link>
      </el-form-item>
      <el-form-item label="热销：">
        <el-radio-group v-model="postForm.hot">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新品：">
        <el-radio-group v-model="postForm.new">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推荐：">
        <el-radio-group v-model="postForm.tuijian">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="content" style="margin-bottom: 30px;" label="详情：" :required="true">
        <Tinymce ref="editor" v-model="postForm.content" :height="200"/>
      </el-form-item>
      <el-form-item style="text-align:center; margin-bottom: 30px;">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/AvatarImage";
import VideoUpload from "@/components/Upload/VideoUpload";
import UploadFile from "@/components/Upload/UploadFile";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import {
  detailProduct,
  addProduct,
  editProduct,
  fetchCategoryList
} from "@/api/product";
import { classifyList } from "@/api/classify";
import { freightList } from "@/api/freight";

const defaultForm = {
  name: "", // 商品名称
  classify: [], // 商品分类
  show: 1, // 商品状态1：上架，0：下架
  price: "", // 原价
  price_yh: "", // 一口价
  stock: "", // 库存
  thumb: "", // 缩略图
  banner: [], // 轮播图
  fileList: [],
  video: "", // 视频路径
  content: "", // 商品详情
  id: undefined,
  type: 1,
  fid: 0,
  store: [],
  number:'',
  start_time:'',
  end_time:'',
  merchant_class_id:0,
  pintuanInfo:{
    number:'',
    start_time:'',
    end_time:'',
  },
  tuijian:0,
  new:0,
  hot:0,
};

export default {
  name: "ProductDetail",
  components: { Tinymce, Upload, Sticky, VideoUpload, UploadFile },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if(value=='')
      {
        return callback(new Error('请输入拼团人数'))
      }
      if(value<=1){
        return callback(new Error('拼团人数至少2人'))
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        thumb: [{ required: true, message: "请选择商品图片", trigger: "blur" }],
        classify: [
          { required: true, message: "请选择商品类目", trigger: "change" }
        ],
        price_yh: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入商品划线价", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        store: [
          { required: true, message: "请选择商品店铺中分类", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入商品详情", trigger: "blur" }
        ]
      },
      // rule: { required: true, trigger: 'blur', validator: validateNumber},
      tempRoute: {},
      options: [],
      classifyList: [],
      freight:[],
    };
  },
  created() {
    console.log("------------- ++++++ ", this.$route.params);
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    this.getCategoryList();
    this.getClassifyList();
    this.getFreightList();
  },
  methods: {
    getCategoryList() {
      fetchCategoryList().then(res => {
        this.options = res;
        console.log("----------- options", this.options);
      });
    },
    fetchData(id) {
      detailProduct(id)
        .then(res => {
          console.log("-----------edit product: ", res);
          this.postForm = res;
          this.postForm.classify = [res.cid];
          this.postForm.show = res.show.toString();
          const banner = JSON.parse(res.banner);
          const fileList = [];
          for (let i = 0; i < banner.length; i++) {
            fileList.push({
              name: "",
              url: banner[i]
            });
          }
          this.postForm.store = [];
          this.postForm.store = [res.merchant_class_id];
          console.log("---------", fileList);
          this.postForm.fileList = fileList;      
          this.postForm.number = res.pintuanInfo.number;
          this.postForm.start_time = res.pintuanInfo.start_time;
          this.postForm.end_time = res.pintuanInfo.end_time;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getClassifyList() {
      classifyList({ paging: 0 }).then(res => {
        for (let i = 0; i < res.length; i++) {
          let obj = {
            name: res[i].name,
            id: res[i].id
          };
          if (res[i].children.length > 0) obj.children = res[i].children;
          this.classifyList.push(obj);
        }
        console.log("-----");
      });
    },
    getFreightList(){
      freightList().then(res=>{
        this.freight = res.data;
      })
    },
    // 新增
    onSubmit() {
      console.log("submit:", this.postForm);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          console.log('----------valid:',valid)
          this.loading = true;
          this.postForm.cid = this.postForm.classify[
            this.postForm.classify.length - 1
          ];
          const fileList = this.postForm.fileList;
          const banner = [];
          for (let i = 0; i < fileList.length; i++) {
            banner.push(fileList[i].url);
          }
          console.log("-------------", banner);
          this.postForm.banner = JSON.stringify(banner);
          this.postForm.type = this.type;
          this.postForm.pintuanInfo = {
            number:this.postForm.number,
            start_time:this.postForm.start_time,
            end_time:this.postForm.end_time,
          }
          this.postForm.merchant_class_id = this.postForm.store[this.postForm.store.length-1];
          if(this.type==3 && this.postForm.number<=1){
            this.$message.error('拼团人数至少为2人')
            return;
          }

          if (this.isEdit) {
            this.editProductTap();
          } else {
            this.addProductTap();
          }
        } else {
          console.log("error submit!!");
          this.$message.error("有必填选项未填写，请检查！");
          return false;
        }
      });
    },

    addProductTap() {
      addProduct(this.postForm).then(res => {
        console.log("------------ add ", res);
        this.$notify({
          title: "成功",
          message: "商品添加成功",
          type: "success",
          duration: 2000
        });
        this.loading = false;
        this.$refs.postForm.resetFields();
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1);
      });
    },

    editProductTap() {
      editProduct(this.postForm).then(res => {
        this.$notify({
          title: "成功",
          message: "商品修改成功",
          type: "success",
          duration: 2000
        });
        this.loading = false;
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1);
      });
    },

    uploadFile(val) {
      console.log("------------ uploadFile", val);
      this.postForm.fileList = val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
