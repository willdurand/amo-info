<template>
  <div class="App">
    <header class="panel-section panel-section-header">
      <div class="text-section-header">amo-info</div>
    </header>

    <div class="App-info-panels">
      <div class="App-info-panel app">
        <h2>{{ config.appName }} ({{ config.env }})</h2>

        <div class="experiments" v-if="config.hasExperiments">
          <h3>a/b experiments</h3>

          <Loader v-if="loading" />
          <DataTable v-else v-bind:items="experiments" />
        </div>

        <div class="feature-flags" v-if="config.hasFeatureFlags">
          <h3>feature flags</h3>

          <Loader v-if="loading" />
          <DataTable v-else v-bind:items="featureFlags" />
        </div>

        <div class="commit">
          <h3>commit</h3>

          <Loader v-if="loading" />
          <div v-else>
            <pre>{{ appShortCommit }}</pre>
          </div>
        </div>

        <Version v-if="app && app.version" v-bind:version="app.version" />

        <div class="repo" v-if="config.repo">
          <p class="repo-url">
            <svg
              class="github-icon"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>

            <a v-bind:href="'https://github.com/mozilla/' + config.repo">
              {{ config.repo }}
            </a>
          </p>
        </div>
      </div>

      <div class="App-info-panel api">
        <h2>{{ config.apiName }}</h2>

        <div class="commit">
          <h3>commit</h3>

          <Loader v-if="loading" />
          <div v-else>
            <pre>{{ apiShortCommit }}</pre>
          </div>
        </div>

        <div class="python-version">
          <h3>python</h3>

          <Loader v-if="loading" />
          <div v-else>
            <pre>{{ pythonVersion }}</pre>
          </div>
        </div>

        <Version v-if="api && api.version" v-bind:version="api.version" />
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
import { projectsByOrigin, unknownConfig } from '../settings';

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
      api: null,
      app: null,
      config: unknownConfig,
      errors: [],
      loading: true,
    };
  },
  computed: {
    experiments() {
      const experiments = this.app && this.app.experiments;

      if (!experiments) {
        return [];
      }

      return Object.keys(experiments).reduce(
        (array, key) => array.concat({ name: key, enabled: experiments[key] }),
        []
      );
    },
    featureFlags() {
      // eslint-disable-next-line camelcase
      const feature_flags = this.app && this.app.feature_flags;

      if (!feature_flags) {
        return [];
      }

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
      return this.api ? this.api.python : null;
    },
    appShortCommit() {
      return this.app && this.app.commit
        ? this.app.commit.substring(0, 12)
        : null;
    },
    apiShortCommit() {
      return this.api && this.api.commit
        ? this.api.commit.substring(0, 12)
        : null;
    },
  },
  mounted() {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const { origin } = new URL(currentTab.url);

      browser.runtime
        .sendMessage({ from: 'popup', origin })
        .then((response) => {
          this.config = projectsByOrigin[origin] || unknownConfig;
          this.errors = [];
          this.loading = false;

          if (response.type === 'error') {
            this.errors.push(createError(response.error, 'other'));
            return;
          }

          const [app, api] = response;

          if (app.type === 'success') {
            this.app = app.payload;
          } else if (app.type === 'error') {
            this.errors.push(createError(app.error, 'app'));
          }

          if (!api) {
            this.api = null;
            return;
          }

          if (api.type === 'success') {
            this.api = api.payload;
          } else if (api.type === 'error') {
            this.errors.push(createError(api.error, 'api'));
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

.repo {
  margin-top: 30px;
}

.repo-url {
  align-items: center;
  display: flex;

  .github-icon {
    margin-top: 3px;
    margin-right: 5px;
  }
}
</style>
