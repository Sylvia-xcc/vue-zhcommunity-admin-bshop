<template>
    <div style="padding:30px;">
        <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="产品名称">
                <div>{{detail.name}}</div>
            </el-form-item>
            <el-form-item label="产品价格">
                <div>{{detail.price_yh}}</div>
            </el-form-item>
            <el-form-item label="库存">
                <div>{{detail.stock}}</div>
            </el-form-item>
            <el-form-item label="属性规格设置">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox
                        v-for="item in list"
                        :key="item.id"
                        :label="item.attr_name"
                        @change="changeTap(item)"
                    >{{item.attr_name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <CreateAttribute
                v-for="item in form.list"
                :key="item.id"
                v-model="item.list"
            ></CreateAttribute>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { fetchProduct, listAttribute } from "@/api/product";
import CreateAttribute from "./components/CreateAttribute";
export default {
  name: "ProductManage",
  components: { CreateAttribute },
  data() {
    return {
      detail: null,
      list: null,
      form: {
        type: [],
        list: []
      }
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
    this.getList();
  },
  methods: {
    fetchData(id) {
      fetchProduct(id)
        .then(res => {
          console.log("-----------edit product: ", res);
          this.detail = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList() {
      this.isLoading = true;
      listAttribute().then(res => {
        this.list = res;
      });
    },
    onSubmit() {
      console.log("----submit:", this.form);
    },
    addDomain() {
      this.form.list.push({
        value: "",
        key: "尺寸"
      });
    },
    changeTap(val) {
      let list = this.form.list;
      console.log("-------------->>>> ", val, list);
      let have = false;
      let index = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == val.id) {
          have = true;
          index = i;
          break;
        }
      }
      console.log("---------- have:", have);
      if (!have) {
        val.list = [{ key: "1", value: "" }];
        this.form.list.push(val);
        // this.form = Object.assign({}, this.form, val);
      } else {
        this.form.list.splice(index, 1);
      }
    },

    updateAttribute(obj) {
      console.log("-------- update222:", obj);
      let list = this.form.list;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == obj.id) {
          list[i] = obj;
        }
      }
      this.form.list = list;
    //   this.form = Object.assign({}, this.form);
      // this.form = Object.assign({},this.form, this.form2);
      this.$forceUpdate();
      console.log(this.form);
    }
  }
};
</script>

