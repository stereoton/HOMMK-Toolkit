if('undefined' == typeof window.console) {
	window.console = {
		log: function log(msg) {
			return msg;
		}
	};
} else {
	window.console.logNative = window.console.log;
	window.console.log = function(msg, debug) {
		if('function' == typeof window.console.logNative) {
			var dbg = ("undefined" != typeof window.$debug ? window.$debug : (("undefined" != typeof debug) ? debug : 0));
			if(dbg >= 1) window.console.logNative(msg);
			if(dbg > 1) alert(msg);
		}
		return msg;
	};
}

if('undefined' == typeof window.HkLogger) {
	var HkLogger = new Class({
		log: function log(msg) {
			window.console.log(msg);
		}
	});
	window.HkLogger = HkLogger;
}