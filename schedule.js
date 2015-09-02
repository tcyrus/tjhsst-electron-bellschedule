Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
};

function getoffset(qd, days) {
	var dobj = new Date(parseInt(qd.substring(0,4)), parseInt(qd.substring(4,6))-1, parseInt(qd.substring(6,8)));
	var ms = 86400000;
	var newdobj = new Date(dobj.getTime()+(ms * days));
	return newdobj;
}

function day_jump(days) {
	var newdobj = getoffset(currentdate, days);
	load_date(newdobj.yyyymmdd());
}

function gettd(time) {
	if (parseInt(time.split(':')[0]) < 4) time = (parseInt(time.split(':')[0])+12) + ':' + time.split(':')[1];
	var d = new Date(), e = (''+d).split(' ');
	return new Date(e[0]+' '+e[1]+' '+e[2]+' '+e[3]+' '+time+':00 '+e[5]+' '+e[6]);
}

function check_current_pd(d) {
	for (var i=0; i<times.length; i++) {
		if (+d > times[i][1] && times[i][2] > +d) {
			return times[i];
		}
	}
}

function get_remaining_time(t) {
	var left = (t[2] - +new Date()) / 1000;
	var sec = (left % 60);
	var min = (left / 60) % 60;
	var hr = left / 60 / 60;

	return [parseInt(hr), parseInt(min), parseInt(sec)];
}

function select_current_pd() {
	var c = check_current_pd(new Date());
	$('.schedule-tbl .schedule-day').removeClass('now');
	if (c != null) $('.schedule-tbl .schedule-day[data-type="'+c[0]+'"]').addClass('now');
}

function show_remaining_time() {
	var c = check_current_pd(new Date());
	var r = get_remaining_time(c);
	var t = (r[0] > 0 ? r[0] + ' hour ' : '') + (r[1] > 0 ? r[1] + 'minutes ' : '');
	$('.day-remaining').html('<b>' + c[0] + '</b> ends in ' + t);
}

function processJSON(data) {
	$('.day-name span small').text(data['dayname']);

	$('.day-type').removeClass('red blue');
	if (data['summary'].search(/(red|blue)/i)!=-1) {
		$('.day-type').addClass(data['summary'].match(/(red|blue)/i)[0].toLowerCase());
	}
	$('.day-type').text(data['summary']);

	currentdate = data['date']['today'];
	tomorrowdate = data['date']['tomorrow'];
	yesterdaydate = data['date']['yesterday'];

	$('.schedule-tbl tbody').html('');

	times = [];

	$.each(data['schedule']['period'], function(index, val) {
		times.push([val['name'], gettd(val['times']['start']), gettd(val['times']['end'])]);
		$('.schedule-tbl tbody').append('<tr class="schedule-day" data-type="'+val['name']+'" data-start="'+val['times']['start']+'" data-end="'+val['times']['end']+'">');
		$('.schedule-tbl tbody').append('<th class="type">'+val['name']+':</th>');
		$('.schedule-tbl tbody').append('<td class="times">'+val['times']['times']+'</td>');
		$('.schedule-tbl tbody').append('</tr>');
	});
}

function load_date(date) {
	$.getJSON(i2root + 'ajax/dayschedule/json?date=' + date).done(function(data) {
		processJSON(data);
	}).fail(function() {
		$('.day-name span small').text('Error');
		$('.day-type').text('Press R to Reload');
	});
}

function load_current_date() {
	$.getJSON(i2root + 'ajax/dayschedule/json').done(function(data) {
  	processJSON(data);
	}).fail(function() {
		$('.day-name span small').text('Error');
		$('.day-type').text('Press R to Reload');
		currentdate = tomorrowdate = yesterdaydate = -1;
	});
}

function init_dayschedule() {
	load_current_date();
	$(document).ajaxComplete(function() {
		select_current_pd();
	});
	setInterval(select_current_pd, 30000);
}
