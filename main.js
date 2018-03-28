const electron = require('electron');
const isDev = require('electron-is-dev');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// import the module
const splashScreen = require('@trodi/electron-splashscreen');

width = process.platform === 'darwin' ? 1025 : 1041;
const mainOpts = {
  width: width,
  minWidth: width,
  height: 600,
  minHeight: 600,
  show: false
};
// configure the splashscreen
const config = {
  windowOpts: mainOpts,
  templateUrl: `${__dirname}/build/cb70m-hvtim.svg`,
  splashScreenOpts: {
    width: 512,
    height: 512,
    transparent: true
  },
  delay: 0, // force show immediately since example will load fast
  minVisible: 500 // show for 1.5s so example is obvious
};
// initialize the splashscreen handling

function createWindow() {
  // Create the browser window.

  // Make sure content is always shown on big screen, never collapsed together
  // Windows adds the scrollbar inside of the window
  // mainWindow = new BrowserWindow(});

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('file://' + __dirname + '/build_client/index.html');
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  require('./electron/menu');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  console.log('app ready');
  mainWindow = splashScreen.initSplashScreen(config);
  console.log('splash should be here now');
  const database = require('./electron/database');
  console.log('database loaded');
  database.updateSets().then(() => {
    console.log('Now main window!');
    createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

if (!isDev) {
  require('./electron/updater');
} else {
  // Enable live reload for Electron too
  require('electron-reload')('./electron/**/**', {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
  });
}
