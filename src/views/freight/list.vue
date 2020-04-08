<template>
  <div class="app-container">
    <el-table v-loading="isLoading" :data="list" border="" fit highlight-current-row style="width: 80%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="模板名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px"  align="center" label="运送方式">
        <template slot-scope="scope">
          <span>{{ scope.row.transport_type | transportFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="计价方式">
        <template slot-scope="scope">
          <span>{{ scope.row.valuation_type | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250">
        <template slot-scope="scope">
          <router-link :to="'/product/attribute/edit/'+scope.row.id">
            <el-button type="text" size="small">修改</el-button>
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="getList" />
  </div>
</template>

<script>
import { freightList } from "@/api/freight";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "FreightList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '件数',
        '2': '重量',
        '3': '体积'
      }
      return statusMap[status]
    },
    transportFilter(status) {
      const statusMap = {
        '1': '快递',
        '2': '物流',
        '3': 'ems',
        '4': '平邮'
      }
      return statusMap[status]
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
      freightList(this.listQuery).then(res => {
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
