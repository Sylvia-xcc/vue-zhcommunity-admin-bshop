<template>
  <div style="padding:30px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="模板名称" prop="name" style="width:350px;" :required="true">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="计价方式" :required="true">
        <el-radio-group v-model="form.valuation_type">
          <el-radio :label="1">件数</el-radio>
          <el-radio :label="2">重量</el-radio>
          <el-radio :label="3">体积</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运送方式" :required="true">
        <el-radio-group v-model="form.transport_type">
          <el-radio :label="1">快递</el-radio>
          <el-radio :label="2">物流</el-radio>
          <el-radio :label="3">EMS</el-radio>
          <el-radio :label="3">平邮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="派送地区" :required="true">
        <el-button type="warning" size="mini" @click="dialogRegionVisible = true">增加派送地址</el-button>
        <span style="color:#909399;">未设置运费的地区，为不派送范围</span>
      </el-form-item>
      <el-table :data="form.list" border="" style="width: 100%">
        <el-table-column prop="date" label="派送地区" min-width="300">
          <template slot-scope="scope">
            <span v-for="(province,index) in scope.row.cities" :key="province.id">
              <span v-if="index>0">、</span>
              {{ province.name }}
              <span
                style="color:#909399; font-size:12px;"
                v-if="province.selected.length<province.child.length"
              >
                <span>(</span>
                <span v-for="(city,index) in province.selected" :key="city.id">
                  <span v-if="index>0">、</span>
                  {{city.name}}
                </span>
                <span>)</span>
              </span>
            </span>
            <div style="text-align:right;">
              <el-button type="text" size="small" @click="editTemplateTap(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="delTemplateTap(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="首件(个) / 首重(kg) / 首体积(m³)" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.first_num"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运费（元）" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.first_price"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="续件(个) / 续重(kg) / 续体积(m³)" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.second_num"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="运费（元）" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.second_price"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item style="margin-top:50px;">
        <el-button type="primary" @click="onSubmit" v-if="!isEdit">立即创建</el-button>
        <el-button type="danger" @click="onSubmit" v-else>保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择可配送区域" :visible.sync="dialogRegionVisible" width="70%" @close="closeDialog">
      <div style="padding:10px 20px; margin-bottom:10px; text-align:right; background:#eee;">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
      <el-checkbox-group
        v-model="checkedCities"
        @change="handleCheckedCitiesChange"
        class="checkbox"
        v-if="cities.length>0"
      >
        <div class="checkbox-item" v-for="city in cities" :key="city.id">
          <el-popover placement="top" width="300" trigger="hover" v-model="city.visible">
            <el-checkbox-group v-model="city.selected" @change="handleCheckCityChange">
              <el-checkbox
                v-for="item in city.child"
                :label="item"
                :key="item.id"
                style="margin-bottom:5px;"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox slot="reference" style="padding:5px 10px;" :label="city">
              {{city.name}}
              <span
                style="color:red;"
                v-if="city.selected.length>0"
              >({{city.selected.length}})</span>
            </el-checkbox>
          </el-popover>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addTemplateTap">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  freightCity,
  freightAdd,
  freightDetail,
  freightEdit
} from "@/api/freight";
import { deepClone } from "@/utils/index.js";

const defaultForm = {
  name: "", // 模板名称
  valuation_type: 1,
  transport_type: 1,
  list: [],
  id: undefined
};
export default {
  name: "FreightDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: deepClone(defaultForm), //Object.assign({}, defaultForm),
      dialogRegionVisible: false,
      checkAll: false,
      checkedCities: [],
      cities: [],
      cityOptions: [],
      template: null,
      rules: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.freightDetail(id);
    }
    this.getCityList();
    console.log("----------------- created:", this.form, defaultForm);
  },
  methods: {
    freightDetail(id) {
      freightDetail(id).then(res => {
        let list = res.tranList;
        let temp = [];
        for (let i = 0; i < list.length; i++) {
          let res = {
            first_num: list[i].first_num,
            first_price: list[i].first_price,
            second_num: list[i].second_num,
            second_price: list[i].second_price,
            id: list[i].id,
            cities: JSON.parse(list[i].region_ext)
          };
          temp.push(res);
        }
        this.form = {
          id: res.id,
          name: res.name,
          transport_type: res.transport_type,
          valuation_type: res.valuation_type,
          list: temp
        };
      });
    },
    getCityList() {
      freightCity().then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].visible = false;
          res[i].selected = [];
        }
        this.cityOptions = deepClone(res);
        this.cities = res;
      });
    },
    onSubmit() {
      console.log("-----submit:", this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          let list = this.form.list;
          if(list.length<=0)
          {
            this.$message.warning('请添加至少一条可配送地区数据');
            return;
          }
          let res = [];
          for (let i = 0; i < list.length; i++) {
            let obj = {
              first_num: list[i].first_num,
              first_price: list[i].first_price,
              second_num: list[i].second_num,
              second_price: list[i].second_price,
              region_ext: JSON.stringify(list[i].cities),
              region: this.getCitiesNums(list[i].cities)
            };
            res.push(obj);
          }
          let data = {
            name: this.form.name,
            valuation_type: this.form.valuation_type,
            transport_type: this.form.transport_type,
            tranList: JSON.stringify(res)
          };
          if (this.isEdit) {
            data.id = this.form.id;
            freightEdit(data).then(res => {
              this.$message.success("修改成功");
            });
          } else {
            freightAdd(data).then(res => {
              this.$message.success("添加成功");
              // 调用全局挂载的方法
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由
              this.$router.go(-1);
            });
          }
        } else {
          return false;
        }
      });
    },

    getCitiesNums(list) {
      let tmp = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].selected.length; j++) {
          tmp.push(list[i].selected[j].id);
        }
      }
      return tmp.join(",");
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.handleCheckedCitiesChange();
    },
    handleCheckedCitiesChange() {
      for (let i = 0; i < this.cities.length; i++) {
        let item = this.cities[i];
        if (this.haveSelected(item, this.checkedCities) > -1) {
          // console.log('------name:',item.name)
          item.selected = item.selected.length > 0 ? item.selected : item.child;
        } else {
          item.selected = [];
        }
      }
      // console.log("----------- ", this.checkedCities,this.cities);
    },
    handleCheckCityChange(value) {
      // console.log("----------- city:", value);
      let temp = [];
      for (let i = 0; i < this.cities.length; i++) {
        let item = this.cities[i];
        if (item.selected.length > 0) {
          temp.push(item);
        }
      }
      this.checkedCities = temp;
    },

    haveSelected(item, list) {
      for (let i = 0; i < list.length; i++) {
        if (item.id == list[i].id) return i;
      }
      return -1;
    },
    closeDialog() {
      this.template = null;
      this.checkedCities = [];
      this.cities = deepClone(this.cityOptions);
      this.dialogRegionVisible = false;
    },
    addTemplateTap() {
      if (this.template == null) {
        let obj = {
          cities: this.checkedCities,
          first_num: "1",
          first_price: "0.00",
          second_num: "1",
          second_price: "0.00",
          id: Date.now()
        };
        this.form.list.push(obj);
      } else {
        for (let i = 0; i < this.form.list.length; i++) {
          if (this.form.list[i].id == this.template.id) {
            this.form.list[i].cities = this.checkedCities;
          }
        }
      }

      this.closeDialog();
      // console.log("----------- form", this.form.list);
    },

    delTemplateTap(id) {
      console.log("---------- 删除模块", id);
      let list = this.form.list;
      let temp = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].id != id) temp.push(list[i]);
      }
      this.form.list = temp;
    },

    editTemplateTap(value) {
      console.log("----------- 编辑模块：", value.cities);
      this.template = value;
      this.checkedCities = [];
      for (let i = 0; i < this.cities.length; i++) {
        let item = this.cities[i];
        let index = this.haveSelected(item, value.cities);
        if (index > -1) {
          let item2 = value.cities[index];
          // item.selected = item2.selected;
          let selected = [];
          for (let j = 0; j < item.child.length; j++) {
            let ii1 = item.child[j];
            if (this.haveSelected(ii1, item2.selected) > -1) {
              selected.push(ii1);
            }
          }
          item.selected = selected;
          this.checkedCities.push(item);
        }
      }
      this.handleCheckedCitiesChange();
      this.dialogRegionVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.checkbox {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  .checkbox-item {
    flex-basis: 25%;
    margin: 10px 0;
  }
}
</style>

