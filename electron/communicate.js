const { BrowserWindow, ipcMain } = require('electron');

function notify(title, message) {
  let windows = BrowserWindow.getAllWindows();

  windows[0].webContents.send(title, message);
}

function handler(event, func) {
  ipcMain.on(event, func);
}

module.exports = {
  notify,
  handler
};
