<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="60"/>
      <el-tab-pane label="待付款" name="10"/>
      <el-tab-pane label="待发货" name="20"/>
      <el-tab-pane label="待收货" name="30"/>
      <el-tab-pane label="已收货" name="40"/>
      <el-tab-pane label="交易完成" name="50"/>
      <el-tab-pane label="交易关闭" name="0"/>
    </el-tabs>
    <div style="padding:20px 0 0 20px; margin-bottom:10px;">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="formInline.nickname" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="订单编号" prop="order_sn">
          <el-input v-model="formInline.order_sn" placeholder="订单编号"/>
        </el-form-item>
        <!-- <el-form-item label="开始时间"  prop="begin_time">
          <el-date-picker type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="formInline.begin_time" ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" style="margin-right:50px;" prop="end_time">
            <el-date-picker type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="formInline.end_time"></el-date-picker>
        </el-form-item>-->
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
      <!-- <el-table-column min-width="80px" label="订单类型">
        <template slot-scope="scope">
          <span>{{ scope.row.order_type | statusFilter }}</span>
        </template>
      </el-table-column>-->
      <el-table-column min-width="120px" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="订单金额">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="用户名">
        <template slot-scope="scope">
          <div>{{ scope.row.nickname }}</div>
          <div style="font-size:12px; color:#666;">(用户id：{{ scope.row.uid }})</div>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="支付类型">
        <template slot-scope="scope">
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
          <el-tag v-if="scope.row.back==2" type="danger" effect="plain">退款成功</el-tag>
          <el-tag v-else-if="scope.row.back==1" type="danger" effect="plain">退款中</el-tag>
          <el-tag v-else-if="scope.row.status==10" type="danger">{{ scope.row.status_desc }}</el-tag>
          <el-tag v-else-if="scope.row.status==50" type="success">{{ scope.row.status_desc }}</el-tag>
          <el-tag v-else-if="scope.row.status==0" type="danger" effect="plain">交易关闭</el-tag>
          <el-tag v-else type="warning">{{ scope.row.status_desc }}</el-tag>
          <div
            v-if="scope.row.back==0&&scope.row.status==0"
            class="text-xs"
          >({{ scope.row.status_desc||'订单取消' }})</div>
          <!-- <span v-if="scope.row.status=='待付款'" style="color:#F56C6C">{{ scope.row.status }}</span>
          <span v-else-if="scope.row.status=='交易完成'" style="color:#67C23A">{{ scope.row.status }}</span>
          <span v-else style="color:#E6A23C">{{ scope.row.status }}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/order/detail/'+scope.row.id">
            <el-button type="text" size="small">查看</el-button>
          </router-link>
          <el-divider direction="vertical"/>
          <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
          <template v-if="scope.row.status>10 && scope.row.status<40">
            <el-divider direction="vertical"/>
            <el-button
              type="text"
              size="small"
              style="color:red;"
              @click="refundTap(scope.row.id)"
            >退款</el-button>
          </template>
          <el-divider direction="vertical"/>
          <el-button type="text" size="small" @click="printpageTap(scope.row.id)">打印</el-button>
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
    <el-dialog title="打印订单信息预览" :visible.sync="dialogVisible" width="70%">
      <div v-if="detail" id="print-context" >
        <div class="title" style="margin-top:20px; ">基本信息</div>
        <div style="border:1px solid #eef1f5; margin-top:20px;">
          <div style="display:flex; justify-content: space-between; ">
            <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">订单号</div>
            <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">买家</div>
            <div style="text-align:center; width:30%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">订单金额</div>
            <div style="text-align:center; width:15%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">支付方式</div>
            <div style="text-align:center; width:15%; min-height:40px; font-weight:bold; line-height:40px;">交易状态</div>
          </div> 
          <div style="display:flex; justify-content: space-between; border-top:1px solid #eef1f5;">
            <div style=" width:25%; display:flex; justify-content: center; align-items: center; min-height:80px;  border-right:1px solid #eef1f5;">{{ detail.item.order_sn }}</div>
            <div style="width:25%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:60px;  border-right:1px solid #eef1f5;">
              <div>{{ detail.userInfo.nickname }}</div>
              <div style="font-size:12px; color:#666;">(用户id：{{ detail.userInfo.id }})</div>
            </div>
            <div style=" width:30%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:80px;  border-right:1px solid #eef1f5;">
              <div>
                <span>订单总额：</span>
                <span>￥{{detail.item.price}}</span>
              </div>
              <div>
                <span>运费金额：</span>
                <span>￥{{detail.item.express_money}}</span>
              </div>
              <div>
                <span>实付款金额：</span>
                <span style="color:red">￥{{detail.item.amount}}</span>
              </div>
            </div>
            <div style="width:15%; display:flex; justify-content: center; align-items: center; min-height:60px;  border-right:1px solid #eef1f5; color:#1890ff;">{{ detail.item.pay_type | payFilter}}</div>
            <div style="width:15%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:60px; ">
                <div v-if="detail.item.back==2" style="color:#ff4949">退款成功</div>    
                <div v-else-if="detail.item.status==10" style="color:#ff4949">{{ detail.item.status_desc}}</div>  
                <div v-else-if="detail.item.status==50" style="color:#13ce66">{{ detail.item.status_desc}}</div>  
                <div v-else-if="detail.item.status==0" style="color:#ff4949;">交易关闭</div>  
                <div v-else style="color:#ffba00;">{{ detail.item.status_desc}}</div>  
                <div v-if="detail.item.back==0&&detail.item.status==0"  style="font-size:12px;padding-top:5px;">({{ detail.item.status_desc||'订单取消' }})</div>
            </div>
          </div> 
        </div>
        
        
        <div class="title" style="margin-top:40px;">商品信息</div>
        <div style="border:1px solid #eef1f5; margin-top:20px;">
          <div style="display:flex; justify-content: space-between; ">
            <div style="text-align:left; width:8%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5; padding-left:10px;">产品ID</div>
            <div style="text-align:left; width:42%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5; padding-left:10px;">产品名称</div>
            <div style="text-align:left; width:20%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5; padding-left:10px;">产品属性</div>
            <div style="text-align:left; width:10%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5; padding-left:10px;">单价</div>
            <div style="text-align:left; width:10%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5; padding-left:10px;">购买数量</div>
            <div style="text-align:left; width:10%; min-height:40px; font-weight:bold; line-height:40px; padding-left:10px;">总价</div>
          </div> 
          <div style="display:flex; justify-content: space-between; border-top:1px solid #eef1f5;" v-for="item in detail.productList">
            <div style=" width:8%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding-left:10px;">{{ item.id }}</div>
            <div style=" width:42%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding:0px 10px;">
              <div style="display:flex; align-items: center;">
                <img :src="item.pro_thumb" mode="scaleToFill" style="width: 50px; height: 50px; border-radius:4px; "></img>
                <span style="padding-left:10px; flex:1;">{{ item.pro_name }}</span>
              </div>
            </div>
            <div style=" width:20%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding-left:10px;">{{ item.pro_buff==''?'--': item.pro_buff}}</div>
            <div style=" width:10%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding-left:10px;">￥{{ item.pro_price }}</div>
            <div style=" width:10%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding-left:10px;">x{{ item.pro_num }}</div>
            <div style=" width:10%; display:flex; align-items: center;  min-height:80px;  border-right:1px solid #eef1f5; padding-left:10px;">￥{{ item.amount }}</div>
          </div> 
          <div style="display:flex; justify-content: space-between; padding:10px; border-top:1px solid #eef1f5; min-height:30px; font-size:12px;color:#333;">
            <span>买家留言：{{detail.item.remark==''?'无':detail.item.remark}}</span>
            <span>总计金额：￥{{detail.item.amount}}</span>
          </div> 
        </div>

        <div class="title" style="margin-top:20px;">收货信息</div>
        <div style="border:1px solid #eef1f5; margin-top:20px;">
          <div style="display:flex; justify-content: space-between; ">
            <div style="text-align:center; width:20%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">收货人</div>
            <div style="text-align:center; width:20%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">收货电话</div>
            <div style="text-align:center; width:60%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">收货地址</div>
          </div> 
          <div style="display:flex; justify-content: space-between; border-top:1px solid #eef1f5;">
            <div style=" width:20%; display:flex; justify-content: center; align-items: center; min-height:60px;  border-right:1px solid #eef1f5;">{{ detail.item.receiver }}</div>
            <div style="width:20%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:40px;  border-right:1px solid #eef1f5;"><div>{{ detail.item.tel }}</div></div>
            <div style=" width:60%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:40px;  border-right:1px solid #eef1f5;">{{ detail.item.address_xq }}</div>
          </div> 
        </div>
        <div v-if="detail.item.status>20">
          <div class="title" style="margin-top:20px;">发货信息</div>
          <div style="border:1px solid #eef1f5; margin-top:20px;">
            <div style="display:flex; justify-content: space-between; ">
              <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">物流公司</div>
              <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">物流单号</div>
              <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">发货状态</div>
              <div style="text-align:center; width:25%; min-height:40px; font-weight:bold; line-height:40px; border-right:1px solid #eef1f5;">发货时间</div>
            </div> 
            <div style="display:flex; justify-content: space-between; border-top:1px solid #eef1f5;">
              <div style=" width:25%; display:flex; justify-content: center; align-items: center; min-height:60px;  border-right:1px solid #eef1f5;">{{ detail.item.kuaidi_name }}</div>
              <div style="width:25%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:40px;  border-right:1px solid #eef1f5;"><div>{{ detail.item.kuaidi_number }}</div></div>
              <div style=" width:25%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:40px;  border-right:1px solid #eef1f5;">
                <div style="background-color: #13ce66;border-color: #13ce66;color: #fff; border-width: 1px;border-style: solid; border-radius: 4px; padding:5px; font-size: 12px;">已发货</div>
              </div>
              <div style=" width:25%; display:flex; justify-content: center; align-items: center; flex-direction: column; min-height:40px;  border-right:1px solid #eef1f5;">{{detail.item.delivery_time || '--'}}</div>
            </div> 
          </div>
        </div>
        <div style="margin-top:30px; border-top:1px solid #eef1f5; padding-top:20px; display:flex; flex-direction: column;">
          <span>下单时间：{{detail.item.addtime}}</span>
          <span style="padding-top:5px;" v-if="detail.item.back>0 && detail.item.refund_time">退款成功：{{detail.item.refund_time}}</span>
          <span style="padding-top:5px;" v-if="detail.item.pay_time">付款时间：{{detail.item.pay_time}}</span>
          <span style="padding-top:5px;" v-if="detail.item.delivery_time">发货时间：{{detail.item.delivery_time}}</span>
          <span style="padding-top:5px;" v-if="detail.item.receive_time">收货时间：{{detail.item.receive_time}}</span>
          <span style="padding-top:5px;" v-if="detail.item.complete_time">完成时间：{{detail.item.complete_time}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="printpage">打印订单信息</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, delOrder, refundOrder, detailOrder } from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductOrderList",
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
        nickname: "",
        order_sn: "",
        begin_time: "",
        end_time: ""
      },
      activeName: "60",
      dialogVisible: false,
      detail: null
    };
  },
  watch() {
    console.log("--------------- watch");
  },
  created() {
    console.log("--------------- created");
    this.getList();
  },
  methods: {
    getList() {
      console.log("--------- activeName:", this.activeName);
      this.isLoading = true;
      const data = {
        page: this.page,
        count: this.count
      };
      if (this.formInline.nickname != "") {
        data.nickname = this.formInline.nickname;
      }
      if (this.formInline.order_sn != "") {
        data.order_sn = this.formInline.order_sn;
      }
      if (this.formInline.begin_time != "") {
        data.begin_time = this.formInline.begin_time;
      }
      if (this.formInline.end_time != "") {
        data.end_time = this.formInline.end_time;
      }
      if (this.activeName != "60") {
        data.status = this.activeName;
      }
      listOrder(data).then(res => {
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
    refundTap(id) {
      this.$confirm("确定要退款？")
        .then(res => {
          console.log("--------- 退款商品", id);
          refundOrder({ order_id: id }).then(ress => {
            this.$message.success("订单退款成功！");
            this.getList();
          });
        })
        .catch(res => {});
    },
    printpageTap(id) {
      detailOrder(id).then(res => {
        console.log("--------", res);
        this.dialogVisible = true;
        this.detail = res;
      });

      //
    },

    printpage() {
      let newWindow = window.open("_blank"); //打开新窗口
      console.log("-", newWindow);
      let codestr = document.getElementById("print-context").innerHTML; //获取需要生成pdf页面的div代码
      newWindow.document.write(codestr); //向文档写入HTML表达式或者JavaScript代码
      newWindow.document.style = document.style;
      newWindow.document.close(); //关闭document的输出流, 显示选定的数据
      newWindow.print(); //打印当前窗口

      // window.print();
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
</style>

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

.shopAll {
  border: 1px solid #e6ebf5;
  border-top: none;
  padding: 10px;
  min-height: 30px;
  font-size: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
}
</style>

