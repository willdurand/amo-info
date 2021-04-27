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
          <li
            v-if="config.extraName"
            :class="[currentTab === 'extra' ? 'is-active' : '']"
          >
            <a @click="currentTab = 'extra'">{{ config.extraName }}</a>
          </li>
        </ul>
      </div>

      <div class="App-info-panel columns">
        <Value title="environment" v-bind:value="config.env" />

        <template v-if="currentTab === 'app'">
          <div v-if="config.hasExperiments" class="experiments column">
            <h3>experiments</h3>

            <DataTable :items="experiments" />
          </div>

          <div v-if="config.hasFeatureFlags" class="feature-flags column">
            <h3>feature flags</h3>

            <DataTable :items="featureFlags" />
          </div>
        </template>
        <template v-if="currentTab === 'api'">
          <Value title="python" v-bind:value="pythonVersion" />

          <Value title="django" v-bind:value="djangoVersion" />
        </template>
        <template v-if="currentTab === 'extra'">
          <Value title="build time" v-bind:value="buildtime" />
        </template>

        <Commit :sha="currentCommit" v-bind:repo="currentRepo" />

        <ProjectVersion
          :no-milestone="
            config.hasMilestone === false || currentTab === 'extra'
          "
          :no-push-doc="config.pushDoc === false || currentTab === 'extra'"
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
import { getExperimentName } from '../helpers';

const createError = (error, context) => {
  return `[${context} error] ${error.message || error}`;
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
        (array, key) =>
          array.concat({
            name: getExperimentName(key),
            enabled: experiments[key],
          }),
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
    buildtime() {
      return this.extra ? this.extra.buildtime : null;
    },
    currentCommit() {
      if (this[this.currentTab]) {
        return this[this.currentTab].commit || null;
      }

      return null;
    },
    currentName() {
      switch (this.currentTab) {
        case 'app':
          return this.config.appName;
        case 'api':
          return this.config.apiName;
        case 'extra':
          return this.config.extraName;
        default:
          return null;
      }
    },
    currentRepo() {
      switch (this.currentTab) {
        case 'app':
          return this.config.appRepo;
        case 'api':
          return this.config.apiRepo;
        case 'extra':
          return this.config.extraRepo;
        default:
          return null;
      }
    },
    currentVersion() {
      if (this[this.currentTab]) {
        return this[this.currentTab].version || null;
      }

      return null;
    },
  },
  mounted() {
    if (typeof browser === 'undefined') {
      return;
    }

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

          const [app, api, extra] = response;

          if (app.type === 'success') {
            this.app = app.payload;
          } else if (app.type === 'error') {
            this.errors.push(createError(app.error, this.config.appName));
          }

          if (api) {
            if (api.type === 'success') {
              this.api = api.payload;
            } else if (api.type === 'error') {
              this.errors.push(createError(api.error, this.config.apiName));
            }
          } else {
            this.api = null;
          }

          if (extra) {
            if (extra.type === 'success') {
              this.extra = extra.payload;
            } else if (extra.type === 'error') {
              this.errors.push(createError(extra.error, this.config.extraName));
            }
          } else {
            this.extra = null;
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
