<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="all"></el-tab-pane>
      <el-tab-pane label="待付款" name="pay"></el-tab-pane>
      <el-tab-pane label="待使用" name="use"></el-tab-pane>
      <el-tab-pane label="待评价" name="evaluate"></el-tab-pane>
      <el-tab-pane label="退款/售后" name="refund"></el-tab-pane>
    </el-tabs>
    <div style="padding:20px 0 0 20px; margin-bottom:10px;">
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formInline.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop="order_sn">
          <el-input v-model="formInline.order_sn" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="isLoading"
      :data="list"
      border=""
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="产品信息">
        <template slot-scope="scope">
          <div class="flex-center">
            <div>
              <el-image
                style="width: 50px; height: 50px; border-radius:4px; "
                :src="scope.row.goods_thumb"
                fit="fit"
                :preview-src-list="[scope.row.goods_thumb]"
              ></el-image>
            </div>
            <span style="padding-left:10px;">{{ scope.row.goods_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="订单金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="手机号">
        <template slot-scope="scope">
          <div>{{ scope.row.nickname }}</div>
          <div style="font-size:12px; color:#666;">{{ scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column width="180px" label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" width="180">
        <template slot-scope="scope">
          <div>
            <span>付款状态：</span>
            <el-tag type="info" size="mini" v-if="scope.row.pay_status==0">待付款</el-tag>
            <el-tag type="success" size="mini" v-if="scope.row.pay_status==1">已付款</el-tag>
          </div>
          <div class="margin-top-xs">
            <span>订单状态：</span>
            <el-tag type="info" size="mini" v-if="scope.row.status==0">未使用</el-tag>
            <el-tag type="warning" size="mini" v-if="scope.row.status==1">已使用</el-tag>
            <el-tag type="success" size="mini" v-if="scope.row.status==2">交易完成</el-tag>
          </div>
          <div class="margin-top-xs" v-if="scope.row.refund_status==1">
            <span>退款状态：</span>
            <el-tag type="danger" size="mini" >已退款</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/restaurant/restaurant-detail/'+scope.row.id">
            <el-button type="text" size="small">查看</el-button>
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
          <template v-if="scope.row.pay_status==1 && scope.row.status==0 && scope.row.refund_status==0">
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              size="small"
              style="color:red;"
              @click="refundTap(scope.row.id)"
            >退款</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit.sync="count"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listFoodOrder, delFoodOrder, refundFoodOrder } from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductFoodOrderList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "1": "普通订单",
        "2": "积分订单"
      };
      return statusMap[status];
    },
    payFilter(status) {
      const statusMap = {
        weixin: "微信支付",
        cash: "余额支付"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      isLoading: true,
      page: 1,
      count: 20,
      formInline: {
        mobile: "",
        order_sn: "",
        begin_time: "",
        end_time: ""
      },
      activeName: "all"
    };
  },
  created() {
    console.log("--------------- created");
    this.getList();
  },
  watch() {
    console.log("--------------- watch");
  },
  methods: {
    getList() {
      console.log("--------- activeName:", this.activeName);
      this.isLoading = true;
      let data = {
        page: this.page,
        count: this.count,
      };
      if(this.formInline.mobile!='')
        data.mobile = this.formInline.mobile;
      if(this.formInline.order_sn!='')
        data.order_sn = this.formInline.order_sn;
      if(this.formInline.begin_time!='')
        data.begin_time = this.formInline.begin_time;
      if(this.formInline.end_time!='')
        data.end_time = this.formInline.end_time;
      // if(this.activeName!='60')
      data.type = this.activeName;
      listFoodOrder(data).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    delTap(id) {
      this.$confirm("确定要删除？")
        .then(res => {
          console.log("--------- 删除商品", id);
          delFoodOrder({ id: id }).then(ress => {
            this.$message.success("订单删除成功！");
            this.getList();
          });
        })
        .catch(res => {});
    },
    refundTap(id) {
      this.$confirm("确定要退款？")
        .then(res => {
          console.log("--------- 退款商品", id);
          refundFoodOrder({ id: id }).then(ress => {
            this.$message.success("订单退款成功！");
            this.getList();
          });
        })
        .catch(res => {});
    },
    onSubmit() {
      console.log("submit:", this.formInline);
      this.page = 1;
      this.getList();
    },
    onReset() {
      this.$refs.formInline.resetFields();
      this.page = 1;
      this.getList();
    },
    handleClick(tab, event) {
      this.page = 1;
      this.getList();
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
