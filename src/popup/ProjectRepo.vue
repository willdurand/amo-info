<template>
  <div class="repo">
    <p class="repo-url">
      <GitHubLogo class="github-logo" />

      <a
        v-if="repository"
        v-bind:href="'https://github.com/mozilla/' + repository"
      >
        {{ repository }}
      </a>
      <Skeleton v-else />
    </p>
  </div>
</template>

<script>
import GitHubLogo from './GitHubLogo';
import Skeleton from './Skeleton';

export default {
  components: {
    GitHubLogo,
    Skeleton,
  },
  props: {
    repository: String,
  },
};
</script>

<style lang="scss" scoped>
.repo {
  margin-top: 30px;
}

.repo-url {
  align-items: center;
  display: flex;

  .github-icon {
    margin-top: 0px;
    margin-right: 5px;
  }
}
</style>
