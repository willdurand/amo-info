browser.runtime.onMessage.addListener(({ from, origin }) => {
  return new Promise((resolve, reject) => {
    if (from === 'popup') {
      const options = {};

      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1450649
      if (origin === 'https://addons.mozilla.org') {
        console.debug('replacing "origin" because of a FF restriction');

        // eslint-disable-next-line no-param-reassign
        origin = `https://cors-anywhere.herokuapp.com/${origin}`;
        options['headers'] = new Headers({ 'x-requested-with': 'amo-info' });
      }

      return fetch(`${origin}/__frontend_version__`, options)
        .then((response) => response.json())
        .then((payload) => resolve({ type: 'success', payload }))
        .catch((error) => resolve({ type: 'error', error }));
    }

    resolve({ type: 'unknown' });
  });
});
