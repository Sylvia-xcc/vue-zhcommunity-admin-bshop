<template>
  <product-detail :is-edit="false" :type="3" />
  <!-- <ForumTest></ForumTest> -->
</template>

<script>
import ProductDetail from '@/views/product/components/ProductDetail'

export default {
  name: 'ProductCreate',
  components: { ProductDetail}
}
</script>