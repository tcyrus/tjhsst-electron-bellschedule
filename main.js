var ipc = require('ipc');
var menubar = require('menubar');

var mb = menubar({width:250, height:225});

mb.on('ready', function ready() {
  console.log('App is Ready');
});

ipc.on('quit', function(event, arg) {
  mb.app.quit();
});
