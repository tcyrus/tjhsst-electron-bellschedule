// Thanks to madrobby/zepto#986
$.ajaxSetup = (obj) => {
	$.ajaxSettings = $.extend($.ajaxSettings || {}, obj)
	return $.ajaxSettings
}