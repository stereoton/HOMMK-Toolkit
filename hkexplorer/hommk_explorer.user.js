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
			    contentNode.setStyle('paddingTop', '0px');
			    this.updateExplorer(contentNode);
			    contentNode.accordionElements = contentNode.getElements(".ExplMenu");
			    window.console.log('[$Name$][DEBUG]Explorer Menu Elements: ');
			    window.console.log(contentNode.accordionElements);
			    contentNode.accordionTogglers = contentNode.getElements(".ExplView");
			    window.console.log('[$Name$][DEBUG]Explorer Menu Views: ');
			    window.console.log(contentNode.accordionTogglers);
			    contentNode.accordionMenu = new Accordion(contentNode.accordionElements, contentNode.accordionTogglers, {
				    'alwaysHide': true
			    });
		    },
		    updateExplorer: function updateExplorer(eE) {
			    this.updateCities(eE);
			    this.updateRuins(eE);
			    /*
					 * var regions = this.getRegions(); if(regions.length > 0) { regions.each(function(r) { var rE = new
					 * Element("div", {
					 * 
					 * }); rE.setText(Json.toString(r)); contentNode.adopt(rE); }); } window.console.log(regions);
					 * window.console.log(window.Hk.Map);
					 */
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
				    // var sel = $A(regs).filter(function(reg, idx) {
				    // if(reg && "undefined" != typeof reg.contents) { return reg.contents.hasOwnProperty('cN'); }
				    // return false;
				    // });
				    return regs;
			    }
		    },
		    updateRuins: function updateRuins(eE) {
			    window.console.log('[$Name$][DEBUG]Update der Ruinenliste: ');
			    window.console.log(eE);
			    var rM = new Element("div", {
			        "class": "ExplMenu HkListCategory",
			        'styles': {
				        'cursor': 'pointer'
			        }
			    });
			    rM.preventTextSelection();
			    rM.setText("Ruinen");
			    eE.adopt(rM);
			    var rV = new Element("div", {
				    "class": "ExplView HkList"
			    });
			    eE.adopt(rV);
			    var xhr, xhrs = [];
			    for( var i = 1; i < 10; i++) {
				    xhr = new Ajax(
				        'http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/ruinsRegionNumberAutocompletion?start=' + i, {
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
					            	// "r" enthält genau 3 einträge: region, kurzer text mit region & bündnis und text mit region, x,y und bündnis
						            window.console.log('[$Name$][DEBUG]Gefundene Ruine:');
						            window.console.log(r);
						            var rD = r.getLast();
						            // rD sollte ein string sein im format: "regnr (x, y) bnd"
						            // der string davor im array enthält dann: "regnr - bnd"
						            var rI = String(rD).match(/([^\(]+)\(([^\)]+)\)(.*)/);
						            /* rI sollte sein: 
						             * 0. der gesamte treffer, also alles
						             * 1. alles vor dem runden "klammerauf"
						             * 2. alles innerhalb der runden klammern, also "x, y"
						             * 3. alles hiner dem runden "klammerzu"
						             */
						            if(rI.length > 4) {
							            window.console.log('[$Name$][DEBUG]Ruinen-Info passt nicht zum regulären Ausdruck:');
							            window.console.log(rI);
							            return;
						            }
						            var rP = String(rI[2]).split(",");
						            /* rP sollte sein:
						             * 0. X-Koord.
						             * 1. Y-Koord.
						             */
						            if(rP.length != 2) {
							            window.console.log('[$Name$][DEBUG]Ruinentext passt nicht zum Schema:');
							            window.console.log(rP);
						            }
						            var rE = new Element('div', {
						                'class': "ExplRuin HkListEntry",
						                'styles': {
							                'cursor': 'pointer'
						                }
						            });
						            rE.preventTextSelection();
						            var rT = new Element('p', {
						                'class': "HkListText",
						                'styles': {
							                'cursor': 'pointer'
						                }
						            });
						            rT.preventTextSelection();
						            rE.adopt(rT);
						            rE.rX = String(rP[0]).trim();
						            rE.rY = String(rP[1]).trim();
						            rE.rN = String(rI[1]).trim(); // alles vor "klammerauf" 
						            rE.rO = String(rI[3]).trim(); // alles nach "klammerzu"
						            rT.setText(rE.rN + " - " + rE.rO + " (" + rE.rX + "," + rE.rY + ")");
						            rT.onclick = function(evt) {
							            window.console.log("[$Name$][DEBUG]Click Event an Ruineneintrag: ");
							            window.console.log(evt);
							            window.console.log(evt.target);
							            evt.preventDefault();
							            var cR = rE || evt.target;
							            window.console.log("[$Name$][DEBUG]Gehe zur Ruine " + cR.rX + "," + cR.rY);
							            window.hk.gotoPosition(cR.rX, cR.rY);
						            };
						            rV.adopt(rE);
					            });
				            }
				        });
				    window.console.log('[$Name$][DEBUG]XHR-Request #' + i + ': ');
				    window.console.log(xhr);
				    xhrs.push(xhr);
				    xhr.request.delay(250, xhr);
			    }
		    },
		    updateCities: function updateCities(eE) {
			    var cM = new Element("div", {
				    "class": "ExplMenu HkListCategory"
			    });
			    cM.setText("Städte");
			    eE.adopt(cM);
			    var cV = new Element("div", {
				    "class": "ExplView HkList"
			    });
			    var cities = this.getCities();
			    if(cities.length > 0) {
				    cities.each(function(c) {
					    window.console.log(c);
					    var cE = new Element("div", {
						    "class": "ExplEntry ExplCity HkListEntry"
					    });
					    var cT = new Element("p", {
						    "class": "ExplText HkListText"
					    });
					    cT.setText(c.cN + " - " + c.pN + ", " + c.iAN + "(" + c.x + "," + c.y + ")");
					    cE.adopt(cT);
					    cV.adopt(cE);
				    });
			    }
			    eE.adopt(cV);
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