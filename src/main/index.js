import { app, BrowserWindow } from 'electron'

const electron = require('electron');
const ipc = electron.ipcMain

const { dialog } = require('electron');

const path = require('path');

//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
const Menu = electron.Menu;
const Tray = electron.Tray;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

//托盘对象
var appTray = null;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: '宝宝来监督你学习',
    skipTaskbar: false,
    frame: false//添加这一行采用无边框窗口
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //系统托盘右键菜单
  var trayMenuTemplate = [
    {
      label: '热爱学习',
      click: () => {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
      }
    },
    {
      label: '关于宝宝',
      click: function () {
        dialog.showMessageBox({
          type: 'info',
          title: '来打王者么？',
          message: '没啥好说的啦',
          buttons: ['好的', '哦']
        }, (index) => {
          // if (index === 0) {
          //   mainWindow = null;
          //   // app.quit();不要用quit()，会弹两次
          //   app.exit();
          // } else {
          //   e.preventDefault();//阻止默认行为
          // }
        })
      }
    },
    {
      label: '不可以退出',
      click: function () {
        //ipc.send('close-main-window');
        app.quit();
      }
    }
  ];

  //系统托盘图标目录
  appTray = new Tray(path.join(__static, 'favicon.ico'));

  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('This is my application.');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('window-min', function () {
  mainWindow.minimize();
})


ipc.on('window-max', function () {
  mainWindow.maximize();
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
