<template>
  <div class="ProjectRepo column">
    <p class="ProjectRepo-url">
      <GitHubLogo />

      <a v-if="repository" :href="'https://github.com/mozilla/' + repository">
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
.ProjectRepo {
}

.ProjectRepo-url {
  align-items: center;
  display: flex;

  .github-icon {
    margin-top: 0px;
    margin-right: 5px;
  }
}
</style>
