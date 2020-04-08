<template>
  <div class="createPost-container" style="padding:30px 50px;">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-form-item
        style="margin-bottom: 40px;"
        prop="name"
        label-width="100px"
        label="产品名称："
        :required="true"
      >
        <el-input
          v-model="postForm.name"
          placeholder="最多允许输入50个字符"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="100px" label="产品类型：" :required="true">
        <el-cascader v-model="postForm.classify" :options="options" clearable />
      </el-form-item>
      <el-form-item label-width="100px" label="状态：">
        <el-radio-group v-model="postForm.show">
          <el-radio label="1">上架</el-radio>
          <el-radio label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="100px" label="原价：" :required="true">
        <el-input v-model="postForm.price" placeholder="" clearable style="width:200px;" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="100px" label="一口价：" :required="true">
        <el-input v-model="postForm.price_yh" placeholder="" clearable style="width:200px;" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="100px" label="库存：" :required="true">
        <el-input v-model="postForm.stock" placeholder="" clearable style="width:200px;" />
      </el-form-item>
      <el-form-item
        style="margin-bottom: 30px;"
        prop="thumb"
        label-width="100px"
        label="缩略图："
        :required="true"
      >
        <Upload v-model="postForm.thumb" />
      </el-form-item>
      <el-form-item style="margin-bottom: 40px; text-align:left;" label-width="100px" label="轮播图：">
        <UploadFile :file-list="postForm.fileList" @uploadfile="uploadFile" />
      </el-form-item>
      <el-form-item style="margin-bottom: 30px;" label-width="100px" label="视频：">
        <VideoUpload v-model="postForm.video" />
      </el-form-item>
      <el-form-item prop="content" style="margin-bottom: 30px;" label-width="100px" label="详情：">
        <Tinymce ref="editor" v-model="postForm.content" :height="400" />
      </el-form-item>
      <el-form-item style="text-align:center; margin-bottom: 30px;">
        <el-button v-if="!isEdit" type="primary" @click="onSubmit">立即创建</el-button>
        <el-button v-else type="primary" @click="onEditSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/AvatarImage'
import VideoUpload from '@/components/Upload/VideoUpload'
import UploadFile from '@/components/Upload/UploadFile'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { detailProduct, addProduct, editProduct, fetchCategoryList } from '@/api/product'
import { searchUser } from '@/api/remote-search'

const defaultForm = {
  name: '', // 商品名称
  classify: [], // 商品分类
  show: '1', // 商品状态1：上架，0：下架
  price: '', // 原价
  price_yh: '', // 一口价
  stock: '', // 库存
  thumb: '', // 缩略图
  banner: [], // 轮播图
  fileList: [],
  video: '', // 视频路径
  content: '', // 商品详情
  id: undefined,
  type: 1,
  fid: 0
}

export default {
  name: 'ProductDetail',
  components: { Tinymce, MDinput, Upload, Sticky, VideoUpload, UploadFile },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        thumb: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {},
      options: []
    }
  },
  computed: {
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      fetchCategoryList().then(res => {
        this.options = res
        console.log('----------- options', this.options)
      })
    },
    fetchData(id) {
      detailProduct(id).then(res => {
        console.log('-----------edit product: ', res)
        this.postForm = res
        this.postForm.classify = [res.cid]
        this.postForm.show = res.show.toString()
        const banner = JSON.parse(res.banner)
        const fileList = []
        for (let i = 0; i < banner.length; i++) {
          fileList.push({
            name: '',
            url: banner[i]
          })
        }
        console.log('---------', fileList)
        this.postForm.fileList = fileList
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增
    onSubmit() {
      console.log('submit:', this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.cid = this.postForm.classify[
            this.postForm.classify.length - 1
          ]
          const fileList = this.postForm.fileList
          const banner = []
          for (let i = 0; i < fileList.length; i++) {
            banner.push(fileList[i].url)
          }
          console.log('-------------', banner)
          this.postForm.banner = JSON.stringify(banner)
          addProduct(this.postForm).then(res => {
            console.log('------------ add ', res)
            this.$notify({
              title: '成功',
              message: '商品添加成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            this.$refs.postForm.resetFields()
            this.$router.push({ path: 'list' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 修改
    onEditSubmit() {
      console.log('submit:', this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.cid = this.postForm.classify[
            this.postForm.classify.length - 1
          ]
          const fileList = this.postForm.fileList
          const banner = []
          for (let i = 0; i < fileList.length; i++) {
            banner.push(fileList[i].url)
          }
          console.log('-------------', banner)
          this.postForm.banner = JSON.stringify(banner)
          editProduct(this.postForm).then(res => {
            this.$notify({
              title: '成功',
              message: '商品修改成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    uploadFile(val) {
      console.log('------------ uploadFile', val)
      this.postForm.fileList = val
    }
  }
}
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
