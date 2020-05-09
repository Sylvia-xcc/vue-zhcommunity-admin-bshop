<template>
    <div style="padding:30px">
        <div class="bg-gray padding radius">
            <div class="flex align-center justify-between">
                <div>
                    <span class="text-xl text-bold">核销人员</span>
                    <span class="text-xs text-gray padding-xs">可以核销订单</span>
                </div>
                <el-button type="primary" @click="dialogVisible = true">添加</el-button>
            </div>
            <div class="flex flex-wrap margin-top">
                <div v-for="item in list" :key="item.index" class="bg-white radius flex align-center padding-xs pr margin-bottom-sm" style="width:30%; margin-right:3.3%;">
                    <el-image style="width: 80px; height: 80px" class="radius" :src="item.userInfo.avatar" fit="fit"></el-image>
                    <span class="padding-left-xs">{{item.userInfo.nickname}}</span>
                    <el-button type="text" class="pa" style="right:10px; top:0" @click="delTap(item.user_id)">删除</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="添加核销人员" :visible.sync="dialogVisible" width="600px">
            <div class="text-center" >
                <div class="margin-bottom-sm">请输入需要绑定的微信名</div>
                <el-input
                    placeholder="请输入微信名"
                    prefix-icon="el-icon-search"
                    v-model="search"
                    style="width:300px;"
                    @change="searchTap"
                ></el-input>
                <div class="text-gray padding-top-xs margin-bottom">输入微信名搜索，一次只可绑定一个用户</div>
                <el-scrollbar style="height:100%">
                <div class="flex flex-wrap  justify-center" style="height:400px;">
                    <div
                        v-for="item in searchList"
                        :key="item.id"
                        class="margin-right-xs margin-bottom-xs avatar-uploader"
                        @click="selectedTap(item.id)"
                    >
                        <el-image style="width: 100px; height: 100px" :src="item.photo" fit="fit"></el-image>
                        <div v-if="item.id==selectedId" class="image-preview-action">
                            <i class="el-icon-check" @click.stop="rmImage"></i>
                        </div>
                    </div>
                </div>
                </el-scrollbar>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTap">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { merchantsverifyList, merchantsverifyAdd,merchantsverifyDel } from "@/api/store";
import { shopUserList } from "@/api/user";
export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      search: "",
      searchList: [],
      selectedId:-1,
    }
  },

  created() {
    this.loadMerchantsverifyList();
  },

  methods: {
    loadMerchantsverifyList() {
      merchantsverifyList().then(res => {
        this.list = res.list;
      });
    },
    searchTap() {
      // if(this.search=='')
      // {
      //     this.$message.error("图片上传失败，请重新上传！");
      //     return;
      // }
      shopUserList({ paging: 0, nickname: this.search }).then(res => {
        this.searchList = res;
        this.selectedId = -1;
      });
    },
    selectedTap(id) {
      this.selectedId = id;
    },
    addTap(){
        if(this.selectedId <0){
            this.$message.error('请选择需要绑定的用户');
            return;
        }
        merchantsverifyAdd({user_id:this.selectedId}).then(res=>{
            this.$message.success('绑定成功');
            this.selectedId = -1;
            this.dialogVisible = false;
            this.loadMerchantsverifyList();
        })
    },
    delTap(id){
        merchantsverifyDel({user_id:id}).then(res=>{
            this.$message.success('解除绑定成功');
            this.loadMerchantsverifyList();
        })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.avatar-uploader {
    position: relative;
    width:100px;
    height: 100px;
  .image-preview-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 1;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    .el-icon-check {
      font-size: 36px;
      color:#00ff00;
    }
  }
}
</style>


