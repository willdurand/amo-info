<template>
  <div class="ProjectVersion">
    <h3>tag deployed</h3>

    <p class="ProjectVersion-number">
      {{ version }}
      <template v-if="!noPushDoc">
        &mdash; <a v-bind:href="pushDocURL">Push Doc</a>
      </template>
    </p>
  </div>
</template>

<script>
const PUSH_DOC_BASE_URL =
  'https://github.com/mozilla/addons/blob/master/releases';

export default {
  props: {
    noPushDoc: Boolean,
    version: String,
  },
  computed: {
    pushDocURL() {
      const filename = this.version.replace(
        /(\d+).(\d+).(\d+)(-\d+)?/,
        '$1/$2/$3.md'
      );

      return `${PUSH_DOC_BASE_URL}/${filename}`;
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
