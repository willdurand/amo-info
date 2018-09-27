browser.runtime.onMessage.addListener(({ from, origin }) => {
  if (from === 'popup') {
    const options = {};

    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1450649
    if (origin === 'https://addons.mozilla.org') {
      // eslint-disable-next-line no-param-reassign
      origin = `https://cors-anywhere.herokuapp.com/${origin}`;
      options.headers = new Headers({ 'x-requested-with': 'amo-info' });
    }

    return fetch(`${origin}/__frontend_version__`, options)
      .then((response) => response.json())
      .then((payload) => Promise.resolve({ type: 'success', payload }))
      .catch((error) => Promise.resolve({ type: 'error', error }));
  }

  return Promise.resolve({ type: 'unknown' });
});
