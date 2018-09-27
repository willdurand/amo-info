<template>
  <div class="App">
    <header class="panel-section panel-section-header">
      <div class="text-section-header">amo-info</div>
    </header>

    <div class="experiments">
      <h3>A/B experiments</h3>

      <Loader v-if="loading" />
      <Table v-if="payload" v-bind:items="experiments" />
    </div>

    <div class="feature-flags">
      <h3>Feature flags</h3>

      <Loader v-if="loading" />
      <Table v-if="payload" v-bind:items="featureFlags" />
    </div>

    <div class="commit">
      <h3>Commit</h3>
      <p><pre>{{ shortCommit }}</pre></p>
    </div>

    <div class="version">
      <template v-if="payload.version">
        <h3>Version</h3>
        <p class="version">{{ payload.version }}</p>
      </template>
    </div>
  </div>
</template>

<script>
import Loader from './Loader.vue';
import Table from './Table.vue';

export default {
  components: {
    Loader,
    Table,
  },
  data() {
    return {
      loading: true,
      payload: null,
    };
  },
  computed: {
    experiments() {
      const { experiments } = this.payload || {};

      return Object.keys(experiments).reduce((array, key) => {
        return array.concat({ name: key, enabled: experiments[key] });
      }, []);
    },
    featureFlags() {
      const { feature_flags } = this.payload || {};

      return Object.keys(feature_flags).reduce((array, key) => {
        return array.concat({
          name: key.replace(/^enableFeature/, ''),
          enabled: feature_flags[key],
        });
      }, []);
    },
    shortCommit() {
      return this.payload ? this.payload.commit.substring(0, 12) : null;
    },
  },
  mounted() {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const { origin } = new URL(currentTab.url);

      browser.runtime.onMessage.addListener((msg) => {
        this.loading = false;

        if (msg.type === 'success') {
          this.payload = msg.payload;
        }
      });

      // Fetch data.
      browser.runtime.sendMessage({ from: 'popup', origin });
    });
  },
};
</script>

<style lang="scss" scoped>
.App {
  min-width: 250px;

  & > div {
    padding: 0 20px;
  }
}
</style>
