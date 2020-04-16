<template>
    <div class="" style="padding:30px;">
        <router-link to="/store/store-swiper-add">
            <el-button type="primary" class="margin-bottom-sm">添加广告</el-button>
        </router-link>
        <el-table :data="list" border="" style="width: 100%">
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column label="广告" >
                <template scope="scope">
                    <img :src="scope.row.thumb" alt="" style="width: 90px;height: 50px">
                </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="关联商品ID"></el-table-column>
            <el-table-column prop="sort_order" label="排序" ></el-table-column>
            <el-table-column  label="状态" >
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 1">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-divider direction="vertical" v-if="scope.row.type==1"></el-divider>
                    <router-link :to="'/store/store-swiper-edit/'+scope.row.id">
                        <el-button type="text" size="small">编辑</el-button>
                    </router-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" size="small" @click="delTap(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.count" @pagination="loadSwiperList" />
    </div>
</template>

<script>
import { swiperList } from "@/api/store";
import Pagination from "@/components/Pagination";
export default {
  name: "SwiperList",
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: true,
      listQuery: {
        page: 1,
        count: 10,
        paging: 1
      }
    };
  },
  created() {
    this.loadSwiperList();
  },
  methods: {
    loadSwiperList() {
      swiperList(this.listQuery).then(res => {
        this.list = res.data;
        this.total = res.total;
      });
    }
  }
};
</script>

