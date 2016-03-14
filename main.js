const ipc = require('electron').ipcMain;
const menubar = require('menubar');

const mb = menubar({width: 250, height: 275});

mb.on('ready', () => {
	console.log('App is Ready');
});

ipc.on('quit', (event, arg) => {
	mb.app.quit();
});
