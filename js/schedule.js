function scheduleBind() {
	$('.schedule-outer .schedule-left').click(() => {
		event.preventDefault();
		scheduleView(-1);
	});

	$('.schedule-outer .schedule-right').click(() => {
		event.preventDefault();
		scheduleView(1);
	});
}

function scheduleView(reldate) {
	$sch = $('.schedule');
	var endpoint = $sch.attr('data-endpoint');
	var prev = $sch.attr('data-prev-date');
	var next = $sch.attr('data-next-date');
	if (reldate == 1) date = next;
	else if (reldate == -1) date = prev;
	else date = reldate;

	console.info(date);

	$.get(endpoint, {'date': date, 'no_outer': true}, d => {
		$('.schedule-outer').html(d);
		scheduleBind();
		setTimeout(displayPeriod, 50);
	});
};

function formatDate(date) {
	// console.log('date:', date);
	var parts = date.split('-');
	return new Date(parts[0], parts[1]-1, parts[2]);
}

function formatTime(time, date) {
	var d = new Date(date);
	var tm = time.split(':');
	var hr = parseInt(tm[0]);
	var mn = parseInt(tm[1]);
	d.setHours(hr < 7 ? hr+12 : hr);
	d.setMinutes(mn);
	return d;
}


function getPeriods() {
	$sch = $('.schedule');
	var blocks = $('.schedule-block[data-block-order]', $sch);
	var periods = [];
	var curDate = formatDate($sch.attr('data-date'));

	blocks.each(function() {
		var start = $(this).attr('data-block-start');
		var startDate = formatTime(start, curDate);

		var end = $(this).attr('data-block-end');
		var endDate = formatTime(end, curDate);

		periods.push({
			'name': $(this).attr('data-block-name'),
			'start': {
				'str': start,
				'date': startDate
			},
			'end': {
				'str': end,
				'date': endDate
			},
			'order': $(this).attr('data-block-order')
		});
	});

	return periods;
}

function getPeriodElem(period) {
	return $(`.schedule-block[data-block-order='${period.order}']`);
}

function withinPeriod(period, now) {
	var st = period['start'].date;
	var en = period['end'].date;
	return now >= st && now < en;
}

function betweenPeriod(period1, period2, now) {
	var en = period1['end'].date;
	var st = period2['start'].date;
	return now >= en && now < st;
}


function getCurrentPeriod(now) {
	$sch = $('.schedule');
	var schDate = $sch.attr('data-date');
	if (!schDate) return;
	var curDate = formatDate(schDate);
	var periods = getPeriods();
	if (!now) now = new Date();

	for(var i = 0; i < periods.length; i++) {
		var period = periods[i];
		if (withinPeriod(period, now)) {
			return {
				'status': 'in',
				'period': period
			};
		}
		if (i+1 < periods.length && betweenPeriod(period, periods[i+1], now)) {
			return {
				'status': 'between',
				'prev': period,
				'next': periods[i+1]
			};
		}
	}
	return false;
}

function displayPeriod(now) {
	$sch = $('.schedule');
	if (!now) var now = new Date();
	var current = getCurrentPeriod(now);
	//if (current != window.prevPeriod) console.debug(now.getHours()+":"+now.getMinutes(), "current:", current);
	window.prevPeriod = current;
	$('.schedule-block').removeClass('current');
	$('.schedule-block-between').remove()

	if (current) {
		if (current['status'] == 'in') {
			var p = getPeriodElem(current['period']);
			p.addClass('current');
		} else if (current['status'] == 'between') {
			var prev = getPeriodElem(current['prev']);
			var next = getPeriodElem(current['next']);
			var times = `${current['prev']['end'].str} - ${current['next']['start'].str}`;
			prev.after(`<tr class='schedule-block schedule-block-between current'><th>Passing:</th><td>${times}</td></tr>`);
		}
	}
}

$(document).ready(() => {
    window.prevPeriod = null;
    scheduleBind();
    displayPeriod();
    setInterval(displayPeriod, 10000);
});
