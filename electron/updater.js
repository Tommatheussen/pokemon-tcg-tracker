const { autoUpdater } = require('electron-updater');
const { dialog, BrowserWindow, ipcMain } = require('electron');

autoUpdater.autoDownload = false;

/**
 * Autoupdater events
 */
autoUpdater.on('update-available', (info) => {
  notify('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  notify('up-to-date');
});

autoUpdater.on('download-progress', (progress) => {
  notify('update-download-progress', progress);
});

autoUpdater.on('update-downloaded', (event, info) => {
  notify('update-download-finished');
});



autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})


/**
 * IPC events
 */
ipcMain.on('check-update', () => {
  autoUpdater.checkForUpdates();

  notify('check-update-started');
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();

  notify('update-download-started');
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();

  notify('install-update-starting');
});

function notify(title, message) {
  let windows = BrowserWindow.getAllWindows();

  windows[0].webContents.send(title, message);
}