window.$debug = window.$debug || 0;

window.hkCreateExplorer = function() {
	try {
		window.explorerAssetLoader = new AssetLoader({
			'SHA256CryptoJs': {
				'url': 'http://crypto-js.googlecode.com/files/2.5.3-crypto-sha256.js'
			}
		});
	} catch(ex) {
		window.console.log('[ExplorerAssetLoader][ERROR]' + ex);
	}
	
	// if(window.HkExplorerLoader.loaded) return;
	
	var Hk = window.Hk;
	var hk = window.hk;
	
	window.HOMMK_HkExplorer = window.HOMMK_HkExplorer ? window.HOMMK_HkExplorer : {
		'version': hk.version
	};
	
	var HOMMK = hk.HOMMK;
	var idScript = hk.idScript;
	var version = hk.version;
	
	window.console.log('[PUBLIC][DEBUG]Starte HkExplorer\u2026');
	
	// hk.Storage.Explorer = new window.Hk.HkStorage(window.hk.idScript + "HkExplorer" + window.hk.WorldId);
	
	Hk.HkExplorer = new Class({
	    $hkWin: false,
	    'inputStyles': {
	        'valid': {
		        'border': '1px solid #030303'
	        },
	        'error': {
		        'border': '1px solid #fa0c0c'
	        }
	    },
	    initialize: function(options) {
		    this.setOptions(options);
		    window.console.log('[HkExplorer][DEBUG]Initialisiere\u2026');
		    window.console.log('[HkExplorer][DEBUG]Initialisiere\u2026');
		    try {
			    // Wir brauchen hier keine Updates bei Änderungen im Speicher - sonst würden wir das ergänzen:
			    // window.hk.Storage.Explorer.addEvent("onStorageUpdate", this.updateExplorer);
			    this.$hkWin = window.hk.Windows.createWindow("HkExplorer", {
			        'title': "HkExplorer",
			        "updateable": false
			    });
			    window.console.log('[HkExplorer][DEBUG]Erzeuge Content\u2026');
			    window.console.log('[HkExplorer][DEBUG]Erzeuge Content\u2026');
			    this.createContent();
		    } catch(ex) {
			    window.console.log('[HkExplorer][DEBUG]Fehler bei der Initialisierung: ' + ex);
			    window.console.log('[HkExplorer][DEBUG]Fehler bei der Initialisierung: ' + ex);
		    }
	    },
	    createContent: function createContent() {
		    var contentNode = this.$hkWin.getElement(".HkContent");
		    contentNode.setStyle('paddingTop', '0px');
		    var cities = this.getCities();
		    window.console.log(cities);
		    window.console.log(window.HOMMK.player);
		    window.console.log(window.HOMMK);
	    },
	    getCities: function getCities() {
		    if($chk(window.HOMMK.worldMap.regionList)) {
			    var regs = window.HOMMK.worldMap.regionList.elementList;
			    var cities = $A(regs).filter(function(reg, idx) {
				    if(reg && "undefined" != typeof reg.contents) { return reg.contents.hasOwnProperty('cN'); }
				    return false;
			    });
			    window.console.log(cities);
		    }
	    },
	    updateExplorer: function updateExplorer() {

	    },
	    updateDimensions: function updateDimensions() {

	    }
	});
	Hk.HkExplorer.implement(new Events, new Options);
	// window.hk.hkExplorer = new window.Hk.HkExplorer();
	
	/**
	 * Erzeugt Explorer-Fenster
	 */
	var initHkExplorer = function() {
		try {
			window.console.log('[HkPublic][DEBUG]Erzeuge Explorer-Fenster');
			window.hk.Explorer = window.hk.hkExplorer || new window.Hk.HkExplorer();
		} catch(ex) {
			window.console.log('[HkPublic][ERROR]Fehler beim Erzeugen des Explorer-Fensters: ' + ex);
		}
		try {
			window.hk.Explorer.updateExplorer();
		} catch(ex) {
			window.console.log('[HkPublic][ERROR]Fehler beim Aktualisieren des Explorer-Fensters: ' + ex);
		}
		try {
			window.hk.Windows.makeReduceable("HkExplorer", {
			    'reduce': $("HkWindowContentHkExplorer"),
			    'title': "HkExplorer"
			});
			window.hk.Windows.makeScrollable("HkExplorer", {
			    'scroll': $("HkWindowContentHkExplorer"),
			    'title': "HkExplorer"
			});
			window.hk.Explorer.updateDimensions();
		} catch(ex) {
			window.hk.Explorer.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Explorer-Fensters: ' + ex);
		}
		if("undefined" == typeof window.hkStylesGeneric) {
			try {
				window.hkStylesGeneric = new window.HkStylesGeneric();
			} catch(ex) {
				window.console.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Shortcuts-Fensters: ' + ex);
			}
		}
		window.hkStylesGeneric.applyStyles();
	};
	return initHkExplorer();
};

try {
	if(!$type(console)) {
		var console = {
			log: function log(msg) {
			// do nothing
			}
		};
	}
} catch(ex) {}

window.console.log('Erzeuge Loader-Objekt\u2026');

/**
 * Verfügbarkeit der HkToolkit-Objekte prüfen
 */
window.HkExplorerLoader = {
    loaded: false,
    load: function load() {
	    if(window.HkExplorerLoader.loaded) {
		    window.console.log('[HkExplorerLoader][DEBUG]HkExplorer geladen\u2026');
		    try {
			    window.HkExplorerLoaderActive = $clear(window.HkExplorerLoaderActive);
			    delete window.HkExplorerLoader;
		    } catch(ex) {
			    window.console.log('[HkExplorerLoader][Error]Fehler beim Beenden des Loaders: ' + ex);
		    }
		    return;
	    }
	    console.log('[HkPublic][DEBUG]Warte auf Toolkit\u2026');
	    if(!!(window.hkCreateExplorer && window.initHkToolkit && window.hk && window.AssetLoader && window.assetLoader && window.assetLoader.waiting.length == 0)) {
		    window.console.log('[HkExplorerLoader][DEBUG]Toolkit verfügbar, bereite HkExplorer vor\u2026');
		    try {
			    window.HkExplorerLoader.loaded = true;
			    var initFunction = window.hkCreateExplorer();
			    initFunction();
		    } catch(ex) {
			    window.console.log('[HkExplorerLoader][ERROR]Fehler beim Erzeugen der Klassen für HkExplorer: ' + ex);
		    }
	    } else {
		    window.console.log('[HkExplorerLoader][DEBUG]HkExplorer wartet auf die Verfügbarkeit von HkToolkit.');
	    }
    }
};

window.console.log('Starte Loader\u2026');

/**
 * Alle 1000ms die Verfügbarkeit prüfen.
 */
try {
	window.HkExplorerLoaderActive = window.HkExplorerLoader.load.periodical(1000);
} catch(ex) {
	window.console.log('[HkPublic][DEBUG]Fehler beim Laden von HkExplorer: ' + ex);
}