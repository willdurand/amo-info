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

  return browser.storage.sync
    .get('isCorsAnywhereEnabled')
    .then(({ isCorsAnywhereEnabled }) => {
      const config = projectsByOrigin[origin] || null;

      if (!config) {
        return Promise.resolve({
          type: 'error',
          error: `config not found for origin = "${origin}"`,
        });
      }

      const options = {};
      let appOrigin = config.appOrigin || origin;
      let apiOrigin = config.apiOrigin || origin;

      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1450649
      if (!!isCorsAnywhereEnabled || origin.includes('addons.mozilla.org')) {
        if (isCorsAnywhereEnabled) {
          // eslint-disable-next-line no-console
          console.debug('replacing "origin" because of user preference');
        } else {
          // eslint-disable-next-line no-console
          console.debug('replacing "origin" because of a FF restriction');
        }

        // eslint-disable-next-line no-param-reassign
        appOrigin = `https://cors-anywhere.herokuapp.com/${appOrigin}`;
        apiOrigin = `https://cors-anywhere.herokuapp.com/${apiOrigin}`;
        options.headers = new Headers({ 'x-requested-with': 'amo-info' });
      }

      console.log({ appOrigin, apiOrigin });

      return Promise.all([
        fetchVersion({
          endpoint: `${appOrigin}/${config.appVersion}`,
          options,
        }),
        fetchVersion({
          endpoint: `${apiOrigin}/${config.apiVersion}`,
          options,
        }),
      ]);
    });
});
