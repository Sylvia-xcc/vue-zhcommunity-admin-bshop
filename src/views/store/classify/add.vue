<template>
  <classify-detail :is-edit="false" />
</template>

<script>
import ClassifyDetail from './components/ClassifyDetail'

export default {
  name: 'ClassifyAdd',
  components: { ClassifyDetail }
}
</script>