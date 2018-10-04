<template>
  <div class="Version">
    <h3>Version</h3>
    <p class="Version-number">
      {{ version }} (<a v-bind:href="pushDocURL">Push Doc</a>)
    </p>
  </div>
</template>

<script>
export const PUSH_DOC_BASE_URL =
  'https://github.com/mozilla/addons/blob/master/releases';

export default {
  props: {
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
.Version {
}
</style>
