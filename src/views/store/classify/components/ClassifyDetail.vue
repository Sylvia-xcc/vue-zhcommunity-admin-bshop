<template>
    <div style="padding:30px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="分类名称" :required="true" prop="name">
                <el-input v-model="form.name" style="width:205px"></el-input>
            </el-form-item>
            <!-- <el-form-item label="上级分类" :required="true" prop="parent_id">
                <el-select v-model="form.parent_id" placeholder="请选择活动区域">
                    <el-option label="一级分类" :value="0"></el-option>
                    <el-option
                        v-for="item in classifyList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="排序" :required="true" prop="sort_order">
                <el-input type="number" v-model.number="form.sort_order" style="width:205px"></el-input>
                <span style="color:#909399; font-size:12px; margin:0px 10px;">（数字越大越靠前）</span>
            </el-form-item>
            <el-form-item label="分类图标" :required="true" prop="thumb">
                <Upload v-model="form.thumb"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Upload from "@/components/Upload/AvatarImage";
import {
  classifyFirstList,
  classifyAdd,
  classifyDetail,
  classifyEdit
} from "@/api/classify";

const defaultForm = {
  name: "", // 商品名称
  parent_id: 0, // 商品分类
  sort_order: 100,
  thumb: "",
  id: undefined
};
export default {
  name: "ClassifyDetail",
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
      classifyList: [],
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        parent_id: [
          { required: true, message: "请选择上级分类", trigger: "change" }
        ],
        sort_order: [
          {
            required: true,
            message: "请输入分类排序",
            trigger: "blur"
          }
        ],
        thumb: [
          { required: true, message: "请选择分类图片", trigger: "change" }
        ]
      }
    };
  },

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }
    this.getClassifyList();
  },

  methods: {
    fetchData(id) {
      classifyDetail(id).then(res => {
        this.form = res;
      });
    },
    getClassifyList() {
      classifyFirstList().then(res => {
        this.classifyList = res;
      });
    },
    onSubmit() {
      console.log("-------- submit:", this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            classifyEdit(this.form).then(res => {
              this.$message.success("修改成功");
              // 调用全局挂载的方法
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由
              this.$router.push('/store/store-classify-list')
            });
          } else {
            classifyAdd(this.form).then(res => {
              this.$message.success("添加成功");
              // 调用全局挂载的方法
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由
              this.$router.push('/store/store-classify-list')
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
</style>
