<template>
  <div class="app-container">
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
      <el-table-column min-width="150px" label="属性名称">
        <template slot-scope="scope">
          <span>{{ scope.row.attr_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/product/attribute/edit/'+scope.row.id">
            <el-button type="text" size="small">修改</el-button>
          </router-link>
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
import { listAttribute, delAttribute } from "@/api/product";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "ProductAttributeList",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      isLoading: true,
      listQuery: {
        page: 1,
        count: 20,
        paging:1,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      listAttribute(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    delTap(id) {
      this.$confirm("确定要删除？")
        .then(res => {
          console.log("--------- 删除规格", id);
          delAttribute({ id: id }).then(ress => {
            this.$message.success("删除成功！");
            this.getList();
          });
        })
        .catch(res => {});
    }
  }
};
</script>

