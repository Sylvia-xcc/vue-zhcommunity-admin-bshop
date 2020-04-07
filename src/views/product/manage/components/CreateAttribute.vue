<template>
    <el-form-item label="测试">
        <el-input
            style="width:150px;"
            v-for="item in value"
            :key="item.key"
            v-model="item.value"
        ></el-input>
        <el-button type="danger" size="small" icon="el-icon-delete" circle @click.prevent="delTap"></el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" circle @click.prevent="addTap"></el-button>
    </el-form-item>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Array
    },
  },

  methods: {
    addTap() {
      this.value.push({
        key: "1",
        value: "3"
      });
      this.emitinput();
    },
    delTap() {
      this.value.pop();
      this.emitinput();
    },

    emitinput() {
      //   console.log("----------update", this.obj.list);
      //   this.$emit("updateAttribute", this.obj);
      this.$emit("input", this.value);
    }
  }
};
</script>

