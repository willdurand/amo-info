const projects = {
  code: {
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'code-manager',
    appVersion: '__version__',
    hasExperiments: false,
    hasFeatureFlags: false,
    repo: 'addons-code-manager',
  },
  discovery: {
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'discopane',
    appVersion: '__frontend_version__',
    hasExperiments: true,
    hasFeatureFlags: true,
    repo: 'addons-frontend',
  },
  frontend: {
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'addons-frontend',
    appVersion: '__frontend_version__',
    hasExperiments: true,
    hasFeatureFlags: true,
    repo: 'addons-frontend',
  },
};

const Env = {
  DEV: 'dev',
  PROD: 'prod',
  STAGE: 'stage',
};

export const defaultConfig = {
  apiName: 'api',
  appName: 'app',
  hasExperiments: false,
  hasFeatureFlags: false,
};

export const projectsByOrigin = {
  'https://addons-dev.allizom.org': {
    ...projects.frontend,
    env: Env.DEV,
  },
  'https://addons.allizom.org': {
    ...projects.frontend,
    env: Env.STAGE,
  },
  'https://addons.mozilla.org': {
    ...projects.frontend,
    env: Env.PROD,
  },
  'https://code.addons-dev.allizom.org': {
    ...projects.code,
    apiOrigin: 'https://addons-dev.allizom.org',
    env: Env.DEV,
  },
  'https://code.addons.allizom.org': {
    ...projects.code,
    apiOrigin: 'https://addons.allizom.org',
    env: Env.STAGE,
  },
  'https://code.addons.mozilla.org': {
    ...projects.code,
    apiOrigin: 'https://addons.mozilla.org',
    env: Env.PROD,
  },
  'https://discovery.addons-dev.allizom.org': {
    ...projects.discovery,
    env: Env.DEV,
  },
  'https://discovery.addons.allizom.org': {
    ...projects.discovery,
    env: Env.STAGE,
  },
  'https://discovery.addons.mozilla.org': {
    ...projects.discovery,
    env: Env.PROD,
  },
};
