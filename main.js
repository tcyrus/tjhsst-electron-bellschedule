const {ipcMain} = require('electron')
const menubar = require('menubar')

const mb = menubar({width: 280, height: 275, 'preload-window': true})

mb.on('ready', () => {
	console.log('App is Ready')
})

/*mb.on('after-create-window', () => {
	mb.window.openDevTools()
})*/

ipcMain.on('title', (event, arg) => {
	mb.tray.setTitle(arg)
})

ipcMain.on('quit', (event, arg) => {
	mb.app.quit()
})
