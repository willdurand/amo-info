<template>
  <div class="ProjectVersion column">
    <h3>tag deployed</h3>

    <p class="ProjectVersion-number">
      {{ version }}
    </p>
    <p v-if="!noMilestone" class="ProjectVersion-pm-milestone">
      🌟
      <a
        :href="pmMilestoneURL"
        title="Review this milestone in Add-ons Project Manager"
      >
        Review this milestone
      </a>
    </p>
  </div>
</template>

<script>
const PM_MILESTONE_URL_PATTERN =
  'https://addons-pm.herokuapp.com/milestones/%milestone%/';

export default {
  props: {
    noMilestone: Boolean,
    version: String,
  },
  computed: {
    milestone() {
      return this.version.replace(/(\d+).(\d+).(\d+)(-\d+)?/, '$1-$2-$3');
    },
    pmMilestoneURL() {
      return PM_MILESTONE_URL_PATTERN.replace('%milestone%', this.milestone);
    },
  },
};
</script>

<style lang="scss" scoped>
.ProjectVersion {
  h3 {
    font-size: 17px;
    font-weight: 500;
  }
}
</style>
