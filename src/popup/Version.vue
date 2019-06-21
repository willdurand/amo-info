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
    title: String,
    value: String,
  },
};
</script>

<style lang="scss" scoped>
.Version {
  h3 {
    font-size: 17px;
    font-weight: 500;
  }

  .skeleton {
    width: 20%;
  }
}
</style>
