<template>
    <div style="padding:60px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="广告图片" :required="true" prop="thumb">
                <Upload v-model="form.thumb" tip="图片尺寸：690*300"> </Upload>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.sort_order" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="商品id">
                <el-select v-model="form.goods_id" filterable placeholder="请选择">
                    <el-option v-for="item in goodsList" :key="item.id" :label="item.id" :value="item.id" >
                        <div class="flex" style="height:100px;">
                            <div class="" style="width:60px;">{{ item.id }}</div>
                            <el-image style="width: 50px; height: 50px; border-radius:6px;" :src="item.thumb" fit="fit"></el-image>
                            <div class="text-cut" style="color: #8492a6; font-size: 13px; width:500px; margin-left:10px;">{{ item.name }}</div>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告启用">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Upload from "@/components/Upload/SingleImage";
import { productList } from "@/api/product";
import {swiperAdd, swiperEdit, swiperDetail} from "@/api/store";

const defaultForm = {
  goods_id: '',
  sort_order: 100,
  thumb: "",
  status: 0, //状态；0禁用；1启用
  id: undefined
};
export default {
  name: "SwiperDetail",
  components: { Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: Object.assign({}, defaultForm),
      goodsList: [],
      rules: {
        thumb: [
          { required: true, message: "请上传广告图片", trigger: "change" }
        ]
      }
    };
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
    this.loadGoodsList();
  },

  methods: {
    fetchData(id) {
      swiperDetail(id).then(res => {
        this.form = res;
      });
    },
    loadGoodsList() {
      productList({ paging: 0 }).then(res => {
        this.goodsList = res;
      });
    },
    onSubmit() {
      console.log("-------- submit:", this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            swiperEdit(this.form).then(res => {
              this.$message.success("修改成功");
              // 调用全局挂载的方法
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由
              this.$router.push("/store/store-swiper-list");
            });
          } else {
            swiperAdd(this.form).then(res => {
              this.$message.success("添加成功");
              // 调用全局挂载的方法
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由
              this.$router.push("/store/store-swiper-list");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-upload {
  text-align: left !important;
}

.el-select-dropdown__item{
  height: 50px;
  line-height: 50px;
  margin-bottom:8px;
}
</style>