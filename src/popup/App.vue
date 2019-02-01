<template>
  <div class="App">
    <header class="panel-section panel-section-header">
      <div class="text-section-header">amo-info</div>
    </header>

    <div class="App-info-panels">
      <div class="App-info-panel frontend">
        <h2>addons-frontend</h2>

        <div class="experiments">
          <h3>a/b experiments</h3>

          <Loader v-if="loading" />
          <DataTable v-else v-bind:items="experiments" />
        </div>

        <div class="feature-flags">
          <h3>feature flags</h3>

          <Loader v-if="loading" />
          <DataTable v-else v-bind:items="featureFlags" />
        </div>

        <div class="commit">
          <h3>commit</h3>

          <Loader v-if="loading" />
          <p v-else><pre>{{ frontendShortCommit }}</pre></p>
        </div>

        <Version
          v-if="frontend && frontend.version"
          v-bind:version="frontend.version"
        />
      </div>

      <div class="App-info-panel server">
        <h2>addons-server</h2>

        <div class="python-version">
          <h3>python</h3>

          <Loader v-if="loading" />
          <p v-else><pre>{{ pythonVersion }}</pre></p>
        </div>

        <div class="commit">
          <h3>commit</h3>

          <Loader v-if="loading" />
          <p v-else><pre>{{ serverShortCommit }}</pre></p>
        </div>

        <Version
          v-if="server && server.version"
          v-bind:version="server.version"
        />
      </div>
    </div>

    <div class="App-errors" v-if="errors.length">
      <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import Loader from './Loader';
import DataTable from './DataTable';
import Version from './Version';

const createError = (error, context) => {
  return `The ${context} returned an error: ${error.message || error}`;
};

export default {
  components: {
    Loader,
    DataTable,
    Version,
  },
  data() {
    return {
      errors: [],
      frontend: null,
      loading: true,
      server: null,
    };
  },
  computed: {
    experiments() {
      const { experiments } = this.frontend || { experiments: {} };

      return Object.keys(experiments).reduce(
        (array, key) => array.concat({ name: key, enabled: experiments[key] }),
        []
      );
    },
    featureFlags() {
      // eslint-disable-next-line camelcase
      const { feature_flags } = this.frontend || { feature_flags: {} };

      return Object.keys(feature_flags).reduce(
        (array, key) =>
          array.concat({
            name: key.replace(/^enableFeature/, ''),
            enabled: feature_flags[key],
          }),
        []
      );
    },
    pythonVersion() {
      return this.server ? this.server.python : null;
    },
    frontendShortCommit() {
      return this.frontend && this.frontend.commit
        ? this.frontend.commit.substring(0, 12)
        : null;
    },
    serverShortCommit() {
      return this.server && this.server.commit
        ? this.server.commit.substring(0, 12)
        : null;
    },
  },
  mounted() {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const { origin } = new URL(currentTab.url);

      browser.runtime
        .sendMessage({ from: 'popup', origin })
        .then(([frontend, server]) => {
          this.errors = [];
          this.loading = false;

          if (frontend.type === 'success') {
            this.frontend = frontend.payload;
          } else if (frontend.type === 'error') {
            this.errors.push(createError(frontend.error, 'frontend'));
          }

          if (server.type === 'success') {
            this.server = server.payload;
          } else if (server.type === 'error') {
            this.errors.push(createError(server.error, 'server'));
          }
        });
    });
  },
};
</script>

<style lang="scss" scoped>
.App {
  .App-info-panels {
    -moz-user-select: text;
    display: flex;

    .App-info-panel {
      margin: 0 20px;
      min-width: 200px;

      h3 {
        font-weight: 500;
      }
    }
  }
}

.App-errors {
  background-color: #a4000f;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #fff;
  padding: 10px;

  p {
    padding: 0 10px 0;
  }
}
</style>
