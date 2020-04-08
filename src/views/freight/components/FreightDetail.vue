<template>
    <div style="">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="模板名称" style="width:350px;" :required="true">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="计价方式" :required="true">
                <el-radio-group v-model="form.valuation_type">
                    <el-radio label="1">件数</el-radio>
                    <el-radio label="2">重量</el-radio>
                    <el-radio label="3">体积</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="运送方式" :required="true">
                <el-radio-group v-model="form.transport_type">
                    <el-radio label="1">快递</el-radio>
                    <el-radio label="2">物流</el-radio>
                    <el-radio label="3">EMS</el-radio>
                    <el-radio label="3">平邮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="派送地区" :required="true">
                <el-button type="warning" size="mini"  @click="dialogRegionVisible = true">增加派送地址</el-button>
                <span style="color:#909399;">未设置运费的地区，为不派送范围</span>
            </el-form-item>
            <el-table :data="form.list" border="" style="width: 100%">
                <el-table-column prop="date" label="派送地区" min-width="300">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="首件(个) / 首重(kg) / 首体积(m³)" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="运费（元）" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="续件(个) / 续重(kg) / 续体积(m³)" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="运费（元）" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择可配送区域" :visible.sync="dialogRegionVisible">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="checkbox" v-if="cities.length>0">
                <div class="checkbox-item" v-for="city in cities" :label="city.name" :key="city.id">
                    <el-popover placement="top" width="300" trigger="hover" v-model="city.visible">
                        <el-checkbox-group v-model="city.selected">
                            <el-checkbox
                                v-for="item in city.child"
                                :label="item.name"
                                :key="item.id"
                            >{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox slot="reference" style="padding:10px;">{{city.name}}</el-checkbox>
                    </el-popover>
                </div>
            </el-checkbox-group>
        </el-dialog>
    </div>
</template>

<script>
import { freightCity } from "@/api/freight";

const defaultForm = {
  name: "", // 模板名称
  valuation_type: "1",
  transport_type: "1",
  list: [
    {
      region: "",
      first_num: "1",
      first_price: "0",
      second_num: "1",
      second_price: "0"
    }
  ]
};
const cityOptions = [
  {
    value: "上海",
    id: 1,
    visible: false,
    child: [{ value: "浦东", id: 101 }, { value: "徐汇", id: 102 }],
    selected: []
  },
  {
    value: "江苏",
    id: 2,
    visible: false,
    child: [
      { value: "南京", id: 201 },
      { value: "无锡", id: 202 },
      { value: "苏州", id: 203 },
      { value: "扬州", id: 205 },
      { value: "镇江", id: 204 }
    ],
    selected: []
  }
];
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
      form: Object.assign({}, defaultForm),
      dialogRegionVisible: false,
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      visible: false
    };
  },
  created() {
    this.getCityList();
  },
  methods: {
    getCityList() {
      freightCity().then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].visible = false;
          res[i].selected = [];
        }
        console.log("----------- city", res);
        this.cities = res;
      });
    },
    addRegionTap() {},
    onSubmit() {
      console.log("-----submit:", this.form);
    },

    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
        console.log('--------------- value', value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.checkbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .checkbox-item{
      flex-basis: 30%;
      margin: 10px 0;
  }
}
</style>

