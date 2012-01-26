(function page_scope_runner() {
	// If we're _not_ already running in the page, grab the full source
	// of this script.
	var my_src = "(" + page_scope_runner.caller.toString() + ")();";
	
	// Create a script node holding this script, plus a marker that lets us
	// know we are running in the page scope (not the Greasemonkey sandbox).
	// Note that we are intentionally *not* scope-wrapping here.
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.textContent = "var __PAGE_SCOPE__RUN__ = true;\n" + my_src;
	
	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up. Use setTimeout to force execution "outside" of
	// the user script scope completely.
	setTimeout(function() {
		document.body.appendChild(script);
		document.body.removeChild(script);
	}, 0);
})();