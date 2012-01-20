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
			    this.updateExplorer(contentNode);
			    contentNode.accordionMenu = new Accordion(contentNode.getElements("div.ExplMenu"), contentNode.getElements("div.ExplView"), {
			    	'alwaysHide': true
			    });
		    },
		    getCities: function getCities() {
			    if($chk(window.hk.Map.content.attachedRegionList)) {
				    var regs = window.hk.Map.content.attachedRegionList;
				    var cities = $A(regs).filter(function(reg, idx) {
					    if(reg && "undefined" != typeof reg.contents) { return reg.contents.hasOwnProperty('cN'); }
					    return false;
				    });
				    return cities;
			    }
		    },
		    getRegions: function getRegions() {
			    if($chk(window.hk.Map.content.attachedRegionList)) {
				    var regs = window.hk.Map.content.attachedRegionList;
//				    var sel = $A(regs).filter(function(reg, idx) {
//					    if(reg && "undefined" != typeof reg.contents) { return reg.contents.hasOwnProperty('cN'); }
//					    return false;
//				    });
				    return regs;
			    }
		    },
		    updateRuins: function updateRuins(eE) {
		    	var rM = new Element("div", {
		    		"class": "ExplMenu"
		    	});
		    	rM.setText("Ruinen");
			    eE.adopt(rM);
		    	var rV = new Element("div", {
		    		"class": "ExplView"
		    	});
		    	eE.adopt(rV);
		    	var xhrs = [];
		    	for(var i=1; i < 10; i++) {
		    		xhrs.push(new XHR({
			    		'method': 'get',
			    		'onSuccess': function() {
			    			window.console.log(this.response);
			    			var ruins = this.response['object'];
			    			$each(ruins, function(r) {
			    				var rD = r.getLast();
			    				var rI = String(rD).match(/([^\(]+)\(([^\)]+)\)(.*)/);
			    				if(rI.length != 4) {
			    					window.console.log(rI);
			    					return;
			    				}
			    				var rP = String(rI[3]).split(",");
			    				if(rP.length != 2) {
			    					window.console.log(rP);
			    				}
				    			var rE = new Element('div', {
				    				'class': "ExplRuin"
				    			});
				    			rE.rX = String(rP[0]).trim();
				    			rE.rY = String(rP[1]).trim();
			    				rE.rN = String(rI[1]).trim();
			    				rE.rO = String(rI[2]).trim();
				    			rE.setText(rE.rN + " - " + rE.rO + " (" + rE.rX + "," + rE.rY + ")");
				    			rE.addEvent('click', function(evt) {
				    				var rE = evt.target;
				    				window.hk.gotoPosition(rE.rX, rE.rY);
				    			});
				    			rE.preventTextSelection();
				    			rV.adopt(rE);
			    			});
			    		}
			    	}).send('http://mightandmagicheroesheroeskindoms.ubi.com/ajaxRequest/ruinsRegionNumberAutocompletion', 'start=1'));
		    		
		    	}
		    },
		    updateCities: function updateCities(eE) {
		    	var cM = new Element("div", {
		    		"class": "ExplCityMenu"
		    	});
		    	cM.setText("Städte");
			    eE.adopt(cM);
		    	var cV = new Element("div", {
		    		"class": "ExplCityView"
		    	});
			    var cities = this.getCities();
			    if(cities.length > 0) {
			    	cities.each(function(c) {
			    		var cE = new Element("div", {
			    			"class": "ExplCity"
			    		});
			    		cE.setText(c.cN + " - " + c.pN + ", " + c.iAN + "(" + c.x + "," + c.y + ")");
			    		cV.adopt(cE);
			    	});
			    }
			    eE.adopt(cV);
			    window.console.log(cities);		    	
		    },
		    updateExplorer: function updateExplorer(eE) {
		    	this.updateCities(eE);
		    	this.updateRuins(eE);
			    /*
			    var regions = this.getRegions();
			    if(regions.length > 0) {
			    	regions.each(function(r) {
			    		var rE = new Element("div", {
			    			
			    		});
			    		rE.setText(Json.toString(r));
			    		contentNode.adopt(rE);
			    	});
			    }
			    window.console.log(regions);
			    window.console.log(window.Hk.Map);
			    */
		    },
		    updateDimensions: function updateDimensions() {

		    }
		});
		Hk.HkExplorer.implement(new Events, new Options);
		// window.hk.hkExplorer = new window.Hk.HkExplorer();
		
		/**
		 * Erzeugt Explorer-Fenster
		 */
		var init$Name$ = function() {
			try {
				window.console.log('[$Name$][DEBUG]Erzeuge $Name$-Fenster');
				window.hk.Explorer = window.hk.hkExplorer || new window.Hk.HkExplorer();
			} catch(ex) {
				window.console.log('[$Name$][ERROR]Fehler beim Erzeugen des $Name$-Fensters: ' + ex);
			}
			try {
				window.hk.Explorer.updateExplorer();
			} catch(ex) {
				window.console.log('[$Name$][ERROR]Fehler beim Aktualisieren des $Name$-Fensters: ' + ex);
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
				window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
			}
			if("undefined" == typeof window.hkStylesGeneric) {
				try {
					window.hkStylesGeneric = new window.HkStylesGeneric();
				} catch(ex) {
					window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
				}
			}
			window.hkStylesGeneric.applyStyles();
		};
		return init$Name$;
	};
	window.$Name$DependentObjectsAvailable = function() {
		try {
			return window.Hk && window.hk && window.Hk.HkWindows && window.hk.Windows;
		} catch(ex) {
			return false;
		}
	};
}