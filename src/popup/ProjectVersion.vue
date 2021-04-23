<template>
  <div class="ProjectVersion column">
    <h3>tag deployed</h3>

    <p class="ProjectVersion-number">
      {{ version }}

      <template v-if="!noPushDoc">
        &mdash;
        <a :href="pushDocURL" title="Quick access to the push doc">
          Push Doc
        </a>
      </template>
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
const PUSH_DOC_BASE_URL =
  'https://github.com/mozilla/addons/blob/main/releases';

const PM_MILESTONE_URL_PATTERN =
  'https://addons-pm.herokuapp.com/milestones/%milestone%/?dir=asc&sort=assignee';

export default {
  props: {
    noMilestone: Boolean,
    noPushDoc: Boolean,
    version: String,
  },
  computed: {
    milestone() {
      return this.version.replace(/(\d+).(\d+).(\d+)(-\d+)?/, '$1.$2.$3');
    },
    pushDocURL() {
      const filename = `${this.milestone.replace(/\./g, '/')}.md`;

      return `${PUSH_DOC_BASE_URL}/${filename}`;
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
