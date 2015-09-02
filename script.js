var ipc = require('ipc');

window.$ = window.jQuery = require('jquery');
i2root = 'https://iodine.tjhsst.edu/';
dayschedule_type = 'box';

$(function() {
	init_dayschedule();

  $(document).keydown(function(e) {
    switch (e.keyCode) {
      case 37:
        // left
				if (currentdate!=-1) {load_date(yesterdaydate)}
        break;
      case 39:
        // right
				if (currentdate!=-1) {load_date(tomorrowdate)}
        break;
      case 81:
        // Q
        ipc.send('quit','');
        break;
      case 82:
        // R
				if (currentdate == -1) {
					load_current_date();
				} else {
        	load_date(currentdate);
				}
        break;
      case 84:
        // T
        load_current_date();
        break;
      default:
        break;
    }
  });

});
