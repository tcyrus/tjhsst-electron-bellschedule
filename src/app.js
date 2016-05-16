const {ipcRenderer} = require('electron')

window.date = false

Date.prototype.yyyymmdd = () => {
	let yyyy = this.getFullYear().toString()
	let mm = (this.getMonth()+1).toString() // getMonth() is zero-based
	let dd  = this.getDate().toString()
	mm = mm[1] ? mm : `0${mm[0]}`
	dd = dd[1] ? dd : `0${dd[0]}`
	return `${yyyy}-${mm}-${dd}` // padding
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
	scheduleBind();
}

function loadError() {
	$('.schedule-date').text('Please Reload');
}

function initDayschedule() {
	$('.schedule-outer').load('https://ion.tjhsst.edu/schedule/view .schedule', (response, status, xhr) => {
		if (status == 'error') return loadError()
		window.date = true

		scheduleBind()
		displayPeriod()

		var title = ""
		const arg = window.prevPeriod
		if (arg.status === "in")
			title = `${arg.period.start.str} - ${arg.period.end.str}`
		else if (arg.status === "between")
			title = `${arg.prev.end.str} - ${arg.next.start.str}`
    	ipcRenderer.send('title', title)
	});
}
