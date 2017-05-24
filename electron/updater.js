const { autoUpdater } = require("electron-updater");
const { dialog } = require('electron');

autoUpdater.autoDownload = false;
/**
 * Autoupdater events
 */
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Yes', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
});

autoUpdater.on('update-downloaded', (event, info) => {
  dialog.showMessageBox({
    title: 'Update downloaded',
    message: 'New version downloaded, installing now'
  }, (buttonIndex) => {
    autoUpdater.quitAndInstall();
  });
});

/*
autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
})*/

autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.checkForUpdates();