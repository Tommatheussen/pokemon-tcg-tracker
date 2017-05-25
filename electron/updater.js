const { autoUpdater } = require("electron-updater");
const { dialog, BrowserWindow, ipcMain } = require('electron');

autoUpdater.autoDownload = false;

/**
 * Autoupdater events
 */
autoUpdater.on('update-available', (info) => {
  notify("update-available", info);
});

autoUpdater.on('update-not-available', () => {
  notify("up-to-date");
});

autoUpdater.on('update-downloaded', (event, info) => {
  dialog.showMessageBox({
    title: 'Update downloaded',
    message: 'New version downloaded, installing now'
  }, (buttonIndex) => {
    autoUpdater.quitAndInstall();
  });
});



autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})


/**
 * IPC events
 */
ipcMain.on("check-update", () => {
  autoUpdater.checkForUpdates();

  notify("check-update-started");
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

function notify(title, message) {
  let windows = BrowserWindow.getAllWindows();

  windows[0].webContents.send(title, message);
}