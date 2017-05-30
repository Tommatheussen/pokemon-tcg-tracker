const { app, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('./updater');
const { notify } = require('./communicate');

const template = [
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Check for Updates',
        click() {
          autoUpdater.checkForUpdates()
        }
      },
      {
        label: 'Report a bug',
        click() {
          require('electron').shell.openExternal('https://github.com/Tommatheussen/pokemon-tcg-tracker/issues');
        }
      }/*,
      {
        label: 'About',
        click() {
          notify('about');
        }
      }*/
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)