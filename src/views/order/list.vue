<template>
  <div class="app-container">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="60" />
      <el-tab-pane label="待付款" name="10" />
      <el-tab-pane label="待发货" name="20" />
      <el-tab-pane label="待收货" name="30" />
      <el-tab-pane label="已收货" name="40" />
      <el-tab-pane label="交易完成" name="50" />
      <el-tab-pane label="交易关闭" name="0" />
    </el-tabs>
    <div style="padding:20px 0 0 20px; margin-bottom:10px;">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="formInline.nickname" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="订单编号" prop="order_sn">
          <el-input v-model="formInline.order_sn" placeholder="订单编号" />
        </el-form-item>
        <!-- <el-form-item label="开始时间"  prop="begin_time">
          <el-date-picker type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="formInline.begin_time" ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" style="margin-right:50px;" prop="end_time">
            <el-date-picker type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="formInline.end_time"></el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="isLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column min-width="80px" label="订单类型">
        <template slot-scope="scope">
          <span>{{ scope.row.order_type | statusFilter }}</span>
        </template>
      </el-table-column> -->

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
          <div v-if="scope.row.back==0&&scope.row.status==0" class="text-xs">({{ scope.row.status_desc||'订单取消' }})</div>
          <!-- <span v-if="scope.row.status=='待付款'" style="color:#F56C6C">{{ scope.row.status }}</span>
          <span v-else-if="scope.row.status=='交易完成'" style="color:#67C23A">{{ scope.row.status }}</span>
          <span v-else style="color:#E6A23C">{{ scope.row.status }}</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/order/detail/'+scope.row.id">
            <el-button type="text" size="small">查看</el-button>
          </router-link>
          <el-divider direction="vertical" />
          <el-button type="text" size="small" @click="delTap(scope.row.id)"> 删除</el-button>
          <template v-if="scope.row.status>10 && scope.row.status<40">
            <el-divider direction="vertical" />
            <el-button type="text" size="small" style="color:red;" @click="refundTap(scope.row.id)"> 退款</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="count" @pagination="getList" />
  </div>
</template>

<script>
import { listOrder, delOrder, refundOrder } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductOrderList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '普通订单',
        '2': '积分订单'
      }
      return statusMap[status]
    },
    payFilter(status) {
      const statusMap = {
        'weixin': '微信支付',
        'cash': '余额支付'
      }
      return statusMap[status]
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
        nickname: '',
        order_sn: '',
        begin_time: '',
        end_time: ''
      },
      activeName: '60'
    }
  },
  watch() {
    console.log('--------------- watch')
  },
  created() {
    console.log('--------------- created')
    this.getList()
  },
  methods: {
    getList() {
      console.log('--------- activeName:', this.activeName)
      this.isLoading = true
      const data = {
        page: this.page,
        count: this.count
      }
      if (this.formInline.nickname != '') { data.nickname = this.formInline.nickname }
      if (this.formInline.order_sn != '') { data.order_sn = this.formInline.order_sn }
      if (this.formInline.begin_time != '') { data.begin_time = this.formInline.begin_time }
      if (this.formInline.end_time != '') { data.end_time = this.formInline.end_time }
      if (this.activeName != '60') { data.status = this.activeName }
      listOrder(data).then(res => {
        this.list = res.data
        this.total = res.total
        this.isLoading = false
      })
    },
    delTap(id) {
      this.$confirm('确定要删除？').then(res => {
        console.log('--------- 删除商品', id)
        delOrder({ id: id }).then(ress => {
          this.$message.success('订单删除成功！')
          this.getList()
        })
      }).catch(res => {

      })
    },
    refundTap(id) {
      this.$confirm('确定要退款？').then(res => {
        console.log('--------- 退款商品', id)
        refundOrder({ order_id: id }).then(ress => {
          this.$message.success('订单退款成功！')
          this.getList()
        })
      }).catch(res => {

      })
    },
    onSubmit() {
      console.log('submit:', this.formInline)
      this.page = 1
      this.getList()
    },
    onReset() {
      this.$refs.formInline.resetFields()
      this.page = 1
      this.getList()
    },
    handleClick(tab, event) {
      this.page = 1
      this.getList()
    }
  }
}
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
