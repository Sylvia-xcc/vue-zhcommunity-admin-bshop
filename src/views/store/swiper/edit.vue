<template>
  <swiper-detail :is-edit="true" />
</template>

<script>
import SwiperDetail from './components/SwiperDetail'

export default {
  name: 'SwiperEdit',
  components: { SwiperDetail }
}
</script>