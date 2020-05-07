<template>
  <div style="padding:30px; padding-bottom:150px;">

    <el-steps :active="detail.back | backFilter" align-center  style="margin-top:20px;" v-if="detail.back>0">
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
    </el-steps>
  
    <el-button type="danger" plain @click="changeStatus" class="margin-tb">变更状态</el-button>

    <div class="title" style="margin-top:20px;">基本信息</div>
    <el-table :data="[1]" border="" fit highlight-current-row style="width: 100%; margin-top:20px;">
      <el-table-column align="center" label="订单号" width="200">
        <template slot-scope="scope">
          <span>{{ detail.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="买家">
        <template slot-scope="scope">
          <div >{{ user.nickname }}</div>
          <div style="font-size:12px; color:#666;">(用户id：{{ user.id }})</div>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="订单金额">
        <template slot-scope="scope">
          <div><span>订单总额：</span><span>￥{{detail.price}}</span></div>
          <div><span>运费金额：</span><span>￥{{detail.express_money}}</span></div>
          <div><span>实付款金额：</span><span style="color:red">￥{{detail.amount}}</span></div>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="支付方式">
          <el-tag size="small">{{ detail.pay_type | payFilter}}</el-tag>
      </el-table-column>
      <el-table-column width="120px" align="center" label="交易状态">      
          <el-tag size="small" type="danger" effect="plain" v-if="detail.back==2">退款成功</el-tag>    
          <el-tag size="small" type='danger' v-else-if="detail.status==10">{{ detail.status_desc}}</el-tag>
          <el-tag size="small" type='success' v-else-if="detail.status==50">{{ detail.status_desc}}</el-tag>
          <el-tag size="small" type="danger" effect="plain" v-else-if="detail.status==0">交易关闭</el-tag>
          <el-tag size="small" type='warning' v-else>{{ detail.status_desc}}</el-tag>
          <div v-if="detail.back==0&&detail.status==0"  class="text-xs">({{ detail.status_desc||'订单取消' }})</div>
      </el-table-column>
    </el-table>

    <div class="title" style="margin-top:40px;">商品信息</div>
    <el-table v-loading="isLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top:20px;" >
      <el-table-column label="产品ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="产品名称">
        <template slot-scope="scope">
          <div class="flex-center">
            <div>
              <el-image style="width: 50px; height: 50px; border-radius:4px; " :src="scope.row.pro_thumb" fit="fit" :preview-src-list="[scope.row.pro_thumb]"></el-image>
            </div>
            <span style="padding-left:10px;">{{ scope.row.pro_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="产品属性">
        <template slot-scope="scope">
          <span>{{ scope.row.pro_buff==''?'--': scope.row.pro_buff}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="单价">
        <template slot-scope="scope">
          <span>￥{{ scope.row.pro_price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="购买数量">
        <template slot-scope="scope">
          <span>x{{ scope.row.pro_num }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="总价">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="shopAll">
      <span>买家留言：{{detail.remark==''?'无':detail.remark}}</span>
      <span>总计金额：￥{{detail.amount}}</span>
    </div>

    <div class="title" style="margin-top:20px;">收货信息</div>
    <el-table :data="[1]" border="" fit highlight-current-row style="width: 100%; margin-top:20px;">
      <el-table-column align="center" label="收货人" width="200">
        <template slot-scope="scope">
          <span>{{ detail.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="收货电话">
        <template slot-scope="scope">
          <div >{{ detail.tel }}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="收货地址">
        <template slot-scope="scope">
          <span>{{ detail.address_xq }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="detail.status>=20">
      <div class="title" style="margin-top:20px;">发货信息</div>
      <el-table :data="[1]" border="" fit highlight-current-row style="width: 100%; margin-top:20px;">
        <el-table-column align="center" label="物流公司" width="300">
          <template slot-scope="scope">
            <el-select v-model="kuaidi_id" placeholder="请选择快递公司" v-if="detail.status==20">
              <el-option
                v-for="item in expressList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <span v-else>{{ detail.kuaidi_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="物流单号">
          <template slot-scope="scope">
            <el-input v-if="detail.status==20" v-model="kuaidi_number"/>
            <div v-else>{{ detail.kuaidi_number }}</div>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="发货状态">
          <template slot-scope="scope">
            <el-tag size="small" type="warning" effect="dark" v-if="detail.status==20">待发货</el-tag>
            <el-tag size="small" type="success" effect="dark" v-else>已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" align="center" label="发货时间">
          <template slot-scope="scope">
            <span>{{detail.delivery_time || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
       <el-button type="primary" @click="onToDelivery" v-if="detail.status==20" style="margin:30px;">发货</el-button>
    </div>

    <el-link v-if="detail.status>20" style="margin:30px;" :underline="false" :href="pathUrl" target="_blank"><el-button type="primary">快递查询</el-button> </el-link>
    

    
    <el-dialog title="变更状态" :visible.sync="statusVisible" width="30%">
          <span style="margin-left:30px;">状态：</span>
          <el-select v-model="status" placeholder="请选择订单状态">
            <el-option label="待付款" :value="10"/>
            <!-- <el-option label="交易关闭" :value="0"/> -->
            <el-option label="待发货" :value="20"/>
            <el-option label="待收货" :value="30"/>
            <el-option label="已收货" :value="40"/>
            <el-option label="交易完成" :value="50"/>
          </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailOrder, editOrder, deliveryOrder, listExpress } from "@/api/product";
export default {
  name: "ProductOrderDetail",
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
  computed:{
        pathUrl: function () {
            return 'https://www.kuaidi100.com/chaxun?com='+this.detail.kuaidi_info.code+'&nu='+this.detail.kuaidi_number
        }
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
      kuaidi_id:'',
      kuaidi_name:'',
      kuaidi_number:'',
      isLoading: true,
      statusVisible:false,
      status:'',
      expressList:[],
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
    this.loadExpressList();
  },
  methods: {
    fetchData(id) {
      this.isLoading = true;
      detailOrder(id)
        .then(res => {
          console.log("-----------edit order: ", res);
          this.list = res.productList;
          this.detail = res.item;
          this.detail.order_sn =
            res.item.order_sn == null ? "" : res.item.order_sn;
          this.user = res.userInfo;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },

    loadExpressList(){
      listExpress().then(res=>{
        this.expressList = res.list;
      })
    },

    seeTap(){
      window.location.href = 'https://www.kuaidi100.com/chaxun?com='+this.detail.kuaidi_info.code+'&nu='+this.detail.kuaidi_number
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
      console.log('------ 物流：', this.kuaidi_id, this.kuaidi_number)
      if(this.kuaidi_id<=0){
        this.$message.warning('请选择物流公司');
        return;
      }
      if(this.kuaidi_number==''){
        this.$message.warning('请填写物流单号');
        return;
      }
      let data = {
        order_id: this.detail.id,
        kuaidi_id:this.kuaidi_id,
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
