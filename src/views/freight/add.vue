<template>
  <freight-detail :is-edit="false" />
</template>

<script>
import FreightDetail from './components/FreightDetail'

export default {
  name: 'FreightAdd',
  components: { FreightDetail }
}
</script>