<template>
  <div class="App">
    <header class="panel-section panel-section-header">
      <div class="text-section-header">amo-info</div>
    </header>

    <div class="App-info-panels">
      <div class="App-info-panel app">
        <ProjectName v-bind:name="config.appName" v-bind:env="config.env" />

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

        <Commit v-bind:sha="appShortCommit" v-bind:repo="config.appRepo" />

        <Version v-if="app && app.version" v-bind:version="app.version" />

        <div class="repo" v-if="config.appRepo">
          <p class="repo-url">
            <GitHubLogo class="github-logo" />

            <a v-bind:href="'https://github.com/mozilla/' + config.appRepo">
              {{ config.appRepo }}
            </a>
          </p>
        </div>
      </div>

      <div class="App-info-panel api">
        <ProjectName v-bind:name="config.apiName" />

        <Commit v-bind:sha="apiShortCommit" v-bind:repo="config.apiRepo" />

        <div class="python-version">
          <h3>python</h3>

          <div>
            <pre class="loading" v-if="loading">
              <Skeleton />
            </pre>
            <pre v-else>{{ pythonVersion }}</pre>
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
import Commit from './Commit';
import DataTable from './DataTable';
import GitHubLogo from './GitHubLogo';
import Loader from './Loader';
import ProjectName from './ProjectName';
import Skeleton from './Skeleton';
import Version from './Version';
import { projectsByOrigin, defaultConfig } from '../settings';

const createError = (error, context) => {
  return `The ${context} returned an error: ${error.message || error}`;
};

export default {
  components: {
    Commit,
    DataTable,
    GitHubLogo,
    Loader,
    ProjectName,
    Skeleton,
    Version,
  },
  data() {
    return {
      api: null,
      app: null,
      config: defaultConfig,
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

      this.config = projectsByOrigin[origin] || defaultConfig;

      browser.runtime
        .sendMessage({ from: 'popup', origin })
        .then((response) => {
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
      min-width: 230px;

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

.python-version {
  .loading {
    width: 20%;
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
