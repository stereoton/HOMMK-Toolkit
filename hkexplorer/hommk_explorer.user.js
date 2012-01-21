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
		    createContent: function createContent(windowNode) {
			    var contentNode = windowNode.getElement(".HkContent");
			    window.console.log('[$Name$][DEBUG]Content-Element: ');
			    window.console.log(contentNode);
			    contentNode.preventTextSelection();
			    contentNode.setStyle('paddingTop', '0px');
			    window.console.log('[$Name$][DEBUG]Initialisiere Content-Node: ');
			    this.createCitiesSection(contentNode);
			    this.createRuinsSection(contentNode);
			    window.console.log('[$Name$][DEBUG]Erzeuge Accordion: ');
			    contentNode.accordionElements = contentNode.getElements(".HkList");
			    window.console.log('[$Name$][DEBUG]Explorer Menu Elements: ');
			    window.console.log(contentNode.accordionElements);
			    contentNode.accordionTogglers = contentNode.getElements(".HkListCategory");
			    window.console.log('[$Name$][DEBUG]Explorer Menu Views: ');
			    window.console.log(contentNode.accordionTogglers);
			    new Accordion(contentNode.accordionElements, contentNode.accordionTogglers, {
			        'alwaysHide': false,
			        'show': 0,
			        'display': 1,
			        'opacity': false,
			        'fixedHeight': parseInt(window.getHeight()) / 5 + "px",
			        'onBackground': function(evt) {
				        window.console.log('[$Name$][DEBUG]Explorer onBackground Event: ');
				        window.console.log(evt);
				        window.console.log('[$Name$][DEBUG]Suche HkListContainer...');
				        var bg = evt.target;
				        while(!bg.hasClass("HkListContainer")) {
					        bg = bg.getParent();
					        if("undefined" == typeof bg) {
						        window.console.log('[$Name$][WARN]Kein HkListContainer gefunden, Abbruch...');
						        return;
					        }
				        }
				        bg.autoScroller.stop();
			        },
			        'onActive': function(evt) {
				        window.console.log('[$Name$][DEBUG]Explorer onActive Event: ');
				        window.console.log(evt);
				        window.console.log('[$Name$][DEBUG]Suche HkListContainer...');
				        var bg = evt.target;
				        while(!bg.hasClass("HkListContainer")) {
					        bg = bg.getParent();
					        if("undefined" == typeof bg) {
						        window.console.log('[$Name$][WARN]Kein HkListContainer gefunden, Abbruch...');
						        return;
					        }
				        }
				        bg.autoScroller.start();
			        }
			    });
		    },
		    updateExplorer: function updateExplorer() {
			    window.console.log('[$Name$][DEBUG]Explorer-Update...');
			    var eE = $("HkWindowContentHkExplorer");
			    this.updateCities(eE);
			    this.updateRuins(eE);
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
		    createRuinsSection: function createRuinsSection(eE) {
			    window.console.log('[$Name$][DEBUG]Erzeuge Bereich der Ruinen: ');
			    window.console.log(eE);
			    var rC = new Element("div", {
			        'id': 'HkExplorerRuins',
			        'class': 'HkListContainer'
			    });
			    rC.preventTextSelection();
			    eE.adopt(rC);
			    var rM = new Element("div", {
			        "id": "HkExplorerRuinsCategory",
			        "class": "HkListCategory",
			        'styles': {
				        'cursor': 'pointer'
			        }
			    });
			    rM.setText("Ruinen");
			    rM.preventTextSelection();
			    rC.adopt(rM);
			    var rV = new Element("div", {
			        "id": "HkExplorerRuinsList",
			        "class": "HkList"
			    });
			    rV.preventTextSelection();
			    rC.adopt(rV);
			    rC.autoScroller = new Scroller($("HkExplorerRuinsList"));
		    },
		    updateRuins: function updateRuins(eE) {
			    window.console.log('[$Name$][DEBUG]Update der Ruinenliste: ');
			    window.console.log($("HkExplorerRuinsList"));
			    $("HkExplorerRuinsList").empty();
			    for( var i = 1; i < 10; i++) {
				    window.console.log('[$Name$][DEBUG]XHR-Request #' + i);
				    new Ajax('http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/ruinsRegionNumberAutocompletion?start='
				        + i, {
				        'method': 'get',
				        'evalResponse': true,
				        'onRequest': function() {
					        window.console.log('[$Name$][DEBUG]Starte XHR-Request:');
					        window.console.log(arguments);
				        },
				        'onStateChange': function() {
					        window.console.log('[$Name$][DEBUG]XHR-Statusänderung:');
					        window.console.log(arguments);
				        },
				        'onFailure': function() {
					        window.console.log('[$Name$][DEBUG]XHR-Fehler:');
					        window.console.log(arguments);
				        },
				        'onSuccess': function() {
					        window.console.log('[$Name$][DEBUG]XHR-Anfrage erfolgreich::');
					        window.console.log(arguments);
				        },
				        'onComplete': function() {
					        window.console.log('[$Name$][DEBUG]XHR-Anfrage komplett:');
					        window.console.log(this.response);
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
						        window.console.log('[$Name$][DEBUG]Auswertung:');
						        window.console.log(rI);
						        /*
										 * rI sollte sein: 0. der gesamte treffer, also alles 1. alles vor dem runden "klammerauf" 2. alles
										 * innerhalb der runden klammern, also "x, y" 3. alles hiner dem runden "klammerzu"
										 */
						        if(rI.length > 4) {
							        window.console.log('[$Name$][DEBUG]Ruinen-Info passt nicht zum regulären Ausdruck:');
							        window.console.log(rI);
						        }
						        var rP = String(rI[2]).split(",");
						        window.console.log('[$Name$][DEBUG]Koordinaten:');
						        window.console.log(rP);
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
						        window.console.log("Verwende Text: " + rE.rN + " - " + rE.rO + " (" + rE.rX + "," + rE.rY + ")");
						        rE.setText(rE.rN + " - " + rE.rO + " (" + rE.rX + "," + rE.rY + ")");
						        rE.preventTextSelection();
						        rE.onclick = function(evt) {
							        window.console.log("[$Name$][DEBUG]Click Event an Ruineneintrag: ");
							        window.console.log(evt);
							        window.console.log(evt.target);
							        evt.preventDefault();
							        var cR = rE || evt.target;
							        window.console.log("[$Name$][DEBUG]Event-Target: ");
							        window.console.log(cR);
							        window.console.log("[$Name$][DEBUG]Gehe zur Ruine " + cR.rX + "," + cR.rY);
							        window.hk.gotoPosition(cR.rX, cR.rY);
						        };
						        $("HkExplorerRuinsList").adopt(rE);
					        });
				        }
				    }).request.delay(250);
			    }
		    },
		    createCitiesSection: function createCitiesSection(eE) {
			    window.console.log('[$Name$][DEBUG]Erzeuge Bereich der Städte: ');
			    window.console.log(eE);
			    var cC = new Element("div", {
			        'id': 'HkExplorerCities',
			        'class': 'HkListContainer'
			    }); // HkExplorerCities
			    cC.preventTextSelection();
			    eE.adopt(cC);
			    var cM = new Element("div", {
			        "id": "HkExplorerCitiesCategory",
			        "class": "HkListCategory",
			        'styles': {
				        'cursor': 'pointer'
			        }
			    });
			    cM.setText("Städte");
			    cM.preventTextSelection();
			    cC.adopt(cM);
			    var cV = new Element("div", {
			        "id": "HkExplorerCitiesList",
			        "class": "HkList"
			    });
			    cV.preventTextSelection();
			    cC.adopt(cV);
			    cC.autoScroller = new Scroller($("HkExplorerCitiesList"));
			    cc.autoScroller.start();
		    },
		    updateCities: function updateCities(eE) {
			    window.console.log('[$Name$][DEBUG]Update der Städteliste: ');
			    window.console.log($("HkExplorerCitiesList"));
			    $("HkExplorerCitiesList").empty();
			    var cities = this.getCities();
			    if(cities.length > 0) {
				    cities.each(function(c) {
					    window.console.log(c);
					    var cE = new Element("div", {
						    "class": "HkListEntry"
					    });
					    cE.setText(c.cN + " - " + c.pN + ", " + c.iAN + "(" + c.x + "," + c.y + ")");
					    cE.preventTextSelection();
					    /*
							 * var cT = new Element("p", { "class": "HkListText" }); cT.setText(c.cN + " - " + c.pN + ", " + c.iAN +
							 * "(" + c.x + "," + c.y + ")"); cT.preventTextSelection(); cE.adopt(cT);
							 */
					    $("HkExplorerCitiesList").adopt(cE);
				    });
			    }
			    window.console.log(cities);
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
				    'title': "HkExplorer",
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