const {ipcRenderer} = require('electron')

window.date = false

Date.prototype.yyyymmdd = () => {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	mm = mm[1] ? mm : `0${mm[0]}`;
	dd = dd[1] ? dd : `0${dd[0]}`;
	return `${yyyy}-${mm}-${dd}`; // padding
}

$(document).ready(() => {
	$(document).ajaxComplete(modifyHTML)

	$(document).keydown(e => {
		console.log(e.keyCode);
		switch (e.keyCode) {
			case 37:
				// left
				if (window.date) $('.schedule-outer .schedule-left').click()
				break;
			case 39:
				// right
				if (window.date) $('.schedule-outer .schedule-right').click()
				break
			case 81:
				// Q
				ipcRenderer.send('quit')
				break;
			case 82:
				// R
				console.info('R')
				if (window.date) scheduleView(date)
				else initDayschedule()
				break;
			case 84:
				// T
				initDayschedule();
				break;
			default:
				break;
		}
	})

	initDayschedule()
})

function modifyHTML() {
	$sch = $('.schedule')
	$sch.attr('data-endpoint', `https://ion.tjhsst.edu${$sch.attr('data-endpoint')}`)
	$sch.contents().eq(2).wrap('<span class="day-type">')
	scheduleBind();
}

function loadError() {
	$('.day-name').text('Error').attr('class', 'day-name')
	$('.schedule').contents().eq(2)[0].textContent = 'Press R to Reload'
	$('.bellschedule-table').remove()
}

function initDayschedule() {
	$('.schedule-outer').load('https://ion.tjhsst.edu/schedule/view .schedule', (response, status, xhr) => {
		if (status == 'error') loadError()
		window.date = true

		scheduleBind()
		displayPeriod()
	});
}
