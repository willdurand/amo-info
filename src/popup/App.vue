<template>
  <div class="App">
    <header class="panel-section panel-section-header">
      <div class="text-section-header">amo-info (frontend)</div>
    </header>

    <div class="experiments">
      <h3>A/B experiments</h3>

      <Loader v-if="loading" />
      <DataTable v-else v-bind:items="experiments" />
    </div>

    <div class="feature-flags">
      <h3>Feature flags</h3>

      <Loader v-if="loading" />
      <DataTable v-else v-bind:items="featureFlags" />
    </div>

    <div class="commit">
      <h3>Commit</h3>

      <Loader v-if="loading" />
      <p v-else><pre>{{ shortCommit }}</pre></p>
    </div>

    <Version
      v-if="payload && payload.version"
      v-bind:version="payload.version"
    />

    <div class="App-errors" v-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import Loader from './Loader';
import Table from './Table';
import Version from './Version';

export default {
  components: {
    Loader,
    DataTable: Table,
    Version,
  },
  data() {
    return {
      loading: true,
      payload: null,
      error: null,
    };
  },
  computed: {
    experiments() {
      const { experiments } = this.payload || { experiments: {} };

      return Object.keys(experiments).reduce(
        (array, key) => array.concat({ name: key, enabled: experiments[key] }),
        []
      );
    },
    featureFlags() {
      // eslint-disable-next-line camelcase
      const { feature_flags } = this.payload || { feature_flags: {} };

      return Object.keys(feature_flags).reduce(
        (array, key) =>
          array.concat({
            name: key.replace(/^enableFeature/, ''),
            enabled: feature_flags[key],
          }),
        []
      );
    },
    shortCommit() {
      return this.payload && this.payload.commit
        ? this.payload.commit.substring(0, 12)
        : null;
    },
  },
  mounted() {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const { origin } = new URL(currentTab.url);

      browser.runtime.sendMessage({ from: 'popup', origin }).then((msg) => {
        this.loading = false;

        if (msg.type === 'success') {
          this.payload = msg.payload;
        } else if (msg.type === 'error') {
          this.error = msg.error;
        }
      });
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

.App-errors {
  background-color: #a4000f;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #fff;
  margin-bottom: -13px;
  max-width: 250px;

  p {
    padding: 10px 0;
  }
}
</style>
