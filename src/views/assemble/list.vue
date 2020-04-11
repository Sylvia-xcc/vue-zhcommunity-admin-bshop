<template>
  <div style="padding:30px">
    <el-table
      v-loading="isLoading"
      :data="list"
      border=""
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="left" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="团长">
        <template slot-scope="scope">
          <div>{{ scope.row.userInfo.nickname }}</div>
          <div style="font-size:12px; color:#666;">(用户id：{{ scope.row.userInfo.id }})</div>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="left" label="已参团成员">
        <template slot-scope="scope">
            <el-image v-for="item in scope.row.joinList" :key="item.id" :src="item.avatar" fit="fit" style="width:40px;height:40px; border-radius:50%;"></el-image>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="left" label="状态">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status | statusFilter}}</span> -->
          <el-tag size="small" type='danger' v-if="scope.row.status==0">{{ scope.row.status | statusFilter}}</el-tag>
          <el-tag size="small" type='success' v-else-if="scope.row.status==1">{{ scope.row.status | statusFilter}}</el-tag>
          <el-tag size="small" type="info" v-else>{{ scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="left" label="拼团商品">
        <template slot-scope="scope">
          <div class="flex-center">
            <div>
              <el-image style="width: 50px; height: 50px; border-radius:4px; " :src="scope.row.pro_thumb" fit="fit" :preview-src-list="[scope.row.pro_thumb]"></el-image>
            </div>
            <span style="padding-left:10px;">{{ scope.row.pro_name }}</span>
          </div>
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
import Pagination from "@/components/Pagination";
import { assembleList } from "@/api/assemble";

export default {
  name: "AssembleList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '进行中',
        '1': '拼团成功',
        '2': '拼团失败'
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
  },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: false,
      listQuery: {
        page: 1,
        count: 20
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.isLoading = true;
      assembleList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.flex-center {
  display: flex;
  // justify-content: center;
  // align-items: center;
}
</style>

