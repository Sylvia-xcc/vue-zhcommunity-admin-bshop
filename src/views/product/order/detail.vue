<template>
  <div style="padding:30px;">
    <el-table v-loading="isLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="产品ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.pro_name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="产品属性">
        <template slot-scope="scope">
          <span>{{ scope.row.pro_buff }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="单价">
        <template slot-scope="scope">
          <span>{{ scope.row.pro_price }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="购买数量">
        <template slot-scope="scope">
          <span>{{ scope.row.pro_num }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="总价">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form ref="detail" :model="detail" label-width="100px" style="margin-top:60px;">
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="订单编号">
              <div>{{ detail.order_sn }}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="订单总价">
              <div>￥{{ detail.amount }} (运费￥{{ detail.express_money }})</div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="下单用户">
              <div>{{ user.nickname }}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="快递名称">
              <el-input v-model="detail.kuaidi_name" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="下单时间">
              <div>{{ detail.addtime }}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="快递单号">
              <el-input v-model="detail.kuaidi_number" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="收货人">
              <div>{{ detail.receiver }}</div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="订单状态">
              <el-select v-model="detail.status" placeholder="请选择订单状态">
                <el-option label="待付款" :value="10" />
                <el-option label="待发货" :value="20" />
                <el-option label="待收货" :value="30" />
                <el-option label="已收货" :value="40" />
                <el-option label="交易完成" :value="50" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="联系电话">
              <div>{{ detail.tel }}</div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-form-item label="收获地址">
              <div>{{ detail.address_xq }}</div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-form-item label="留言">
              <div>{{ detail.remark }}</div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item style="margin-top:30px;">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onReturn">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { detailOrder, editOrder } from '@/api/product'
export default {
  name: 'ProductOrderDetail',
  data() {
    return {
      detail: {
        order_sn:''
      },
      list: [],
      user: {
        nickname:''
      },
      isLoading: true
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      this.isLoading = true
      detailOrder(id)
        .then(res => {
          console.log('-----------edit order: ', res)
          this.list = res.productList
          this.detail = res.item
          this.detail.order_sn = res.item.order_sn == null ? '' : res.item.order_sn
          this.user = res.userInfo
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    onSubmit() {
      console.log('----submit:', this.detail);
      let data={
        order_id:this.detail.id,
        status:this.detail.status,
        kuaidi_name:this.detail.kuaidi_name,
        kuaidi_number:this.detail.kuaidi_number
      }
      editOrder(data).then(res=>{
        this.$message.success('订单修改成功');
      })
    },

    onReturn(){
      // 调用全局挂载的方法
      this.$store.dispatch('tagsView/delView', this.$route)
      // 返回上一步路由
      this.$router.go(-1)
    }
  }
}
</script>
