<template>
  <div class="commit">
    <h3>commit</h3>

    <div>
      <Skeleton class="skeleton" v-if="!sha" />
      <pre v-else>{{ sha }}</pre>
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
    sha: String,
  },
};
</script>

<style lang="scss" scoped>
.commit {
  .skeleton {
    width: 60%;
  }
}
</style>
