<template>
  <el-form-item :label="propItem.attr_name+'：'">
    <el-input
      v-for="item in propItem.list"
      :key="item.key"
      v-model="item.value"
      style="width:150px; margin-right:10px; margin-bottom:10px;"
      @input="input"
    />
    <el-button type="danger" size="small" icon="el-icon-delete" circle @click.prevent="delTap"/>
    <el-button type="primary" size="small" icon="el-icon-plus" circle @click.prevent="addTap"/>
  </el-form-item>
</template>

<script>
import {deepClone} from '@/utils/index';
export default {
  props: {
    itemObj: {
      default: () => {
        list: [
          {
            value: ""
          }
        ];
      },
      type: Object
    }
  },
  data() {
    return {
      propItem: deepClone(this.itemObj),
      update:false,
    };
  },
  // computed: {
  //   propItem: {
  //     get() {
  //       return Object.assign({}, this.itemObj);
  //     },
  //     set(val) {
  //       console.log('-------- update223')
  //       this.$emit("updateAttribute", val);
  //     }
  //   }
  // },

  // watch:{
  //   propItem:{
  //     handler(){
  //       console.log('----AAA')
  //     },
  //     deep:true
  //   }
  // },

  methods: {
    created(){
      console.log('----- created')
    },
    addTap() {
      this.propItem.list.push({
        key: Date.now(),
        value: ""
      });
      this.emitinput();
    },
    delTap() {
      if (this.propItem.list.length <= 1) return;
      this.propItem.list.pop();
      this.emitinput();
    },

    input(){
      // console.log('------- AAAA', this.update)
      if(this.update==false){
        this.emitinput();
      }
    },

    emitinput() {
      // console.log('-------- update')
      this.update = true;
      this.propItem = Object.assign({}, this.propItem);
      this.$emit("updateAttribute", this.propItem);
    }
  }
};
</script>

