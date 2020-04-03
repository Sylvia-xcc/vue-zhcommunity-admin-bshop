<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="产品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="缩略图">
        <template slot-scope="scope">
          <el-avatar shape="square" size="medium" fit="fit" :src="scope.row.image_uri"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px"  label="原价(￥)">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px"  label="一口价(￥)">
        <template slot-scope="scope">
          <span>{{ scope.row.price_yh }}</span>
        </template>
      </el-table-column>

      <el-table-column width="60px" align="center" label="库存">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <span style="color:#F56C6C; font-size:12px;" v-if="scope.row.show==0">下架</span>
          <span style="color:#67C23A; font-size:12px;" v-else>上架</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="text" size="small" >编辑</el-button>
          </router-link>
          <el-button type="text" size="small"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { productList } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductList',
  components: { Pagination },
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      productList(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.total
        this.listLoading = false;
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
</style>
