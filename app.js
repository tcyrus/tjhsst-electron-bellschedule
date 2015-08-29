Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]);
};

function getoffset(qd, days) {
	var dobj = new Date(['','January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(qd.substring(4,6))] + ' ' + parseInt(qd.substring(6,8)) + ', ' + parseInt(qd.substring(0,4)));
	var ms = 86400000;
	var newdobj = new Date(dobj.getTime()+(ms * days));
	return newdobj;
}

function day_jump(days) {
	var newdobj = getoffset(currentdate, days);
	//location.href = '?&date=' + newdobj.yyyymmdd();
	//console.log('Loading',newdobj.yyyymmdd());
	load_date(newdobj.yyyymmdd());
}

times = [];

function gettd(time) {
	if (parseInt(time.split(':')[0]) < 4) time = (parseInt(time.split(':')[0])+12) + ':' + time.split(':')[1];
	var d = new Date(), e = (''+d).split(' ');
	return new Date(e[0]+' '+e[1]+' '+e[2]+' '+e[3]+' '+time+':00 '+e[5]+' '+e[6]);
}

function get_times_array() {
	times = [];
	$p = $('.schedule-tbl .schedule-day');
	i = 0;
	$p.each(function() {
		times[i++] = ([$(this).attr('data-type'), gettd($(this).attr('data-start')), gettd($(this).attr('data-end'))]);
	});
}

function check_current_pd(d) {
	for (i=0; i<times.length; i++) {
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
	get_times_array();
	var c = check_current_pd(new Date());
	$('.schedule-tbl .schedule-day').removeClass('now');
	if (c != null) $('.schedule-tbl .schedule-day[data-type="'+c[0]+'"]').addClass('now');
}

function show_remaining_time() {
	get_times_array();
	var c = check_current_pd(new Date());
	var r = get_remaining_time(c);
	var t = (r[0] > 0 ? r[0] + ' hour ' : '') + (r[1] > 0 ? r[1] + 'minutes ' : '');
	$('.day-remaining').html('<b>' + c[0] + '</b> ends in ' + t);
}

function load_date(date) {
	var loc = (dayschedule_type == 'day' ? 'day' : 'box');
	$('body').load(i2root + 'ajax/dayschedule/' + loc + '?date=' + date + ' .dayschedule', function(d) {
		var spl = "var currentdate = '", end = "';";
		// get the contents in between those values--eg the new date
		if (d.indexOf(spl) != -1) {
			currentdate = d.split(spl)[1].split(end)[0];
			//console.log('Date Now', currentdate);
		}
	});
}

/*
function load_week(date) {
	$.get(i2root + 'ajax/dayschedule/week', {'date': date}, function(dat) {
		window.dat = dat;
		$('#mainbox, #intraboxes').addClass('hide');
		$('body').append("<div class='dayschedule-week-fixed' style='display:none'><div class='back' onclick='week_back()'><span class='day-up'>&#9650; Back</span></div><div class='dayschedule week'></div></div>");
		if ($('.dayschedule').hasClass('box')) {
			$('.dayschedule-week-fixed, .dayschedule.week').addClass('box');
		}
		$d = $('.dayschedule.week');
		$d.addClass('week');
		h = "<table><tr>";
		for (var i=0; i<dat.length; i++) {
			h += "<td>" + $('.dayschedule', '<div>' + dat[i] + '</div>').html() + "</td>";
		}
		h += "</tr><tr><td colspan=5>Schedules are subject to change. Look at the <a href='http://www.calendarwiz.com/calendars/calendar.php?crd=tjhsstcalendar'>official TJ Calendar</a> for more information.</td></tr></table>";
		$d.html(h);
		$('.dayschedule-week-fixed').slideDown();

		// reassign left and right buttons
		//$l = $('.dayschedule tr td:first-child .day-left');
		//$r = $('.dayschedule tr td:last-child .day-right');
		//$l.attr('onclick', 'week_jump(-1)');
		//$r.attr('onclick', 'week_jump(1)');
	}, 'json');
}

function week_jump(days) {
	var offset = getoffset(mon, days)
}

function week_back() {
	$('#mainbox, #intraboxes, .boxes').removeClass('hide');
	load_date(currentdate);
	$('.dayschedule-week-fixed').slideUp();
	setTimeout(function() {
		$('.dayschedule.week, .dayschedule-week-fixed').remove();
	}, 500);
}
*/

function init_dayschedule() {
	load_current_date();
	select_current_pd();
	setInterval(select_current_pd, 30000)
}

function load_current_date() {
	var loc = (dayschedule_type == 'day' ? 'day' : 'box');
	$('body').load(i2root + 'ajax/dayschedule/' + loc + ' .dayschedule', function(d) {
		var spl = "var currentdate = '", end = "';";
		// get the contents in between those values--eg the new date
		if (d.indexOf(spl) != -1) {
			currentdate = d.split(spl)[1].split(end)[0];
			//console.log('Date Now', currentdate);
		}
	});
}
