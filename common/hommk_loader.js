
//window.console.log('Erzeuge Loader-Objekt\u2026');

/**
 * Verfügbarkeit der HOMMK-Objekte prüfen
 */
if(!window.hasOwnProperty("$Name$Loader")) {
	window.$Name$Loader = {
	    loaded: false,
	    load: function load() {
		    if(window.$Name$Loader.loaded) {
			    window.console.log('[$Name$Loader][DEBUG]$Name$ geladen\u2026');
			    try {
				    window.$Name$LoaderActive = $clear(window.$Name$LoaderActive);
				    // delete window.$Name$Loader;
			    } catch(ex) {
				    window.console.log('[$Name$Loader][Error]Fehler beim Beenden des Loaders: ' + ex);
			    }
			    return;
		    }
		    //window.console.log('[$Name$Loader][DEBUG]Warte auf Objekte\u2026');
		    if(!!($LoaderConditions$ && window.$Name$CreateClasses && window.$Name$DependentObjectsAvailable && window.$Name$DependentObjectsAvailable())) {
			    window.console.log('[$Name$Loader][DEBUG]Objekte verfügbar, bereite $Name$ vor\u2026');
			    try {
				    window.$Name$Loader.loaded = true;
				    var initFunction = window.$Name$CreateClasses();
				    initFunction();
			    } catch(ex) {
				    window.console.log('[$Name$Loader][ERROR]Fehler beim Erzeugen der Klassen für $Name$: ' + ex);
			    }
		    } else {
			    //window.console.log('[$Name$Loader][DEBUG]$Name$ wartet auf die Verfügbarkeit von Objekten.');
		    }
	    }
	};
	

}
//window.console.log('Starte Loader\u2026');

/**
 * Alle 1000ms die Verfügbarkeit prüfen.
 */
try {
	if(!window.hasOwnProperty("$Name$LoaderActive")) {
		window.$Name$LoaderActive = window.$Name$Loader.load.periodical(5000);
	}
} catch(ex) {
	window.console.log('[HkPublic][DEBUG]Fehler beim Laden von $Name$: ' + ex);
}
