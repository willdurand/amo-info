<template>
  <h2 v-if="name">{{ name }}{{ env ? ` (${env})` : '' }}</h2>
  <h2 class="loading" v-else><Skeleton /></h2>
</template>

<script>
import Skeleton from './Skeleton';

export default {
  components: {
    Skeleton,
  },
  props: {
    env: String,
    name: String,
  },
};
</script>

<style lang="scss" scoped>
h2 {
  font-size: 22px;
  font-weight: 300;

  &.loading {
    width: 90%;
  }
}
</style>
