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

          <DataTable v-bind:items="experiments" />
        </div>

        <div class="feature-flags" v-if="config.hasFeatureFlags">
          <h3>feature flags</h3>

          <DataTable v-bind:items="featureFlags" />
        </div>

        <Commit v-bind:sha="appShortCommit" v-bind:repo="config.appRepo" />

        <ProjectVersion
          v-if="app && app.version"
          v-bind:version="app.version"
          v-bind:no-push-doc="config.pushDoc === false"
        />

        <ProjectRepo v-bind:repository="config.appRepo" />
      </div>

      <div class="App-info-panel api" v-if="config.apiName">
        <ProjectName v-bind:name="config.apiName" />

        <Version title="python" v-bind:value="pythonVersion" />

        <Version title="django" v-bind:value="djangoVersion" />

        <Commit v-bind:sha="apiShortCommit" v-bind:repo="config.apiRepo" />

        <ProjectVersion
          v-if="api && api.version"
          v-bind:version="api.version"
        />
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
import ProjectName from './ProjectName';
import ProjectRepo from './ProjectRepo';
import ProjectVersion from './ProjectVersion';
import Version from './Version';
import { projectsByOrigin, defaultConfig } from '../settings';

const createError = (error, context) => {
  return `The ${context} returned an error: ${error.message || error}`;
};

export default {
  components: {
    Commit,
    DataTable,
    ProjectName,
    ProjectRepo,
    ProjectVersion,
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
        return null;
      }

      return Object.keys(experiments).reduce(
        (array, key) => array.concat({ name: key, enabled: experiments[key] }),
        []
      );
    },
    featureFlags() {
      // eslint-disable-next-line camelcase
      const feature_flags = this.app && this.app.feature_flags;

      // eslint-disable-next-line camelcase
      if (!feature_flags) {
        return null;
      }

      // eslint-disable-next-line camelcase
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
    djangoVersion() {
      return this.api ? this.api.django : null;
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
            this.errors.push(createError(response.error, 'add-on'));
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

<style lang="scss">
@import 'photon-colors/photon-colors.scss';

body {
  color: $grey-90;
  font-family: 'Fira Sans';
  font-size: 13px;
  font-weight: 400;
}

a {
  color: $blue-60;

  &:active {
    color: $blue-70;
  }

  &:focus {
    box-shadow: 0 0 0 2px #0a84ff, 0 0 0 6px rgba(10, 132, 255, 0.3);
  }
}

.text-section-header {
  font-size: 28px;
  font-weight: 300;
}

.App {
  .App-info-panels {
    -moz-user-select: text;
    display: flex;

    .App-info-panel {
      margin: 0 20px;
      min-height: 200px;
      min-width: 230px;

      h3 {
        font-size: 17px;
        font-weight: 500;
      }
    }
  }
}

.App-errors {
  background-color: $red-60;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: $white-100;
  padding: 10px;

  p {
    padding: 0 10px 0;
  }
}
</style>
