<template>
  <div style="padding:30px; padding-bottom:150px;">

    <!-- <el-steps :active="detail.back | backFilter" align-center  style="margin-top:20px;" v-if="detail.back>0">
      <el-step title="下单时间" :description="detail.addtime"></el-step>
      <el-step title="退款中" ></el-step>
      <el-step title="退款成功" :description="detail.refund_time||''"></el-step>
    </el-steps>
    
    <el-steps :active="detail.status | overFilter" align-center style="margin-top:20px;" v-else-if="detail.status<10">
      <el-step title="下单时间" :description="detail.addtime"></el-step>
      <el-step title="交易关闭" ></el-step>
    </el-steps>

    <el-steps :active="detail.status | activeFilter" align-center  style="margin-top:20px;" v-else>
      <el-step title="下单时间" :description="detail.addtime"></el-step>
      <el-step title="付款" :description="detail.pay_time||''"></el-step>
      <el-step title="发货" :description="detail.delivery_time||''"></el-step>
      <el-step title="收货" :description="detail.receive_time || ''"></el-step>
      <el-step title="完成" :description="detail.complete_time || ''"></el-step>
    </el-steps> -->
  

    <div class="title" style="margin-top:20px;">基本信息</div>
    <el-table :data="[1]" border="" fit highlight-current-row style="width: 100%; margin-top:20px;">
      <el-table-column align="center" label="订单号" width="200">
        <template slot-scope="scope">
          <span>{{ detail.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="买家">
        <template slot-scope="scope">
          <div >{{ detail.mobile }}</div>
          <div style="font-size:12px; color:#666;">(用户id：{{ detail.user_id }})</div>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <div><span>订单总额：</span><span>￥{{detail.money}}</span></div>
          <div><span>实付款金额：</span><span style="color:red">￥{{detail.pay_money}}</span></div>
          <div v-if="detail.trade_no"><span>交易单号：</span><span >{{detail.trade_no}}</span></div>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="支付方式">
          <el-tag size="small">微信支付</el-tag>
      </el-table-column>
      <el-table-column width="200px" align="center" label="交易状态" >     
          <div>
            <span>付款状态：</span>
            <el-tag type="info" size="mini" v-if="detail.pay_status==0">待付款</el-tag>
            <el-tag type="success" size="mini" v-if="detail.pay_status==1">已付款</el-tag>
          </div>
          <div class="margin-top-xs">
            <span>订单状态：</span>
            <el-tag type="info" size="mini" v-if="detail.status==0">未使用</el-tag>
            <el-tag type="warning" size="mini" v-if="detail.status==1">已使用</el-tag>
            <el-tag type="success" size="mini" v-if="detail.status==2">交易完成</el-tag>
          </div>
          <div class="margin-top-xs" v-if="detail.refund_status==1">
            <span>退款状态：</span>
            <el-tag type="danger" size="mini" >已退款</el-tag>
          </div>
      </el-table-column>
    </el-table>

    <div class="title" style="margin-top:40px;">商品信息</div>
    <el-table v-loading="isLoading" :data="[1]" border fit highlight-current-row style="width: 100%; margin-top:20px;" >
      <el-table-column label="产品ID" width="80">
        <template slot-scope="scope">
          <span>{{ detail.goods_id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="产品名称">
        <template slot-scope="scope">
          <div class="flex-center">
            <div>
              <el-image style="width: 50px; height: 50px; border-radius:4px; " :src="detail.goods_thumb" fit="fit" :preview-src-list="[detail.goods_thumb]"></el-image>
            </div>
            <span style="padding-left:10px;">{{ detail.goods_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="单价">
        <template slot-scope="scope">
          <span>￥{{ detail.goods_price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="购买数量">
        <template slot-scope="scope">
          <span>x{{ detail.goods_num }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="总价">
        <template slot-scope="scope">
          <span>￥{{ detail.money }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="shopAll">
      <span></span>
      <span>总计金额：￥{{detail.money}}</span>
    </div>
    
    
  </div>
</template>

<script>
import { detailFoodOrder, editOrder, deliveryOrder } from "@/api/product";
export default {
  name: "ProductFoodOrderDetail",
  filters: {
    statusFilter(status) {
      const statusMap = {
        '10': '待付款',
        '20': '待发货',
        '30': '待收货',
        '40': '已收货',
        '50': '交易完成',
      }
      return statusMap[status]
    },
    payFilter(status) {
      const statusMap = {
        'weixin': '微信支付',
        'cash': '余额支付'
      }
      return statusMap[status]
    },
    activeFilter(status){
      return Math.floor(status/10);
    },
    backFilter(status){
      return parseInt(status)+1;
    },
    overFilter(status){
      return parseInt(status)+2;
    },
  },
  data() {
    return {
      detail: {
        order_sn: ""
      },
      list: [],
      user: {
        nickname: ""
      },
      kuaidi_name:'',
      kuaidi_number:'',
      isLoading: true,
      statusVisible:false,
      status:''
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    fetchData(id) {
      this.isLoading = true;
      detailFoodOrder(id)
        .then(res => {
          console.log("-----------edit order: ", res);
          this.detail = res
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    onSubmit() {
      console.log("----submit:", this.detail);
      let data = {
        order_id: this.detail.id,
        status: this.detail.status,
        kuaidi_name: this.detail.kuaidi_name,
        kuaidi_number: this.detail.kuaidi_number
      };
      editOrder(data).then(res => {
        this.$message.success("订单修改成功");
      });
    },

    onToDelivery(){
      if(this.kuaidi_name==''){
        this.$message.warning('请填写物流公司');
        return;
      }
      if(this.kuaidi_number==''){
        this.$message.warning('请填写物流单号');
        return;
      }
      let data = {
        order_id: this.detail.id,
        kuaidi_name:this.kuaidi_name,
        kuaidi_number:this.kuaidi_number,
        status:30
      }
      editOrder(data).then(res=>{
        this.$message.success('订单发货成功');
        this.fetchData(this.detail.id)
      })
    },

    onReturn() {
      // 调用全局挂载的方法
      this.$store.dispatch("tagsView/delView", this.$route);
      // 返回上一步路由
      this.$router.go(-1);
    },
    changeStatus(){
      this.statusVisible = true;
    },
    statusConfirm(){
      this.statusVisible = false;
      let data = {
        order_id: this.detail.id,
        status: this.status,
      };
      editOrder(data).then(res => {
        this.$message.success("订单修改成功");
        this.fetchData(this.detail.id)
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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
.flex-center {
  display: flex;
  // justify-content: center;
  align-items: center;
}

.shopAll{
  border: 1px solid #e6ebf5;
  border-top: none;
  padding: 10px;
  min-height: 30px;
  font-size:12px;
  color:#333;
  display: flex;
  justify-content: space-between;
}
</style>
