<template>
  <div class="Version">
    <h3>{{ title }}</h3>

    <div>
      <Skeleton class="skeleton" v-if="!value" />
      <pre v-else>{{ value }}</pre>
    </div>
  </div>
</template>

<script>
import Skeleton from './Skeleton';

export default {
  components: {
    Skeleton,
  },
  props: {
    value: String,
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
