const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const { notify, handler } = require('./communicate');

autoUpdater.autoDownload = false;

/**
 * Autoupdater events
 */
autoUpdater.on('update-available', info => {
  notify('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  notify('up-to-date');
});

autoUpdater.on('download-progress', progress => {
  notify('update-download-progress', progress);
});

autoUpdater.on('update-downloaded', (event, info) => {
  notify('update-download-finished');
});

autoUpdater.on('error', (event, error) => {
  //TODO: Remove, integrate in Angular
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
});

/**
 * IPC events
 */
handler('check-update', () => {
  autoUpdater.checkForUpdates();

  notify('check-update-started');
});

handler('download-update', () => {
  autoUpdater.downloadUpdate();

  notify('update-download-started');
});

handler('install-update', () => {
  notify('install-update-starting');

  autoUpdater.quitAndInstall();
});

module.exports = {
  autoUpdater
};
