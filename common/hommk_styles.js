/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
try {
	if("undefined" == typeof window.console) {
		window.console = {
			log: function log(msg) {
			// do nothing
			}
		};
	}
} catch(ex) {}

if("undefined" == typeof hkSetAbove) {
  var hkSetAbove = function(inc) {
    if("undefined" == typeof inc) {
      inc = 250;
    }
    return '' + ($zIndex$ + inc) + '';
  };
}

if("undefined" == typeof hkSetBelow) {
  var hkSetBelow = function(dec) {
    if("undefined" == typeof dec) {
      dec = 250;
    }
    return '' + ($zIndex$ - dec) + '';
  };
}

if("undefined" == typeof hkGetMaxHeight) {
  hkGetMaxHeight = function(div) {
    if("undefined" == typeof div) {
      div = 1.25;
    }
    return (parseInt(window.getHeight()) / div) + 'px';
  };
}

if("undefined" == typeof hkGetMaxWidth) {
  var hkGetMaxWidth = function(div) {
    if("undefined" == typeof div) {
      div = 1.25;
    }
    return (parseInt(window.getWidth()) / div) + 'px';
  };
}

if("undefined" == typeof window.HkStylesGeneric) {
	
	window.HkStylesGeneric = new Class({
	    initialize: function() {},
	    applyStyles: function applyStyles(applyGlobal) {
		    if(("undefined" != typeof applyGlobal && !applyGlobal) || "undefined" == typeof addStylesheetRules) {
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
						    $each(style.styles, function(val, prop) {
							    if(elem.style[prop] != "" && !style.force) { return; }
							    elem.style[prop] = val;
						    });
					    });
				    }
			    });
		    } else {
			    window.console.log("[HkGenericStyles][DEBUG]Benutze dokumentweite Styles...");
			    var styleRules = [];
			    this.styles.each(function(style) {
				    window.console.log("[HkGenericStyles][DEBUG]Verarbeite Stildefinition:");
				    window.console.log(style);
				    var sOs = style.styles;
				    window.console.log("[HkGenericStyles][DEBUG]Definierte Styles:");
				    window.console.log(sOs);
				    for( var sO in sOs) {
					    window.console.log("[HkGenericStyles][DEBUG]Erzeuge Style-Regel:");
					    window.console.log(sO);
					    var styleDef = "";
					    // var styleDef = "{";
					    var currentStyle = sOs[sO];
					    window.console.log("[HkGenericStyles][DEBUG]Verarbeite:");
					    window.console.log(currentStyle);
					    var isImportant = false;
					    window.console.log("[HkGenericStyles][DEBUG]Prüfe '!important'");
					    if(currentStyle.test(/\!important/)) {
						    var cPs = currentStyle.match(/(.*)(\!important)(.*)/);
						    currentStyle = cPs[1] + cPs[3];
					    }
					    styleDef += sO + ":" + currentStyle + ";";
					    // styleDef += "}";
					    window.console.log("[HkGenericStyles][DEBUG]Erzeugter Stil:");
					    window.console.log(styleDef);
					    var styleRule = [
					        style.selector, styleDef, isImportant];
					    window.console.log("[HkGenericStyles][DEBUG]Erzeugte Stilregel:");
					    window.console.log(styleRule);
					    styleRules.push(styleRule);
				    }
			    });
			    window.console.log("[HkGenericStyles][DEBUG]Wende Stilregeln an:");
			    window.console.log(styleRules);
			    window.addStylesheetRules(styleRules);
		    }
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
	            'selector': '.HkButton',
	            'styles': {
		            'border': 'none',
	              'zIndex': hkSetAbove(1000),
	              'cursor': 'pointer'
	            }
          }, {
            'force': true,
            'selector': '.maxHeight125',
            'styles': {
              'maxHeight': hkGetMaxHeight(1.25) + "px",
            }
          }, {
          }, {
            'force': true,
            'selector': '.above50',
            'styles': {
              'zIndex': hkSetAbove(50)
            }
          }, {
            'force': true,
            'selector': '.above1000',
            'styles': {
              'zIndex': hkSetAbove(1000)
            }
          }, {
            'force': true,
            'selector': '.above1500',
            'styles': {
              'zIndex': hkSetAbove(1500)
            }
          }, {
            'force': true,
            'selector': '.above250',
            'styles': {
              'zIndex': hkSetAbove(250)
            }
	        }, {
	            'force': true,
	            'selector': '#HkWindowHkExplorer',
	            'styles': {
		            'height': 'auto',
		            'minWidth': '240px'
	            }
	        }, {
            'force': true,
	            'selector': '#HkWindowContentHkExplorer',
	            'styles': {
		            'height': 'auto',
		            'minHeight': '60px' 
	            }
	        }, {
	            'force': true,
	            'selector': '.alignCenter',
	            'styles': {
		            'text-align': 'center'
	            }
	        }, {
	            'force': true,
	            'selector': '.alignRight',
	            'styles': {
		            'text-align': 'right'
	            }
	        }, {
	            'force': true,
	            'selector': '.alignLeft',
	            'styles': {
		            'text-align': 'left'
	            }
	        }, {
	            'selector': '.HkListContainer',
	            'styles': {
		            'height': 'auto'
	            }
	        }, {
	            'selector': '.HkList',
	            'styles': {
	                'border': 'none',
	                'padding': '0px',
	                'background-color': '#0e0e0e'
	            }
	        }, {
	            'selector': '.HkListEntry',
	            'styles': {
		            'padding': '1px 0px',
	            }
	        }, {
	            'force': true,
	            'selector': '.HkWindowResizeButton',
	            'styles': {
		            'opacity': '0.5',
	            }
	        }, {
	            'selector': '.HkListText',
	            'styles': {
	                'font-family': 'monospace',
	                'cursor': 'pointer',
	                'padding': '3px 20px 3px 2px',
	                'font-size': '0.95em'
	            }
	        }, {
	            'selector': '.HkListCategory',
	            'styles': {
	                'padding': '4px 2px',
	                'border-top': '1px solid #252525',
	                'border-bottom': '2px solid #505050',
	                'font-family': '"Ubuntu", sans-serif',
	                'font-weight': '400'
	            }
	        }, { // Standardschrift
	            'force': true,
	            'selector': '.HkWindow',
	            'styles': {
	                'font-family': '"Ubuntu", sans-serif',
	                'font-weight': '300'
	            }
	        }, { // Headerschrift
	            'force': true,
	            'selector': '.HkWindowHeader',
	            'styles': {
	                'font-family': '"Jura", sans-serif',
	                'font-size': '1.1em',
	                'font-weight': '500'
	            }
	        }, { // "Code"-Schrift
	            'force': true,
	            'selector': '.HkWindow code, .HkWindow pre',
	            'styles': {
	                'font-family': '"Ubuntu Mono", monospace',
	                'font-weight': '400'
	            }
	        }]
	});
	if("undefined" == typeof HkStylesGeneric) {
		var HkStylesGeneric = window.HkStylesGeneric;
	}
}