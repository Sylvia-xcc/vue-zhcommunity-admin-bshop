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
            <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            
            <el-table-column width="150px" align="center" label="用户">
                <template slot-scope="scope">
                    <div>{{ scope.row.userInfo.nickname }}</div>
                    <div class="text-sm">（用户id:{{ scope.row.userInfo.id }}）</div>
                </template>
            </el-table-column>
            <el-table-column min-width="250px" align="center" label="评价内容">
                <template slot-scope="scope">
                    <div>{{ scope.row.content }}</div>
                </template>
            </el-table-column>
            <el-table-column width="120px" label="评分" align="center">
                <template slot-scope="scope">
                     <el-tag type="success" size="mini" v-if="scope.row.type==1">好评</el-tag>
                    <el-tag type="danger" size="mini" v-else>差评</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="是否有图片">
                <template slot-scope="scope">
                    <span>{{ scope.row.file.pic.length<=0 ?'否':'有' }}</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="评价时间" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120" fixed="right">
                <template slot-scope="scope">
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
import { commentList, commentDel } from "@/api/product";
import Pagination from "@/components/Pagination";
export default {
  name: "ProductCommentList",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      isLoading: true,
      listQuery: {
        page: 1,
        count: 20,
      },
      productId:0,
    };
  },
  created() {
    this.productId = this.$route.params && this.$route.params.id
    this.loadCommentList();
  },
  methods: {
    loadCommentList() {
      this.isLoading = true;
      this.listQuery.product_id = this.productId;
      commentList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
        this.isLoading = false;
      });
    },
    delTap(id){
        this.$confirm("确定要删除？")
        .then(res => {
          console.log("--------- 删除商品", id);
          commentDel({ id: id }).then(ress => {
            this.$message.success("评论删除成功！");
            this.loadCommentList();
          });
        })
    }
  }
};
</script>

