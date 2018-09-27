browser.runtime.onMessage.addListener(({ from, origin }) => {
  if (from === 'popup') {
    fetch(`${origin}/__frontend_version__`)
      .then((response) => response.json())
      .then((payload) => {
        chrome.runtime.sendMessage({ type: 'success', payload });
      });
  }
});
