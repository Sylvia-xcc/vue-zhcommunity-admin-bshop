<template>
    <div class="" style="width:400px;">
        <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px">
            <el-form-item
                label="属性名称"
                prop="attr_name"
                :rules="[{ required: true, message: '请输入属性名称名称', trigger: 'blur' }]"
            >
                <el-input v-model="ruleForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item
                label="排序"
                prop="sort"
                :rules="[
      { required: true, message: '排序不能为空'},
      { type: 'number', message: '排序必须为数字值'}
    ]"
            >
                <el-input type="age" v-model.number="ruleForm.sort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { addAttribute } from "@/api/product";
const defaultForm = {
  attr_name: "", // 属性名称
  sort: 99
};
export default {
  name: "AttributeAdd",
  data() {
    var validateRequire = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(rule.field + "为必传项"));
      }
    };
    return {
      ruleForm: Object.assign({}, defaultForm)
    };
  },
  methods: {
    submitForm() {
      console.log("----------submit", this.ruleForm);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addAttribute(this.ruleForm).then(res => {
            this.$notify({
              title: "成功",
              message: "属性添加成功",
              type: "success",
              duration: 2000
            });
            this.$refs.ruleForm.resetFields();
            this.$router.push({ path:'list'})
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
