<template>
  <product-detail :is-edit="false" :type="1" />
  <!-- <ForumTest></ForumTest> -->
</template>

<script>
import ProductDetail from './components/ProductDetail'
import ForumTest from './components/FormTest'

export default {
  name: 'ProductCreate',
  components: { ProductDetail, ForumTest }
}
</script>