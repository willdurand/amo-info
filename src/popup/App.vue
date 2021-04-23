<template>
  <div class="App section">
    <div class="container">
      <h1 class="App-title title">amo-info</h1>

      <div v-if="errors.length" class="notification is-danger">
        <p v-for="error in errors" v-bind:key="error">
          {{ error }}
        </p>
      </div>

      <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li :class="[currentTab === 'app' ? 'is-active' : '']">
            <a @click="currentTab = 'app'">{{ config.appName }}</a>
          </li>
          <li
            v-if="config.apiName"
            :class="[currentTab === 'api' ? 'is-active' : '']"
          >
            <a @click="currentTab = 'api'">{{ config.apiName }}</a>
          </li>
        </ul>
      </div>

      <div class="App-info-panel columns">
        <Value title="environment" v-bind:value="config.env" />

        <template v-if="currentTab === 'app'">
          <div v-if="config.hasExperiments" class="experiments column">
            <h3>a/b experiments</h3>

            <DataTable :items="experiments" />
          </div>

          <div v-if="config.hasFeatureFlags" class="feature-flags column">
            <h3>feature flags</h3>

            <DataTable :items="featureFlags" />
          </div>
        </template>
        <template v-else>
          <Value title="python" v-bind:value="pythonVersion" />

          <Value title="django" v-bind:value="djangoVersion" />
        </template>

        <Commit :sha="currentCommit" v-bind:repo="currentRepo" />

        <ProjectVersion
          :no-milestone="config.hasMilestone === false"
          :no-push-doc="config.pushDoc === false"
          :version="currentVersion"
          v-if="currentVersion"
        />

        <ProjectRepo :repository="currentRepo" />
      </div>
    </div>
  </div>
</template>

<script>
import Commit from './Commit';
import DataTable from './DataTable';
import ProjectRepo from './ProjectRepo';
import ProjectVersion from './ProjectVersion';
import Value from './Value';
import { projectsByOrigin, defaultConfig } from '../settings';

const createError = (error, context) => {
  return `The ${context} returned an error: ${error.message || error}`;
};

export default {
  components: {
    Commit,
    DataTable,
    ProjectRepo,
    ProjectVersion,
    Value,
  },
  data() {
    return {
      api: null,
      app: null,
      config: defaultConfig,
      currentTab: 'app',
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
        [],
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
        [],
      );
    },
    pythonVersion() {
      return this.api ? this.api.python : null;
    },
    djangoVersion() {
      return this.api ? this.api.django : null;
    },
    currentCommit() {
      if (this.currentTab === 'app') {
        return this.app ? this.app.commit : null;
      }

      return this.api ? this.api.commit : null;
    },
    currentName() {
      return this.currentTab === 'app'
        ? this.config.appName
        : this.config.apiName;
    },
    currentRepo() {
      return this.currentTab === 'app'
        ? this.config.appRepo
        : this.config.apiRepo;
    },
    currentVersion() {
      if (this.currentTab === 'app') {
        return this.app ? this.app.version : null;
      }

      return this.api ? this.api.version : null;
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

$column-gap: 0.4rem;
$family-sans-serif: 'Fira Sans';
$section-padding: 1rem;

@import 'bulma/bulma.sass';

body {
  color: $grey-90;
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

.App {
  width: 350px;

  .App-title {
    font-weight: 300;
  }

  .App-info-panel {
    -moz-user-select: text;

    h3 {
      font-size: 17px;
      font-weight: 500;
    }
  }
}
</style>
