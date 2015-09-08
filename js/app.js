var ipc = require('ipc');

currentdate = -1

$(function() {
	init_dayschedule();
	$(document).ajaxComplete(function() {
		modifyHTML();
	});
	$(document).keydown(function(e) {
		switch (e.keyCode) {
			case 37:
				// left
				if (currentdate != -1) {
					$(".fa-chevron-left").trigger("click");
				}
				break;
			case 39:
				// right
				if (currentdate != -1) {
					$(".fa-chevron-right").trigger("click");
				}
				break;
			case 81:
				// Q
				ipc.send('quit', '');
				break;
			case 82:
				// R
				if (currentdate == -1) {
					init_dayschedule();
				} else {
					dayschedule_ajax(currentdate);
				}
				break;
			case 84:
				// T
				init_dayschedule();
				break;
			default:
				break;
		}
	});
});

function modifyHTML() {
	$('a').each(function() {
  	var href = $(this).attr('href');
  	$(this).attr('onclick', "dayschedule_ajax('" + href.substring(7) + "')").removeAttr('href');
	});
}

function init_dayschedule() {
	$('body').load('https://ion.tjhsst.edu/schedule/embed div.center-wrapper', function(response, status, xhr) {
		if (status == 'error') {
			$('.day-name').text('Error');
			currentdate = -1;
		} else {
			currentdate = 0;
		}
	});
}

function dayschedule_ajax(str) {
	currentdate = str;
	$('body').load('https://ion.tjhsst.edu/schedule/embed?date='+str+' div.center-wrapper', function(response, status, xhr) {
		if (status == 'error') {
			$('.day-name').text('Error');
		}
	});
}
