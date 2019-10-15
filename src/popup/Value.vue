<template>
  <div class="Value column">
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
.Value {
  h3 {
    font-size: 17px;
    font-weight: 500;
  }

  pre {
    background-color: transparent;
    font-size: 13px;
    padding: 5px 0 0;
  }

  .skeleton {
    width: 20%;
  }
}
</style>
