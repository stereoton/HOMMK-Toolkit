window.$debug = window.$debug || 0;

if(!window.hasOwnProperty("HkExplorerCreateClasses")) {
	window.HkExplorerCreateClasses = function() {
		try {
			window.$Name$AssetLoader = new AssetLoader({
				'SHA256CryptoJs': {
					'url': 'http://crypto-js.googlecode.com/files/2.5.3-crypto-sha256.js'
				}
			});
		} catch(ex) {
			window.console.log('[$Name$AssetLoader][ERROR]' + ex);
		}
		
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
	window.$Name$DependentObjectsAvaiable = function() {
		try {
			return window.Hk && window.hk && window.Hk.HkWindows && window.hk.Windows;
		} catch(ex) {
			return false;
		}
	};
}