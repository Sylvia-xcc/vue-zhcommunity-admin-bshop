<template>
  <product-detail :is-edit="true" :type="type" />
</template>

<script>
import ProductDetail from './components/ProductDetail'

export default {
  name: 'ProductEdit',
  components: { ProductDetail },
  computed:{
    type(){
        return this.$store.getters.roles.includes('restaurant')?4:1;
    }
  }
}
</script>