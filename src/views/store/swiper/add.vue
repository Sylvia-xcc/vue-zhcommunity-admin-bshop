<template>
  <swiper-detail :is-edit="false" />
</template>

<script>
import SwiperDetail from './components/SwiperDetail'

export default {
  name: 'SwiperAdd',
  components: { SwiperDetail }
}
</script>