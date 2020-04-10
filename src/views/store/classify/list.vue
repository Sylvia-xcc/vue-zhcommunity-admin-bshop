<template>
    <div style="padding:30px;">
        <el-card class="box-card">
            <span style="color:#409EFF; font-size:10px;">注：商品分类最多添加2级</span>
        </el-card>
        <div style="margin:20px 0px;">
            <router-link to="/store/store-classify-add">
                <el-button type="success" size="mini">
                    <i class="el-icon-plus el-icon--left"></i>新增
                </el-button>
            </router-link>
        </div>
        <el-table
            v-loading="isLoading"
            :data="list"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border=""
            default-expand-all
            stripe
            fit
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column prop="id" label="分类ID" width="80px"></el-table-column>
            <el-table-column width="100px" align="center" label="分类图片">
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
            <el-table-column prop="sort_order" label="分类排序" width="100px"></el-table-column>
            <el-table-column prop="create_time" label="添加时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-divider direction="vertical" v-if="scope.row.type==1"></el-divider>
                    <router-link :to="'/store/store-classify-edit/'+scope.row.id">
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
import { classifyList } from "@/api/classify";
import Pagination from "@/components/Pagination";

export default {
  name: "Classify",
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: true,
      listQuery: {
        page: 1,
        count: 10,
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
      classifyList(this.listQuery).then(res => {
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
.box-card {
  background-color: rgba(64, 158, 255, 0.1);
}
</style>

