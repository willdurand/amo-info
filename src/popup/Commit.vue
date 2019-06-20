<template>
  <div class="commit">
    <h3>commit</h3>

    <div>
      <Skeleton class="skeleton" v-if="!sha" />
      <a v-else :href="'https://github.com/mozilla/' + repo + '/commit/' + sha">
        {{ sha }}
      </a>
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
    repo: String,
  },
};
</script>

<style lang="scss" scoped>
.commit {
  h3 {
    font-size: 17px;
    font-weight: 500;
  }

  .skeleton {
    width: 60%;
  }
}
</style>
