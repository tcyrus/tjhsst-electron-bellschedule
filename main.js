const {ipcMain} = require('electron')
const menubar = require('menubar')

const mb = menubar({
	width: 300,
	height: 275,
	'preload-window': true
})

mb.on('ready', () => console.log('App is Ready'))

ipcMain.on('devtools', () => mb.window.openDevTools())

ipcMain.on('title', (event, arg) => mb.tray.setTitle(arg))

ipcMain.on('quit', () => mb.app.quit())

mb.on('after-hide', () => mb.window.webContents.sendInputEvent({
	type: 'keyDown',
	keyCode: 'T'
}))