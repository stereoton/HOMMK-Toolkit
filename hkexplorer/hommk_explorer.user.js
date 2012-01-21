window.$debug = window.$debug || $Debug$;

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
			    window.console.log('[$Name$][DEBUG]Initialisiere\u2026');
			    try {
				    /*
						 * Wir brauchen hier keine Updates bei Änderungen im Speicher - sonst würden wir das ergänzen:
						 * window.hk.Storage.Explorer.addEvent("onStorageUpdate", this.updateExplorer);
						 */
				    this.$hkWin = window.hk.Windows.createWindow("HkExplorer", {
				        'title': "HkExplorer",
				        "updateable": false
				    });
				    window.console.log('[$Name$][DEBUG]Erzeuge Content\u2026');
				    this.createContent(this.$hkWin);
			    } catch(ex) {
				    window.console.log('[$Name$][DEBUG]Fehler bei der Initialisierung: ' + ex);
			    }
		    },
//		    foregroundSection: function(toggle, section) {
//	        window.console.log('[$Name$][DEBUG]Explorer onActive Event: ');
//	        window.console.log(toggle);
//	        window.console.log(section);
//	        window.console.log('[$Name$][DEBUG]Starte AutoScroller an ' + section);
//	        if(toggle.hasOwnProperty('autoScroller')) toggle.autoScroller.stop();
//		    },
//		    backgroundSection: function(toggle, section) {
//	        window.console.log('[$Name$][DEBUG]Explorer onBackground Event: ');
//	        window.console.log(toggle);
//	        window.console.log(section);
//	        window.console.log('[$Name$][DEBUG]Stoppe AutoScroller an ' + section);
//	        if(toggle.hasOwnProperty('autoScroller')) toggle.autoScroller.start();
//		    },
		    createAccordion: function createAccordion(cN) {
			    window.console.log('[$Name$][DEBUG]Erzeuge Accordion: ');
		    	cN.accordionMenu = new Fx.Accordion($$(".HkListCategory"), $$(".HkList"), {
			        'alwaysHide': false,
			        'show': false,
			        'display': 1,
			        'opacity': false,
			        'height': true,
			        'returnHeightToAuto': false
			    });
//			    cN.accordionMenu.addEvent('onActive', this.foregroundSection.bind(cN.accordionMenu));
//			    cN.accordionMenu.addEvent('onBackground', this.backgroundSection.bind(cN.accordionMenu));
		    	cN.accordionMenu.showThisHideOpen();
		    },
		    createContent: function createContent(windowNode) {
			    var contentNode = windowNode.getElement(".HkContent");
			    window.console.log('[$Name$][DEBUG]Content-Element: ');
			    window.console.log(contentNode);
			    contentNode.preventTextSelection();
			    contentNode.setStyle('paddingTop', '0px');
			    window.console.log('[$Name$][DEBUG]Initialisiere Content-Node: ');
			    this.createRuinsSection();
			    this.createCitiesSection();
			    this.updateExplorer();
			    this.createAccordion(contentNode);
		    },
		    updateExplorer: function updateExplorer() {
			    window.console.log('[$Name$][DEBUG]Explorer-Update...');
			    this.updateCities();
			    this.updateRuins();
		    },
		    getCities: function getCities() {
			    window.console.log('[$Name$][DEBUG]Rufe Städte ab...');
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
			    window.console.log('[$Name$][DEBUG]Rufe Regionen ab...');
			    if($chk(window.hk.Map.content.attachedRegionList)) {
				    var regs = window.hk.Map.content.attachedRegionList;
				    var sel = $A(regs).filter(function(reg, idx) {
					    if(reg && "undefined" != typeof reg.contents) { return reg.contents.hasOwnProperty('cN'); }
					    return false;
				    });
				    return regs;
			    }
		    },
		    createRuinsSection: function createRuinsSection() {
		    	var eE = $("HkWindowContentHkExplorer");
			    window.console.log('[$Name$][DEBUG]Erzeuge Bereich der Ruinen: ');
			    window.console.log(eE);
			    var rC = new Element("div", {
			        'id': 'HkExplorerRuins',
			        'class': 'HkListContainer'
			    });
			    rC.preventTextSelection();
			    rC.injectInside(eE);
			    var rM = new Element("div", {
			        "id": "HkExplorerRuinsCategory",
			        "class": "HkListCategory",
			        'styles': {
				        'cursor': 'pointer'
			        }
			    });
			    rM.setHTML("<p><strong>Ruinen</strong></p>");
//			    rM.preventTextSelection();
			    rM.injectInside(rC);
			    var rV = new Element("div", {
			        "id": "HkExplorerRuinsList",
			        "class": "HkList"
			    });
			    rV.preventTextSelection();
			    rV.injectInside(rC);
			    window.console.log('[$Name$][DEBUG]Erzeuge AutoScroller für Ruinen');
			    rM.autoScroller = new Scroller(rV);
			    rM.autoScroller.start();
		    },
		    updateRuins: function updateRuins() {
		    	var eE = $("HkWindowContentHkExplorer");
			    window.console.log('[$Name$][DEBUG]Update der Ruinenliste: ');
			    window.console.log($("HkExplorerRuinsList"));
			    $("HkExplorerRuinsList").getElements(".HkListEntry").remove();
			    for( var i = 1; i < 10; i++) {
				    window.console.log('[$Name$][DEBUG]XHR-Request #' + i);
				    var xhr = new Ajax('http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/ruinsRegionNumberAutocompletion?start='
				        + i, {
				        'method': 'get',
				        'evalResponse': false,
				        'onComplete': function() {
//					        window.console.log('[$Name$][DEBUG]XHR-Anfrage komplett:');
//					        window.console.log(this.response);
					        var ruins = JSON.parse(this.response['text']);
					        $each(ruins, function(r) {
						        // "r" enthält genau 3 einträge: region, kurzer text mit region & bündnis und text mit region,
						        // x,y und bündnis
						        window.console.log('[$Name$][DEBUG]Gefundene Ruine:');
						        window.console.log(r);
						        var rD = r.getLast();
						        window.console.log('[$Name$][DEBUG]Verwendeter Eintrag:');
						        window.console.log(rD);
						        // rD sollte ein string sein im format: "regnr (x, y) bnd"
						        // der string davor im array enthält dann: "regnr - bnd"
						        var rI = rD.match(/([^\(]+)\(([^\)]+)\)(.*)/);
//						        window.console.log('[$Name$][DEBUG]Auswertung:');
//						        window.console.log(rI);
						        /*
										 * rI sollte sein: 0. der gesamte treffer, also alles 1. alles vor dem runden "klammerauf" 2. alles
										 * innerhalb der runden klammern, also "x, y" 3. alles hiner dem runden "klammerzu"
										 */
						        if(rI.length > 4) {
							        window.console.log('[$Name$][DEBUG]Ruinen-Info passt nicht zum regulären Ausdruck:');
							        window.console.log(rI);
						        }
						        var rP = String(rI[2]).split(",");
						        /*
										 * rP sollte sein: 0. X-Koord. 1. Y-Koord.
										 */
						        if(rP.length != 2) {
							        window.console.log('[$Name$][DEBUG]Ruinentext passt nicht zum Schema:');
							        window.console.log(rP);
						        }
						        var rE = new Element('div', {
						            'class': "HkListEntry",
						            'styles': {
							            'cursor': 'pointer'
						            }
						        });
						        rE.rX = rP[0].trim();
						        rE.rY = rP[1].trim();
						        rE.rN = rI[1].trim(); // alles vor "klammerauf"
						        rE.rO = rI[3].trim(); // alles nach "klammerzu"
						        var rTx = "" + rE.rN + " - " + rE.rO + " (" + rE.rX + "," + rE.rY + ")";
						        window.console.log("Verwende Text: " + rTx);
						        rE.innerHTML = "<p class='HkListText'>" + rTx + "</p>";
						        rE.preventTextSelection();
						        rE.addEvent('click', function(evt) {
							        window.console.log("[$Name$][DEBUG]Click Event an Ruineneintrag: ");
							        var cR = rE || evt.target;
							        window.hk.gotoPosition(cR.rX, cR.rY);
						        });
						        rE.injectInside($("HkExplorerRuinsList"));
					        });
				        }
				    });
				    xhr.request.delay(1000, xhr);
			    }
		    },
		    createCitiesSection: function createCitiesSection() {
		    	var eE = $("HkWindowContentHkExplorer");
			    window.console.log('[$Name$][DEBUG]Erzeuge Bereich der Städte: ');
			    window.console.log(eE);
			    var cC = new Element("div", {
			        'id': 'HkExplorerCities',
			        'class': 'HkListContainer'
			    }); // HkExplorerCities
			    cC.preventTextSelection();
			    cC.injectInside(eE);
			    var cM = new Element("div", {
			        "id": "HkExplorerCitiesCategory",
			        "class": "HkListCategory",
			        'styles': {
				        'cursor': 'pointer'
			        }
			    });
			    cM.innerHTML = "<p><strong>Städte</strong></p>";
//			    cM.preventTextSelection();
			    cM.injectInside(cC);
			    var cV = new Element("div", {
			        "id": "HkExplorerCitiesList",
			        "class": "HkList"
			    });
			    cV.preventTextSelection();
			    cV.injectInside(cC);
			    window.console.log('[$Name$][DEBUG]Erzeuge AutoScroller für Städte');
			    cM.autoScroller = new Scroller(cV);
			    cM.autoScroller.start();
		    },
		    updateCities: function updateCities() {
		    	var eE = $("HkWindowContentHkExplorer");
			    window.console.log('[$Name$][DEBUG]Update der Städteliste: ');
			    window.console.log($("HkExplorerCitiesList"));
			    $("HkExplorerCitiesList").getElements(".HkListEntry").remove();
			    var cities = this.getCities();
			    if(cities.length > 0) {
				    cities.each(function(c) {
					    window.console.log(c);
					    var cE = new Element("div", {
						    "class": "HkListEntry"
					    });
					    var cTx = "" + c.cN + " - " + c.pN + ", " + c.iAN + "(" + c.x + "," + c.y + ")";
					    cE.setHTML("<p class='HkListText'>" + cTx + "</p>");
					    cE.preventTextSelection();
					    /*
							 * var cT = new Element("p", { "class": "HkListText" }); cT.setText(c.cN + " - " + c.pN + ", " + c.iAN +
							 * "(" + c.x + "," + c.y + ")"); cT.preventTextSelection(); cE.adopt(cT);
							 */
					    cE.injectInside($("HkExplorerCitiesList"));
				    });
			    }
			    window.console.log(cities);
		    },
		    updateDimensions: function updateDimensions() {
		    	var eEs = $$("HkWindowContentHkExplorer", "HkWindowHkExplorer");
		    	eEs.setStyles({
		    		'maxHeight': (parseInt(window.getHeight()) / 2) + "px"
		    	});
		    }
		});
		Hk.HkExplorer.implement(new Events, new Options);
		
		/**
		 * Erzeugt Explorer-Fenster
		 */
		var init$Name$ = function() {
			try {
				window.console.log('[$Name$][DEBUG]Erzeuge $Name$-Fenster');
				window.hk.Explorer = new window.Hk.HkExplorer();
			} catch(ex) {
				window.console.log('[$Name$][ERROR]Fehler beim Erzeugen des $Name$-Fensters: ' + ex);
			}
			try {
				window.hk.Explorer.updateDimensions();
				window.hk.Windows.makeReduceable("HkExplorer", {
				    'reduce': $("HkWindowContentHkExplorer"),
				    'title': "HkExplorer"
				});
			} catch(ex) {
				window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
			}
			try {
				window.hk.Windows.makeScrollable("HkExplorer", {
					'scroll': $("HkWindowContentHkExplorer"),
					'autoScroll': true
				}).start();
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