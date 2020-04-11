<template>
    <div style="padding:30px">
        <el-card class="content" >
            <div class="title">基本信息</div>
            <div class="flex justify-between" style="width:50%;">
                <div class="card-panel flex align-center">
                    <div class="card-panel-icon-wrapper">
                        <svg-icon icon-class="purse" class-name="card-panel-icon"/>
                    </div>
                    <div class="padding-left-sm">
                        <div class="text-sm text-gray padding-bottom-xs">可提现金额(元)</div>
                        <div class="text-xxl">{{cash}}</div>
                    </div>
                </div>
                <div class="card-panel flex align-center margin-left-xl">
                    <div class="card-panel-icon-wrapper">
                        <svg-icon icon-class="money" class-name="card-panel-icon2"/>
                    </div>
                    <div class="padding-left-sm">
                        <div class="text-sm text-gray padding-bottom-xs">总盈利金额(元)</div>
                        <div class="text-xxl">{{money}}</div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="margin-top">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="提现金额" :required="true">
                    <el-input type="number" v-model="form.money" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item label="提现描述" >
                    <el-input type="textarea" v-model="form.desc" style="width:400px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提现</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="margin-top">
            <div class="title">提现明细</div>
            <el-table :data="list" border="" fit highlight-current-row style="width: 100%" align="left">
                <el-table-column align="left" label="ID" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="150px" align="left" label="金额">
                    <template slot-scope="scope">
                        <span>￥{{ scope.row.money}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="200px" align="left" label="描述">
                    <template slot-scope="scope">
                        <span>{{ scope.row.desc}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="200px" align="left" label="提交时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100px" align="left" label="审核">
                    <template slot-scope="scope">
                        <el-tag size="small"  v-if="scope.row.status==0" >{{ scope.row.status | statusFilter}}</el-tag>
                        <el-tag size="small" type="success" v-else-if="scope.row.status==1" >{{ scope.row.status | statusFilter}}</el-tag>
                        <el-tag size="small" type="danger" v-else>{{ scope.row.status | statusFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="100px" align="left" label="状态">
                    <template slot-scope="scope">
                        <el-tag size="small" type="info">{{ scope.row.pay_status | payFilter}}</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="getList" />
        </el-card>
       
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { cashoutList, cashoutAdd } from "@/api/cashout";

export default {
  name: "StoreCashoutList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "0": "审核中",
        "1": "通过",
        "2": "失败"
      };
      return statusMap[status];
    },
    payFilter(status) {
      const statusMap = {
        "0": "未到账",
        "1": "已到账"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      isLoading: true,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        count: 20
      },
      form: {
        money: "0.00",
        desc: ""
      }
    };
  },
  computed:{
    cash(){
      return this.$store.getters.cash || '0.00';
    },
    money(){
      return this.$store.getters.money || '0.00';
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      cashoutList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    onSubmit() {
      let money = parseFloat(this.form.money);
      console.log('---------- money', money)
      if(money<=0){
          this.$message.warning('请输入提现金额')
          return;
      }
      if(money > this.cash){
          this.$message.warning('超出可提现金额上限')
          return;
      }
      cashoutAdd(this.form).then(res => {
        this.$message.success("提交成功");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.card-panel{
    .card-panel-icon-wrapper{
        margin: 30px 0;
        width:50px;
        height:50px;
        border-radius: 50%;
        line-height: 60px;
        text-align: center;
        vertical-align: middle;
        background: rgba($color: #1890ff, $alpha: 0.2);
        .card-panel-icon{
            font-size:32px;
            color: #1890ff;
            opacity: 0.8;
        }
        .card-panel-icon2{
            font-size:24px;
            color: #1890ff;
            opacity: 0.8;
        }
    }
}
</style>


