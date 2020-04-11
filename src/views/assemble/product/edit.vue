<template>
  <product-detail :is-edit="true" :type="3" />
</template>

<script>
import ProductDetail from '@/views/product/components/ProductDetail'

export default {
  name: 'ProductEdit',
  components: { ProductDetail }
}
</script>