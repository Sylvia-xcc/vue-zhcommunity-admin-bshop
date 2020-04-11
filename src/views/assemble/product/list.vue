<template>
  <div class="app-container">
    <div style="margin:20px 0px;">
        <router-link to="/assemble/assemble-product-add">
            <el-button type="success" size="mini">
                <i class="el-icon-plus el-icon--left"></i>添加拼团商品
            </el-button>
        </router-link>
    </div>
    <el-table v-loading="isLoading" :data="list" border fit highlight-current-row  style="width: 100%" >
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
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.thumb"
            fit="contain"
            :preview-src-list="[scope.row.thumb]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.cid }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="人数">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}人团</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="价格(￥)">
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
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/product/info/'+scope.row.id">
            <el-button type="text" size="small">产品管理</el-button>
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="'/assemble/assemble-product-edit/'+scope.row.id">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="getList"
    />
  </div>
</template>

<script>
import { productList, delProduct } from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "0": "下架",
        "1": "上架"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      isLoading: true,
      listQuery: {
        page: 1,
        count: 20,
        type:3
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      productList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    delTap(id) {
      this.$confirm("确定要删除？")
        .then(res => {
          console.log("--------- 删除商品", id);
          delProduct({ id: id }).then(ress => {
            this.$message.success("商品删除成功！");
            this.getList();
          });
        })
        .catch(res => {});
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