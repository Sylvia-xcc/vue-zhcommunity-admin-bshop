<template>
  <div style="padding:30px;">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="产品名称：">
        <div>{{ detail.name }}</div>
      </el-form-item>
      <el-form-item label="产品价格：">
        <div>{{ detail.price_yh }}</div>
      </el-form-item>
      <el-form-item label="库存：">
        <div>{{ detail.stock }}</div>
      </el-form-item>
      <el-form-item label="属性规格设置：">
        <el-checkbox-group v-model="form.type">
          <el-checkbox
            v-for="item in attrList"
            :key="item.id"
            :label="item.attr_name"
            @change="changeTap(item)"
          >{{ item.attr_name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <CreateAttribute
        v-for="(item,index) in form.list"
        :key="index"
        :item-obj="item"
        @updateAttribute="updateAttribute"
      />
      <el-table :data="list" border fit highlight-current-row style="width: 100%; margin-bottom:50px;" v-if="list.length>0">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="200px" label="属性名称">
          <template slot-scope="scope">
            <span>{{ scope.row.attr_name }}</span>
          </template>
        </el-table-column>

        <el-table-column width="200px" align="center" label="规格名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
            <template slot-scope="scope">          
              <el-button type="text" size="small" @click="delTap(scope.row.id)"> 删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-form-item >
        <el-button type="primary" @click="onSubmit" style="margin-right:20px;">保存</el-button>
        <router-link :to="'/product/guigelist/'+pid">
          <el-button type="success" plain>规格列表</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { detailProduct,listAttribute, setProductGuige, listProductGuige, delProductGuige } from '@/api/product'
import CreateAttribute from './components/CreateAttribute'
export default {
  name: 'ProductManage',
  components: { CreateAttribute },
  data() {
    return {
      pid:0,
      detail: {
        name: '',
        stock: '',
        price_yh: ''
      },
      attrList: null,
      form: {
        type: [],
        list: []
      },
      list:[],
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.pid = id;
    this.fetchData(id)
    this.getAttrList()
    this.getGuigeList(id);
  },
  methods: {
    fetchData(id) {
      detailProduct(id)
        .then(res => {
          console.log('-----------edit product: ', res)
          this.detail = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取属性列表
    getAttrList() {
      this.isLoading = true
      listAttribute().then(res => {
        this.attrList = res
      })
    },
    //获取设置的规格列表
    getGuigeList(id) {
      this.isLoading = true
      listProductGuige(id).then(res => {
        this.list = res
      })
    },

    delTap(id){
      delProductGuige({id:id}).then(res=>{
        this.$message.success('删除成功！');
        this.getGuigeList(this.pid);
      })
    },
    onSubmit() {
      console.log('----submit:', this.form);
      let list = this.form.list;
      let tmp = [];
      for(let i=0; i<list.length; i++){
        let item = list[i];
        console.log('------------item', item)
        for(let j=0; j<item.list.length; j++){
          tmp.push({
            pid:this.pid,
            attr_id:item.id,
            name:item.list[j].value
          })
        }
      }
      console.log('------ tmp', tmp)
      setProductGuige({pid:this.pid, guigeList:JSON.stringify(tmp)}).then(res=>{
        this.$message.success('添加属性成功');
        this.getGuigeList(this.pid);
      })
    },
    changeTap(val) {
      const list = this.form.list
      console.log('-------------->>>> ', val, list)
      let have = false
      let index = 0
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == val.id) {
          have = true
          index = i
          break
        }
      }
      console.log('---------- have:', have)
      if (!have) {
        val.list = [{ key: '1', value: '' }]
        this.form.list.push(val)
        this.$forceUpdate();
        // this.form = Object.assign({}, this.form, val);
      } else {
        this.form.list.splice(index, 1)
      }
      console.log('--------form:', this.form.list)
    },

    updateAttribute(obj) {
      // console.log("-------- update222:", obj);
      // let list = this.form.list;
      // for (var i = 0; i < list.length; i++) {
      //   if (list[i].id == obj.id) {
      //     list[i] = obj;
      //   }
      // }
      // this.form.list = list;
      // this.form = Object.assign({}, this.form);
      // this.form = Object.assign({},this.form, this.form2);
      this.$forceUpdate()
    }
  }
}
</script>

