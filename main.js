const {ipcMain} = require('electron')
const menubar = require('menubar')

const mb = menubar({width: 250, height: 275})

mb.on('ready', () => {
	console.log('App is Ready')
})

/*mb.on('after-create-window', () => {
	mb.window.openDevTools()
})*/

ipcMain.on('quit', (event, arg) => {
	mb.app.quit()
})
