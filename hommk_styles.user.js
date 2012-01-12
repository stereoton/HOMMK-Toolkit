try {
	if("undefined" == typeof window.console) {
		window.console = {
				log: function log(msg) {
					// do nothing
				}
		};
	}
} catch(ex) {}
  
if ("undefined" == typeof window.HkStylesGeneric) {

  window.HkStylesGeneric = new Class({
	initialize: function() { },
	applyStyles: function applyStyles() {
	  $A(this.styles).each(function(ss, idx) {
		var selection, style = ss;
		if(style.selector.indexOf(".") != -1 || style.selector.indexOf('#') != -1) {
		  selection = $$(style.selector);
		} else {
		  selection = $(style.selector.substr(1));
		}
		if(selection) {
		  if("undefined" == typeof selection.length) selection = [selection];
		  selection = $A(selection);
		  selection.each(function(elem, idx) {
			window.console.log("Weise Stile zu\u2026");
			window.console.log(elem);
			window.console.log(style.styles);
			$each(style.styles, function(val, prop) {
			  window.console.log("Weise Wert '" + val + "' zu für Stil " + prop);
			  if(elem.style[prop] != "" && !style.force) {
				window.console.log("Wert existiert bereits, Zuweisung nicht erzwungen\u2026");
				return;
			  }	else {
				window.console.log("Wert existiert bereits, Zuweisung erzwungen\u2026");
			  }
			  window.console.log("Alter Wert: " + elem.style[prop]);
			  elem.style[prop] = val;
			});
		  });
		}
	  });
	},
	'styles': [
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background': 'linear-gradient(top, #202020, #040404 20%, #040404 40%, #303030)'
		}
	  },
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background': '-webkit-linear-gradient(top, #202020, #040404 20%, #040404 40%, #303030)'
		}
	  },
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background': '-moz-linear-gradient(top, #202020, #040404 20%, #040404 40%, #303030)'
		}
	  },
	  {
		'force': true,
		'selector': '.Radius5',
		'styles': {
		  'border-radius': '5px'
		}
	  },
	  {
		'force': true,
		'selector': '.Radius5BottomLeft',
		'styles': {
		  'border-bottom-left-radius': '5px'
		}
	  },
	  {
		'force': true,
		'selector': '.Radius10',
		'styles': {
		  'border-radius': '10px'
		}
	  },
	  {
		'force': true,
		'selector': '.Radius10TopLeft',
		'styles': {
		  'border-top-left-radius': '5px'
		}
	  },
	  {
		'force': true,
		'selector': '.Radius10TopRight',
		'styles': {
		  'border-top-right-radius': '5px'
		}
	  },
	  {
		'force': true,
		'selector': '.HkButton',
		'styles': {
		  'border': 'none'
		}
	  }
	]
  });
  var HkStylesGeneric = window.HkStylesGeneric;
}	else {
	window.console.log("[HkStylesGeneric][WARN]Klasse existiert bereits: " + Json.toString(window.HkStylesGeneric));
}
