<template>
  <div class="app-container">
    <el-table v-loading="isLoading" :data="list" border fit style="width: 100%">
      <el-table-column label="规格组合名称" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.gg_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="原价">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="优惠价">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price_yh"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="200px"  label="VIP价">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price_vip"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="200px" label="库存">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stock"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="200px"  label="抵抗积分">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jifen_get"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="获得积分" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.jifen_use"></el-input>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="缩略图">
        <template slot-scope="scope">
          <!-- <el-avatar shape="square" :size="100" fit="fit" :src="scope.row.thumb"></el-avatar> -->
          <div class="flex-center">
            <Upload v-model="scope.row.thumb" />
          </div>
          
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:50px;" align="center">
      <el-button type="primary" @click="onSubmit" >保存</el-button>
    </div>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="getList" /> -->
  </div>
</template>

<script>
import { listProductAttr, editProductAttr } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/AvatarImage'

export default {
  name: 'ProductManageList',
  components: { Pagination, Upload },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '下架',
        '1': '上架'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: true,
      pid:0,
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.pid = id;
    this.getList(id);
    console.log('------------- update guige', id)
  },
  methods: {
    getList(id) {
      this.isLoading = true
      listProductAttr(id).then(res => {
        this.list = res.list
        this.isLoading = false;
      })
    },
    delTap(id){
      this.$confirm('确定要删除？').then(res=>{
        console.log('--------- 删除商品', id);
        delProduct({id:id}).then(ress=>{
          this.$message.success("商品删除成功！");
          this.getList();
        })
      }).catch(res=>{

      })
    },
    onSubmit(){
      console.log('---------- submit:', this.list);      
      editProductAttr({pid:this.pid, attr:JSON.stringify(this.list)}).then(res=>{
        this.$message.success('修改成功');
      })
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
.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>