try {
	if("undefined" == typeof window.console) {
		window.console = {
			log: function log(msg) {
			// do nothing
			}
		};
	}
} catch(ex) {}

if("undefined" == typeof window.HkStylesGeneric) {
	
	window.HkStylesGeneric = new Class({
	    initialize: function() {},
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
					    // window.console.log("[$Name$][DEBUG]Weise Stile zu\u2026");
					    // window.console.log(elem);
					    // window.console.log(style.styles);
					    $each(style.styles, function(val, prop) {
						    // window.console.log("[$Name$][DEBUG]Weise Wert '" + val + "' zu für Stil " + prop);
						    if(elem.style[prop] != "" && !style.force) {
							    // window.console.log("[$Name$][DEBUG]Wert existiert bereits, Zuweisung nicht erzwungen\u2026");
							    return;
						    } else {
							    // window.console.log("[$Name$][DEBUG]Wert existiert bereits, Zuweisung erzwungen\u2026");
						    }
						    // window.console.log("[$Name$][DEBUG]Alter Wert: " + elem.style[prop]);
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
	        }, {
	            'selector': '.GradientGreyDarkgreyGrey',
	            'styles': {
		            'background': '-webkit-linear-gradient(top, #202020, #040404 20%, #040404 40%, #303030)'
	            }
	        }, {
	            'selector': '.GradientGreyDarkgreyGrey',
	            'styles': {
		            'background': '-moz-linear-gradient(top, #202020, #040404 20%, #040404 40%, #303030)'
	            }
	        }, {
	            'force': true,
	            'selector': '.Radius5',
	            'styles': {
		            'border-radius': '5px'
	            }
	        }, {
	            'force': true,
	            'selector': '.Radius5BottomLeft',
	            'styles': {
		            'border-bottom-left-radius': '5px'
	            }
	        }, {
	            'force': true,
	            'selector': '.Radius10',
	            'styles': {
		            'border-radius': '10px'
	            }
	        }, {
	            'force': true,
	            'selector': '.Radius10TopLeft',
	            'styles': {
		            'border-top-left-radius': '5px'
	            }
	        }, {
	            'force': true,
	            'selector': '.Radius10TopRight',
	            'styles': {
		            'border-top-right-radius': '5px'
	            }
	        }, {
	            'force': true,
	            'selector': '.HkButton',
	            'styles': {
		            'border': 'none'
	            }
	        }, {
	            'force': true,
	            'selector': '.HkList',
	            'styles': {
	                'border': 'none',
	                'paddingTop': '2px',
	                'paddingBottom': '2px',
	                'marginLeft': '0px',
	                'marginRight': '0px',
	                'marginTop': '0px',
	                'marginBottom': '0px',
	                'clear': 'both',
	                'float': 'none',
	                'backgroundColor': '#0e0e0e',
	                'height': 'auto',
	                'maxHeight': window.getHeight() / 2 + 'px',
	                'width': 'auto',
	                'maxWidth': window.getWidth() / 3 + 'px'
	            }
	        }, {
	            'force': true,
	            'selector': '.HkListItem',
	            'styles': {
	                'padding': '2px 0px',
	                'borderTop': '1px solid #303030',
	                'clear': 'both'
	            }
	        }, {
	            'force': true,
	            'selector': '.HkListCategory',
	            'styles': {
	                'padding': '4px 0px',
	                'borderTop': '2px solid #505050',
	                'clear': 'both'
	            }
	        }, {
	            'force': true,
	            'selector': '.HkListText',
	            'styles': {
	                'cursor': 'pointer',
	                'width': 'auto',
	                'marginLeft': '2px',
	                'marginRight': '20px',
	                'paddingTop': '3px',
	                'paddingBottom': '3px'
	            }
	        }]
	});
	var HkStylesGeneric = window.HkStylesGeneric;
} else {
	window.console.log("[$Name$][WARN]Klasse existiert bereits: " + Json.toString(window.HkStylesGeneric));
}