<template>
    <div class="app-container">
        <div style="margin:20px 0px;">
            <router-link to="/product/create">
                <el-button type="primary">新增商品</el-button>
            </router-link>
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
            <el-table-column width="100px" align="center" label="缩略图">
                <template slot-scope="scope">
                    <!-- <el-avatar shape="square" size="medium" fit="fit" :src="scope.row.thumb"></el-avatar> -->
                    <el-image
                        style="width: 50px; height: 50px"
                        :src="scope.row.thumb"
                        fit="contain"
                        :preview-src-list="[scope.row.thumb]"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column min-width="300px" label="产品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" align="center" label="分类">
                <template slot-scope="scope">
                    <span>{{ scope.row.cid }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column width="120px" label="划线价(￥)">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
            </el-table-column>-->
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
            <el-table-column class-name="status-col" label="状态" width="200">
                <template slot-scope="scope">
                    <el-tag type="danger" size="mini" v-if="scope.row.show==0">下架</el-tag>
                    <el-tag type="success" size="mini" v-else>上架</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.hot==1">热销</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.new==1">新品</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.tuijian==1">推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <router-link :to="'/product/info/'+scope.row.id" v-if="!roles">
                        <el-button type="text" size="small">产品管理</el-button>
                    </router-link>
                    <el-divider direction="vertical"></el-divider>
                    <router-link :to="'/product/edit/'+scope.row.id">
                        <el-button type="text" size="small">编辑</el-button>
                    </router-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.count"
            @pagination="getList"
        />
    </div>
</template>

<script>
import { productList, delProduct } from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ProductListDetail",
  components: { Pagination },
  props: {
    type: {
      type: Number,
      default: 1//1-普通商品，2-积分商品，3-拼团，4-餐饮
    }
  },
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
        type: this.type
      }
    };
  },
  computed: {
    roles() {
      return this.type==4;
    }
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
