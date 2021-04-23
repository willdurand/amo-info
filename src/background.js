import { projectsByOrigin } from './settings';

const fetchVersion = ({ endpoint, options }) => {
  return new Promise((resolve) => {
    return fetch(endpoint, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP call returned: ${response.status}`);
        }

        return response;
      })
      .then((response) => response.json())
      .then((payload) => resolve({ type: 'success', payload }))
      .catch((error) => resolve({ type: 'error', error: error.message }));
  });
};

browser.runtime.onMessage.addListener(({ from, origin }) => {
  if (from !== 'popup') {
    return Promise.resolve({ type: 'error', error: 'invalid "from" value' });
  }

  const config = projectsByOrigin[origin] || null;

  if (!config) {
    return Promise.resolve({
      type: 'error',
      error: `config not found for origin = "${origin}"`,
    });
  }

  const options = {
    mode: 'cors',
  };
  const appOrigin = config.appOrigin || origin;
  const apiOrigin = config.apiOrigin || origin;
  const extraOrigin = config.extraOrigin || origin;

  // TODO: https://bugzilla.mozilla.org/show_bug.cgi?id=1450649

  return Promise.all([
    fetchVersion({
      endpoint: `${appOrigin}/${config.appVersion}`,
      options,
    }),
    config.apiName === null
      ? Promise.resolve(null)
      : fetchVersion({
          endpoint: `${apiOrigin}/${config.apiVersion}`,
          options,
        }),
    config.extraName === null
      ? Promise.resolve(null)
      : fetchVersion({
          endpoint: `${extraOrigin}/${config.extraVersion}`,
          options,
        }),
  ]);
});
