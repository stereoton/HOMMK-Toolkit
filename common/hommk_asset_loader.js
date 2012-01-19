
if("undefined" == typeof AssetLoader) {
	var AssetLoader = new Class({
	    initialize: function(js) {
		    this.completed = [];
		    this.waiting = [];
		    if(!!js) this.injectJavascript(js);
	    },
	    injectJavascript: function injectJavascript(js) {
		    this.scriptsToInject = js;
		    $each(js, function(scriptDef, scriptName) {
			    this.waiting.push(scriptName);
		    }, this);
		    $each(js, function(scriptDef, scriptName) {
			    if(!$(scriptName)) this.inject(scriptDef, scriptName);
			    else this.setInjected(scriptName);
		    }, this);
	    },
	    inject: function inject(scriptDef, scriptName) {
		    if($(scriptName)) $(scriptName).remove();
		    var url = scriptDef.hasOwnProperty("url") ? scriptDef.url : false;
		    var conditions = scriptDef.hasOwnProperty("conditions") ? eval(scriptDef.conditions) : true;
		    if(url && conditions && !$(scriptName)) {
			    new Asset.javascript(url, {
				    'id': scriptName
			    });
		    }
		    this.check.delay(200, this, [
		        scriptDef, scriptName]);
	    },
	    check: function check(scriptDef, scriptName) {
		    var conditions = scriptDef.hasOwnProperty("conditions") ? eval(scriptDef.conditions) : false;
		    if(conditions) {
			    this.inject.delay(1000, this, [
			        scriptDef, scriptName]);
		    } else {
			    this.setInjected(scriptName);
		    }
	    },
	    setInjected: function setInjected(scriptName) {
		    this.completed.push(scriptName);
		    this.waiting.remove(scriptName);
	    }
	});
}