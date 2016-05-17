// Thanks to madrobby/zepto#986
;(function($) {
	$.extend($.fn, {
		ajaxSetup(obj) {
			$.ajaxSettings = $.extend($.ajaxSettings || {}, obj)
			return $.ajaxSettings
		}
	})
})(Zepto)