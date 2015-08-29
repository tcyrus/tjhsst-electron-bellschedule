var menubar = require('menubar')

var mb = menubar({width:230})

mb.on('ready', function ready() {
  console.log('App is Ready')
})
