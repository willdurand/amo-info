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
      .catch((error) => resolve({ type: 'error', error: error.toString() }));
  });
};

browser.runtime.onMessage.addListener(({ from, origin }) => {
  if (from !== 'popup') {
    return Promise.resolve({ type: 'unknown' });
  }

  return browser.storage.sync
    .get('isCorsAnywhereEnabled')
    .then(({ isCorsAnywhereEnabled }) => {
      const options = {};

      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1450649
      if (!!isCorsAnywhereEnabled || origin === 'https://addons.mozilla.org') {
        if (isCorsAnywhereEnabled) {
          // eslint-disable-next-line no-console
          console.debug('replacing "origin" because of user preference');
        } else {
          // eslint-disable-next-line no-console
          console.debug('replacing "origin" because of a FF restriction');
        }

        // eslint-disable-next-line no-param-reassign
        origin = `https://cors-anywhere.herokuapp.com/${origin}`;
        options.headers = new Headers({ 'x-requested-with': 'amo-info' });
      }

      return Promise.all([
        fetchVersion({ endpoint: `${origin}/__frontend_version__`, options }),
        fetchVersion({ endpoint: `${origin}/__version__`, options }),
      ]);
    });
});
