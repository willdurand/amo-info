<template>
  <div class="App section">
    <div class="container">
      <h1 class="App-title title">amo-info</h1>

      <div class="notification is-danger" v-if="errors.length">
        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
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
          <div class="experiments column" v-if="config.hasExperiments">
            <h3>a/b experiments</h3>

            <DataTable v-bind:items="experiments" />
          </div>

          <div class="feature-flags column" v-if="config.hasFeatureFlags">
            <h3>feature flags</h3>

            <DataTable v-bind:items="featureFlags" />
          </div>

          <Commit v-bind:sha="appCommit" v-bind:repo="config.appRepo" />

          <ProjectVersion
            v-if="app && app.version"
            v-bind:no-milestone="config.hasMilestone === false"
            v-bind:no-push-doc="config.pushDoc === false"
            v-bind:version="app.version"
          />

          <ProjectRepo v-bind:repository="config.appRepo" />
        </template>
        <template v-else>
          <Value title="python" v-bind:value="pythonVersion" />

          <Value title="django" v-bind:value="djangoVersion" />

          <Commit v-bind:sha="apiCommit" v-bind:repo="config.apiRepo" />

          <ProjectVersion
            v-if="api && api.version"
            v-bind:no-milestone="config.hasMilestone === false"
            v-bind:version="api.version"
          />

          <ProjectRepo v-bind:repository="config.apiRepo" />
        </template>
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
    appCommit() {
      return this.app ? this.app.commit : null;
    },
    apiCommit() {
      return this.api ? this.api.commit : null;
    },
    currentName() {
      return this.currentTab === 'app'
        ? this.config.appName
        : this.config.apiName;
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

.App-title {
  font-weight: 300;
}

.App {
  width: 350px;

  .App-info-panel {
    -moz-user-select: text;

    h3 {
      font-size: 17px;
      font-weight: 500;
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
