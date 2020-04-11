<template>
    <div class="app-container">
        <div style="background:#eee; padding:20px 0 0 20px; margin-bottom:30px;">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
                <el-form-item label="用户名" prop="nickname">
                    <el-input v-model="formInline.nickname" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="订单编号" prop="order_sn">
                    <el-input v-model="formInline.order_sn" placeholder="订单编号"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="begin_time">
                    <el-date-picker
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formInline.begin_time"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" style="margin-right:50px;" prop="end_time">
                    <el-date-picker
                        type="datetime"
                        placeholder="选择结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formInline.end_time"
                    ></el-date-picker>
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
            <el-table-column width="120px" label="订单编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.order_sn }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" label="买家">
                <template slot-scope="scope">
                    <div>{{ scope.row.userInfo.nickname }}</div>
                    <div style="font-size:12px; color:#909399;">(用户ID:{{ scope.row.userInfo.id }})</div>
                </template>
            </el-table-column>
            <el-table-column min-width="250px" align="left" label="产品信息">
                <template slot-scope="scope">
                    <div style="display:flex">
                        <div>
                            <el-image
                                style="width: 50px; height: 50px; border-radius:4px; "
                                :src="scope.row.pro_thumb"
                                fit="fit"
                                :preview-src-list="[scope.row.pro_thumb]"
                            ></el-image>
                        </div>
                        <span style="padding-left:10px;">{{ scope.row.pro_name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="180px" label="团购状态">
                <template slot-scope="scope">
                    <span style="color:#409EFF" v-if="scope.row.pintuan_status==0">{{ scope.row.pintuan_status | statusFilter}}</span>
                    <span style="color:#67C23A" v-else-if="scope.row.pintuan_status==1">{{ scope.row.pintuan_status | statusFilter}}</span>
                    <span style="color:#F56C6C" v-else>{{ scope.row.pintuan_status | statusFilter}}</span>
                    <span>（拼团ID:{{scope.row.pintuan_id}}）</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" label="订单金额">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.pay_money }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" label="支付方式">
                <template slot-scope="scope">
                    <!-- <span>{{ scope.row.pay_type | payFilter }}</span> -->
                    <el-tag size="mini">{{ scope.row.pay_type | payFilter }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="180px" label="下单时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.addtime }}</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="订单状态" width="110">
                <template slot-scope="scope">
                    <div v-if="scope.row.back==1" class="text-blue">退款中</div>
                    <div v-else-if="scope.row.back==2"  class="text-red">退款成功</div>
                    <div v-else class="text-green">{{scope.row.status | orderStatusFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                    <router-link :to="'/assemble/assemble-order-detail/'+scope.row.id">
                        <el-button type="text" size="small">查看</el-button>
                    </router-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
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
import { assembleOrderList } from "@/api/assemble";
import Pagination from "@/components/Pagination";
export default {
  name: "ProductOrderList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
          "0": "进行中",
        "1": "拼团成功",
        "2": "拼团失败"
      };
      return statusMap[status];
    },
    payFilter(status) {
      const statusMap = {
        weixin: "微信支付",
        cash: "余额支付"
      };
      return statusMap[status];
    },
    orderStatusFilter(status) {
      const statusMap = {
        "20": "待发货",
        "30": "待收货",
        "40": "已收货",
        "50": "交易完成"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: true,
      page: 1,
      count: 20,
      formInline: {
        nickname: "",
        order_sn: "",
        begin_time: "",
        end_time: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      let data = {
        page: this.page,
        count: this.count
      };
      assembleOrderList(data).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    delTap(id) {
      this.$confirm("确定要删除？")
        .then(res => {
          console.log("--------- 删除商品", id);
          delOrder({ id: id }).then(ress => {
            this.$message.success("订单删除成功！");
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

</style>


