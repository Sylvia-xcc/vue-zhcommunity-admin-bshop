<template>
  <el-form-item :label="itemObj.attr_name+'：'">
    <el-input
      v-for="item in itemObj.list"
      :key="item.key"
      v-model="item.value"
      style="width:150px; margin-right:10px; margin-bottom:10px;"
    />
    <el-button type="danger" size="small" icon="el-icon-delete" circle @click.prevent="delTap"/>
    <el-button type="primary" size="small" icon="el-icon-plus" circle @click.prevent="addTap"/>
  </el-form-item>
</template>

<script>
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
  //       // console.log('----AAA')
  //     },
  //     deep:true
  //   }
  // },

  methods: {
    addTap() {
      this.itemObj.list.push({
        key: Date.now(),
        value: ""
      });
      this.emitinput();
    },
    delTap() {
      if (this.itemObj.list.length <= 1) return;
      this.itemObj.list.pop();
      this.emitinput();
    },

    emitinput() {
      // console.log('-------- update')
      this.itemObj = Object.assign({}, this.itemObj);
      this.$emit("updateAttribute", this.itemObj);
    }
  }
};
</script>

