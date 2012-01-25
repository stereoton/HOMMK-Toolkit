if("undefined" == typeof window.addStylesheetRules) {
	
	if("undefined" == typeof window.globalStylesApplied) {
		window.globalStylesApplied = false;
	}
	
	/**
	 * Add a stylesheet rule to the document (may be better practice, however, to dynamically change classes, so style
	 * information can be kept in genuine styesheets (and avoid adding extra elements to the DOM)) Note that an array is
	 * needed for declarations and rules since ECMAScript does not afford a predictable object iteration order and since
	 * CSS is order-dependent (i.e., it is cascading); those without need of cascading rules could build a more
	 * accessor-friendly object-based API.
	 * 
	 * @param {Array}
	 *          decls Accepts an array of JSON-encoded declarations
	 * @example window.addStylesheetRules([ ['h2', // Also accepts a second argument as an array of arrays instead ['color',
	 *          'red'], ['background-color', 'green', true] // 'true' for !important rules ], ['.myClass',
	 *          ['background-color', 'yellow'] ] ]);
	 */
	window.addStylesheetRules = function(decls) {
		if(window.globalStylesApplied) return;
//		window.console.log("[stylesheets][DEBUG]Füge Styles in die Stylesheets ein:");
//		window.console.log(decls);
		var style = document.createElement('style');
//		window.console.log("[stylesheets][DEBUG]Füge Styles in den Header ein (appendChild)");
//		document.getElement("head").appendChild(style);
		var s = document.styleSheets[document.styleSheets.length - 1];
		for( var i = 0, dl = decls.length; i < dl; i++) {
			var j = 1, decl = decls[i], selector = decl[0], rulesStr = '';
//			window.console.log("[stylesheets][DEBUG]Styles:");
//			window.console.log(decl);
//			window.console.log("[stylesheets][DEBUG]Selector:");
//			window.console.log(selector);
			if($type(decl[1][0]) == "array") {
				decl = decl[1];
				j = 0;
			}
//			window.console.log("[stylesheets][DEBUG]decl-Array:");
//			window.console.log(decl);
			for( var rl = decl.length; j < rl; j++) {
				var rule = decl[j];
//				window.console.log("[stylesheets][DEBUG]decl-Rule:");
//				window.console.log(rule);
				if($type(rule) == "string") {
					if(j > 1) return;
					var pR = rule.match(/(.*)[:](.*)/);
					if(!pR || pR.length == 0) {
//						window.console.log("[stylesheets][WARN]Überspringe " + rule);
					}
					rule = [pR[1], pR[2], decl[2]];
				}
				rulesStr += rule[0] + ':' + rule[1] + (rule[2] ? ' !important' : '') + ';\n';
//				window.console.log("[stylesheets][DEBUG]rulesStr:");
//				window.console.log(rulesStr);
			}
			if(s.insertRule) {
//				window.console.log('[stylesheets][DEBUG]Füge Regel in Stylesheet ein:');
//				window.console.log(selector + '{' + rulesStr + '}');
//				window.console.log(s);
//				window.console.log(s.cssRules);
				s.insertRule(selector + '{' + rulesStr + '}', s.cssRules.length);
			} else { /* IE */
				s.addRule(selector, rulesStr, -1);
			}
		}
		window.globalStylesApplied = true;
	};
}