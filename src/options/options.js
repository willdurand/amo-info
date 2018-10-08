const $corsAnywhere = document.querySelector('#cors-anywhere-enabled');

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.sync
    .get('isCorsAnywhereEnabled')
    .then(({ isCorsAnywhereEnabled }) => {
      $corsAnywhere.checked = !!isCorsAnywhereEnabled;
    });
});

document.querySelector('form').addEventListener('submit', () => {
  browser.storage.sync.set({
    isCorsAnywhereEnabled: $corsAnywhere.checked === true,
  });
});
