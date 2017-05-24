const { autoUpdater } = require("electron-updater");
const { ipcMain } = require('electron');
const { mainWindow } = require('../main');

console.log(mainWindow);

autoUpdater.autoDownload = false;

/**
 * Autoupdater events
 */
autoUpdater.on('update-available', () => {
  console.log('update-available');
  mainWindow.webContents.send('test');
});

ipcMain.on('start-update', (event, args) => {
  console.log('start update check');
  autoUpdater.checkForUpdates();
});



autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
})

autoUpdater.on('update-downloaded', (ev, info) => {
  autoUpdater.quitAndInstall();
})

autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

//autoUpdater.checkForUpdates();