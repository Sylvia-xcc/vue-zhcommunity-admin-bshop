<template>
  <product-detail :is-edit="false" :type="type" />
  <!-- <ForumTest></ForumTest> -->
</template>

<script>
import ProductDetail from './components/ProductDetail'
import ForumTest from './components/FormTest'

export default {
  name: 'ProductCreate',
  components: { ProductDetail, ForumTest },
  computed:{
    type(){
        return this.$store.getters.roles.includes('restaurant')?4:1;
    }
  }
}
</script>