'use strict'

/* eslint no-path-concat: 0, func-names:0 */

const app = require('app')
const BrowserWindow = require('browser-window')
const Menu = require('menu')
const ipc = require('electron').ipcMain
const Shortcut = require('electron-shortcut')
const isPackaged = !process.argv[0].match(/(?:node|io)(?:\.exe)?/i)
const open = require('open')

// Force production environment in final binary
if (isPackaged) {
  process.env.NODE_ENV = 'production'
}

require('electron-debug')()
require('crash-reporter').start()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  let window = new BrowserWindow({ center: true, width: 1024, height: 728, resizable: true })

  if (process.env.NODE_ENV === 'development') {
    window.loadURL('file://' + __dirname + '/app/index-dev.html')
  } else {
    window.loadURL('file://' + __dirname + '/app/index.html')
  }

  window.maximize()

  window.on('closed', () => {
    window = null
  })

  const menus = [
    {
      label: '&Hyphe',
      submenu: [
        {
          label: '&Full Screen',
          accelerator: 'F11',
          click: () => {
            window.setFullScreen(!window.isFullScreen())
          }
        },
        {
          label: 'Reset',
          accelerator: 'Ctrl+R',
          click: () => {
            window.reload()
          }
        },
        {
          label: '&Quit',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }
  ]

  if (process.env.NODE_ENV === 'development') {
    window.openDevTools()
    menus.push({
      label: 'Debug',
      submenu: [
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'Alt+Shift+C',
          click: () => {
            window.toggleDevTools()
          }
        }
      ]
    })
  }

  window.setMenu(Menu.buildFromTemplate(menus))

  // shortcuts can only be handled here, in the main process
  let shortcuts = new Map()

  // ipcMain should be used, window.webContent.on is never triggered for ipc
  ipc.on('registerShortcut', (_, accel) => {
    shortcuts.set(accel, new Shortcut(accel, () => window.webContents.send(`shortcut-${accel}`)))
  })

  ipc.on('unregisterShortcut', (_, accel) => {
    shortcuts.get(accel).unregister()
    shortcuts.delete(accel)
  })

  // Open files in external app
  ipc.on('openExternal', (_, what, opener, cb) => {
    open(what, opener, cb)
  })
})
