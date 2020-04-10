<template>
  <classify-detail :is-edit="true" />
</template>

<script>
import ClassifyDetail from './components/ClassifyDetail'

export default {
  name: 'ClassifyAdd',
  components: { ClassifyDetail }
}
</script>