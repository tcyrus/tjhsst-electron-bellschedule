var menubar = require('menubar')

var mb = menubar({width:230, height:220})

mb.on('ready', function ready() {
  console.log('App is Ready')
})
