/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
window.$debug = window.$debug || $Debug$;

if(!window.hasOwnProperty("HkExplorerCreateClasses")) {
	window.HkExplorerCreateClasses = function() {
		
		var Hk = window.Hk;
		var hk = window.hk;
		
		window.HOMMK_HkExplorer = window.HOMMK_HkExplorer ? window.HOMMK_HkExplorer : {
			'version': hk.version
		};
		
		var HOMMK = hk.HOMMK;
		var idScript = hk.idScript;
		var version = hk.version;
		
		window.console.log('[PUBLIC][DEBUG]Starte HkExplorer\u2026');
		
		Hk.HkRuinsData = [];
		Hk.HkRuins = new Class({
		    initialize: function() {
			    this.rA = [];
			    this.xRA = [];
			    for( var i = 1; i < 10; i++) {
				    window.console.log('[$Name$][DEBUG]XHR-Request #' + i);
				    this.xRA.push(new Ajax(
				        'http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/ruinsRegionNumberAutocompletion?start=' + i, {
				            'method': 'get',
				            'evalResponse': true,
				            'onComplete': function() {
					            window.console.log('[$Name$][DEBUG"]XHR Request komplett.');
				            }
				        }));
			    }
			    this.xG = new Group();
			    this.xG.instances = this.xRA;
			    this.xG.addEvent("onComplete", this.requestsComplete.bindAsEventListener(this));
			    return this;
		    },
		    start: function() {
			    this.xRA.each(function(xR, i) {
				    var d = i * 500;
				    xR.request.delay(d, xR);
			    }.bind(this));
		    },
		    sort: function sort(key, data) {
			    window.console.log('[$Name$][RUINS]Sortiere Ruinen...');
			    if("undefined" == typeof key) key = "n";
			    window.console.log('[$Name$][RUINS]Sortierschlüssel: ' + key);
			    if("undefined" == typeof data && this.hasOwnProperty("rA")) {
				    window.console.log('[$Name$][RUINS]Benutze gespeicherte Daten...');
			    	data = this.rA.copy();
			    } else if("undefined" == typeof data) {
			    	window.console.log('[$Name$][DEBUG]Keine Daten zum Sortieren vorhanden, Abbruch...');
			    	return [];
			    }
			    /** @type Array */
			    var d = data.copy();
//			    window.console.log('[$Name$][DEBUG]Verwendete Daten:');
			    window.console.log(d);
			    var sD = d.sort(function(a, b) {
			    	var cmp = [a[key], b[key]];
			    	if(cmp.some(function(val, idx) {
			    		return val.toString().test("[a-z]", "i");
			    	})) { // text
			    		cmp = cmp.map(function(val, idx) { return val.toString().toLowerCase(); }).reverse();
			    	}	else { // nummern
			    		cmp = cmp.map(function(val, idx) { return val.toString().toInt(); }).reverse();
			    	}
			    	if(cmp[0] == cmp[1]) return 0;
			    	return cmp[0] > cmp[1] ? -1 : 1;
			    });
			    window.console.log('[$Name$][DEBUG]Sortierte Daten: ');
			    window.console.log(sD);
			    return sD;
		    },
		    extractRuins: function extractRuins(respText, rA) {
			    var ruins = JSON.parse(respText);
			    ruins.each(function(r) {
				    /*
						 * "r" enthält genau 3 einträge: 0. region als zahl 1. region & bündnis: "reg - bnd" 2. region, bündnis &
						 * x,y-koordinate: "reg (x, y) bnd"
						 */
				    var rD = r.getLast();
				    var rI = rD.match(/([^\(]+)\(([^\)]+)\)(.*)/);
				    /*
						 * "rI" sollte sein: 0. der gesamte treffer, also rD 1. alles vor "(" 2. alles innerhalb von "(" und ") → x,
						 * y 3. alles hinter ")"
						 */
				    if(rI.length != 4) {
					    window.console.log('[$Name$][RUINS]Ruinen-Info passt nicht zum regulären Ausdruck:');
					    window.console.log(rI);
				    }
				    var rP = String(rI[2]).split(",");
				    window.console.log('[$Name$][RUINS]Koordinaten:');
				    window.console.log(rP);
				    /*
						 * "rP" sollte sein: 0. x-Koordinate 1. y-Koordinate
						 */
				    if(rP.length != 2) {
					    window.console.log('[$Name$][RUINS]Ruinentext passt nicht zum Schema:');
					    window.console.log(rP);
				    }
				    var rnD = { 
				    		"n": stringPadLeft(rI[1].trim(), 5, "0"), // alles vor "(" → Id der Ruine
			        	"x": rP[0].trim(),
				        "y": rP[1].trim(),
				        "a": rI[3].trim(),
				        "xy": rP[0].trim() + ", " + rP[1].trim() // alles nach ")" → "Besitzer" der Ruine 				    
				    };
				    window.console.log('[$Name$][DEBUG]Speichere Ruine:');
				    window.console.log(rnD);
				    this.push(rnD);
			    }.bind(rA));
			    return rA;
		    },
		    requestsComplete: function requestsComplete() {
			    window.console.log("[$Name$][DEBUG]XHR-Anfragen für Ruinen komplett...");
			    var rA = [];
			    this.xRA.each(function(xR, i) {
				    if(!xR.hasOwnProperty("response") || !xR.response.hasOwnProperty("text")) {
					    window.console.log("[$Name$][WARN]Fehlerhafte Antwort bei Ruine #" + i);
					    return;
				    }
				    window.console.log("[$Name$][DEBUG]Extrahiere Ruine #" + i);
				    window.console.log(xR);
				    rA = this.extractRuins(xR.response.text, rA);
			    }.bind(this));
			    window.console.log("[$Name$][DEBUG]Gesammelte Ruinen:");
			    window.console.log(rA);
			    this.rA = rA;
			    this.fireEvent('onComplete', [rA, this], 50);
		    }
		});
		Hk.HkRuins.implement(new Events);
		
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
				        "updateable": true,
				        "updateUrl": "https://github.com/gelgamek/HOMMK-Toolkit/raw/STABLE/hommk_explorer.user.js"
				    });
				    window.console.log('[$Name$][DEBUG]Erzeuge Content\u2026');
				    this.createContent(this.$hkWin);
			    } catch(ex) {
				    window.console.log('[$Name$][DEBUG]Fehler bei der Initialisierung: ' + ex);
			    }
		    },
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
			    cN.accordionMenu.showThisHideOpen();
		    },
		    createContent: function createContent(windowNode) {
			    var contentNode = windowNode.getElement(".HkContent");
			    window.console.log('[$Name$][DEBUG]Content-Element: ');
			    window.console.log(contentNode);
			    contentNode.preventTextSelection();
			    contentNode.setStyle('paddingTop', '0px');
			    window.console.log('[$Name$][DEBUG]Initialisiere Content-Node: ');
			    this.getHkRuins();
			    this.createRuinSections();
			    this.createCitiesSection();
			    this.updateExplorer();
			    this.createAccordion(contentNode);
		    },
		    ruinsUpdated: function ruinsUpdated(ruins, hkRuins) {
			    window.console.log('[$Name$][DEBUG]ruinsUpdated:');
			    window.console.log($A(arguments));
		    	this.updateRuinSections(hkRuins);
		    },
		    getHkRuins: function getHkRuins() {
			    this.$hkRuins = new Hk.HkRuins();
			    this.$hkRuins.addEvent('onComplete', this.ruinsUpdated.bindAsEventListener(this));
			    this.$hkRuins.start();
		    },
		    updateExplorer: function updateExplorer() {
			    window.console.log('[$Name$][DEBUG]Explorer-Update...');
			    this.updateCities();
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
		    createRuinSections: function createRuinSections() {
			    var sP = [
			        {
			            "key": "n",
			            "name": "RegionNumber",
			            "title": "nach Regionen"
			        }, {
			            "key": "a",
			            "name": "Alliance",
			            "title": "nach Bündnissen"
			        }];
			    window.console.log('[$Name$][DEBUG]Erzeuge Bereiche der Ruinen: ');
			    sP.each(function(p, i) {
				    window.console.log('[$Name$][DEBUG]Erzeuge Bereich der Ruinen: ');
				    var eE = $("HkWindowContentHkExplorer");
				    window.console.log(eE);
				    var containerName = 'HkExplorerRuins' + p["name"];
				    var categoryName = "HkExplorerRuins" + p["name"] + "Category";
				    var listName = "HkExplorerRuins" + p["name"] + "List";
				    var rC = new Element("div", {
				        'id': containerName,
				        'class': 'HkListContainer'
				    });
				    rC.preventTextSelection();
				    var rM = new Element("div", {
				        "id": categoryName,
				        "class": "HkListCategory",
				        'styles': {
					        'cursor': 'pointer'
				        }
				    });
				    var rMT = new Element("p");
				    rMT.setHTML("<strong>Ruinen " + p["title"] + "</strong>");
				    rMT.preventTextSelection();
				    rMT.injectInside(rM);
				    rM.preventTextSelection();
				    rM.injectInside(rC);
				    var rV = new Element("div", {
				        "id": listName,
				        "class": "HkList"
				    });
				    rV.preventTextSelection();
				    rV.injectInside(rC);
				    rC.injectInside(eE);
				    window.console.log('[$Name$][DEBUG]Erzeuge AutoScroller für Ruinen');
				    rM.autoScroller = new Scroller(rV);
				    rM.autoScroller.start();
			    });
		    },
		    updateRuinSections: function updateRuinSections(hkRuins) {
			    window.console.log('[$Name$][DEBUG]updateRuinSections:');
			    window.console.log($A(arguments));
			    var hkR = hkRuins || this.$hkRuins;
			    var sP = [
			        {
			            "key": "n",
			            "name": "RegionNumber",
			            "displayOrder": ["n", "a", "xy"],
			            "tableRow": "<td class='alignRight'>%(n)s</td><td class='alignCenter'> - </td><td class='alignLeft'>%(a)s</td><td class='alignCenter'> - </td><td class='alignRight'>%(x)s</td><td class='alignCenter'>,</td><td class='alignRight'>%(y)s</td>",
			            "rowFormat": "%(n)s - %(a)s - %(x)s,%(y)s" // n, x, y, a, xy
			        }, {
			            "key": "a",
			            "name": "Alliance",
			            "displayOrder": ["a", "xy", "n"],
			            "tableRow": "<td class='alignLeft'>%(a)s</td><td class='alignCenter'> - </td><td class='alignRight'>%(x)s</td><td class='alignCenter'>,</td><td class='alignRight'>%(y)s</td><td class='alignCenter'> - </td><td class='alignRight'>%(n)s</td>",
			            "rowFormat": "%(a)s - %(x)s,%(y)s - %(n)s" // n, x, y, a, xy
			        }];
			    window.console.log('[$Name$][DEBUG]Aktualisiere Bereiche der Ruinen: ');
			    window.console.log(hkR);
			    sP.each(function(p, i) {
				    var eE = $("HkWindowContentHkExplorer");
				    window.console.log('[$Name$][DEBUG]Update der Ruinenliste #' + i);
				    window.console.log(p);
				    var listName = "HkExplorerRuins" + p["name"] + "List"; 
				    window.console.log('[$Name$][DEBUG]Leere die Ruinenliste ' + listName);
				    $(listName).getElements(".HkListEntry").remove();
				    var sortKey = p["key"];
				    window.console.log('[$Name$][DEBUG]Sortiere Daten für Ruinenliste nach ' + sortKey);
				    window.console.log(hkR);
				    var rD = hkR.sort(sortKey);
				    window.console.log('[$Name$][DEBUG]Sortierte Daten für Ruinenliste nach ' + sortKey + ":");
				    window.console.log(rD);
				    window.console.log('[$Name$][DEBUG]Schreibe Daten in Ruinenliste...');
				    var rTbl = new Element("table");
				    rTbl.injectInside($(listName));
				    rD.each(function(r, j) {
				    	window.console.log('[$Name$][DEBUG]Erzeuge Eintrag #' + j);
	            var rE = new Element('tr', {
                'class': "HkListEntry",
                'styles': {
	                'cursor': 'pointer'
                }
	            });
				    	window.console.log('[$Name$][DEBUG]Erzeuge Text für Eintrag #' + j);
	            var rTx = sprintf(p.rowFormat, r);
	            window.console.log("Verwende Text: " + rTx);
	            var rTR = sprintf(p.tableRow, r);
	            window.console.log("Test TableRow: " + rTR);
	            rE.innerHTML = rTR;
	            rE.preventTextSelection();
	            rE.injectInside(rTbl);
	            rE.getElements("td").addEvent('click', function(evt) {
		            window.console.log("[$Name$][DEBUG]Click Event an Ruineneintrag: ");
		            window.hk.gotoPosition(r["x"], r["y"]);
	            });
				    });
			    });
			    window.hkStylesGeneric.applyStyles();
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
			    // cM.preventTextSelection();
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
        window.hk.Windows.makeScrollable("HkExplorer", {
            'scroll': $("HkWindowContentHkExplorer"),
            'autoScroll': true
        }).start();
      } catch(ex) {
        window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
      }
			try {
				window.hk.Explorer.updateDimensions();
				window.hk.Windows.makeReduceable("HkExplorer", {
				    'reduce': $("HkWindowContentHkExplorer"),
				    'title': "HkExplorer"
				});
	      if("undefined" == typeof window.hkStylesGeneric) {
	        try {
	          window.hkStylesGeneric = new window.HkStylesGeneric();
	        } catch(ex) {
	          window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
	        }
	      }
	      window.hkStylesGeneric.applyStyles();
	      try {
	        window.hk.Windows.makeResizeable("HkExplorer", {
	            'scroll': $("HkWindowContentHkExplorer"),
	            'autoScroll': true
	        }).start();
	      } catch(ex) {
	        window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
	      }
			} catch(ex) {
				window.console.log('[$Name$][ERROR]Fehler bei der Finalisierung des $Name$-Fensters: ' + ex);
			}
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