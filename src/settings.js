const Env = {
  DEV: 'dev',
  LOCAL: 'local',
  PROD: 'prod',
  STAGE: 'stage',
};

export const defaultConfig = {
  apiName: 'api',
  apiRepo: null,
  apiVersion: null,
  appName: 'app',
  appRepo: null,
  appVersion: null,
  hasExperiments: false,
  hasFeatureFlags: false,
  hasMilestone: true,
  pushDoc: true,
  // Allow a third repo per project... One day, we'll refactor all this mess.
  extraName: null,
  extraVersion: null,
  extraRepo: null,
};

const projects = {
  code: {
    ...defaultConfig,
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'code-manager',
    appVersion: '__version__',
    hasExperiments: false,
    hasFeatureFlags: false,
    appRepo: 'addons-code-manager',
    apiRepo: 'addons-server',
  },
  discovery: {
    ...defaultConfig,
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'discopane',
    appVersion: '__frontend_version__',
    hasExperiments: true,
    hasFeatureFlags: true,
    appRepo: 'addons-frontend',
    apiRepo: 'addons-server',
  },
  frontend: {
    ...defaultConfig,
    apiName: 'server',
    apiVersion: '__version__',
    appName: 'frontend',
    appVersion: '__frontend_version__',
    extraName: 'blog',
    extraVersion: 'blog/__version__',
    hasExperiments: true,
    hasFeatureFlags: true,
    appRepo: 'addons-frontend',
    apiRepo: 'addons-server',
    extraRepo: 'addons-blog',
  },
  reviewerTools: {
    ...defaultConfig,
    apiName: 'addons-server',
    apiVersion: '__version__',
    appName: 'reviewer tools',
    appVersion: '__version__',
    hasExperiments: false,
    hasFeatureFlags: false,
    appRepo: 'addons-server',
    apiRepo: 'addons-server',
  },
  extensionWorkshop: {
    ...defaultConfig,
    apiName: null,
    apiVersion: null,
    appName: 'extension workshop',
    appVersion: '__version__',
    hasExperiments: false,
    hasFeatureFlags: false,
    appRepo: 'extension-workshop',
    apiRepo: null,
    pushDoc: false,
    hasMilestone: false,
  },
};

export const projectsByOrigin = {
  'http://olympia.test': {
    ...projects.frontend,
    env: Env.LOCAL,
    pushDoc: false,
    hasMilestone: false,
    extraName: null,
  },
  'http://localhost:3000': {
    ...projects.frontend,
    env: Env.LOCAL,
    pushDoc: false,
    hasMilestone: false,
    extraName: null,
  },
  'https://example.com:3000': {
    ...projects.frontend,
    env: Env.LOCAL,
    pushDoc: false,
    hasMilestone: false,
    extraName: null,
  },
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
  'https://reviewers.addons-dev.allizom.org': {
    ...projects.reviewerTools,
    env: Env.DEV,
  },
  'https://reviewers.addons.allizom.org': {
    ...projects.reviewerTools,
    env: Env.STAGE,
  },
  'https://reviewers.addons.mozilla.org': {
    ...projects.reviewerTools,
    env: Env.PROD,
  },
  'https://extensionworkshop-dev.allizom.org': {
    ...projects.extensionWorkshop,
    env: Env.DEV,
  },
  'https://extensionworkshop.allizom.org': {
    ...projects.extensionWorkshop,
    env: Env.STAGE,
  },
  'https://extensionworkshop.com': {
    ...projects.extensionWorkshop,
    env: Env.PROD,
  },
};
