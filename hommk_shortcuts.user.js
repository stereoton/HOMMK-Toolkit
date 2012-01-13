// ==UserScript==
// @name HkToolkit
// @version       2012.01.12.22.44.260000
// @description Werkzeugkasten für HOMMK
// @author Gelgamek <gelgamek@arcor.de>
// @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
// @icon http://icons.iconarchive.com/icons/webiconset/mobile/32/maps-icon.png
// @namespace http://mightandmagicheroeskingdoms.ubi.com/play
// @match http://mightandmagicheroeskingdoms.ubi.com/play*
//
// Content Scope Runner:
// @require http://userscripts.org/scripts/source/68059.user.js
// TODO Alternative zum Content Scope Runner: contentEval, ohne setTimeout()
// @-require http://userscripts.org/scripts/source/100842.user.js
//
// Local Storage-Kompatibilität · http://developer.mozilla.org
// @require http://pastebin.com/raw.php?i=zrfAFeBc
//
// HkLogger
// @require http://pastebin.com/raw.php?i=Tc4QTEkP
//
// HkFinder
// @require http://pastebin.com/raw.php?i=nC9wTKbb
//
// HkGenericStyles
// @require https://github.com/gelgamek/HOMMK-Toolkit/raw/master/hommk_styles.user.js
//
// Element.Selectors.js 1.12 · http://mootools.net
// @require http://pastebin.com/raw.php?i=2G8yXznG
//
// Scroller.js 1.12 · http://mootools.net
// @require http://pastebin.com/raw.php?i=W0gZUcpe
//
// Prototype-Ergänzungen
// @require http://pastebin.com/raw.php?i=NBX5T7pp
//
// ==/UserScript==

if('undefined' == typeof __PAGE_SCOPE_RUN__) {
//	new Asset.javascript('http://userscripts.org/scripts/source/68059.user.js', {
//		'id': 'ToolkitPageScopeRunner'
//	});
	var headNode = document.getElementsByTagName("head")[0];
	var toolkitScopeRunner = document.createElement("script");
	toolkitScopeRunner.id = 'ToolkitPageScopeRunner';
	toolkitScopeRunner.type = "text/javascript";
	toolkitScopeRunner.src = 'http://userscripts.org/scripts/source/68059.user.js';
	headNode.appendChild(toolkitScopeRunner);
} else {
	// Nicht ausführen, wenn Greasemonkey im anonymen Wrapper läuft...
	try {
		
		// Master-Switch f. Debug-Ausgabe
		window.$debug = 0;
		
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
		try {
			window.assetLoader = new AssetLoader({
			    'MozillaLocalStorage': {
			        'url': 'http://pastebin.com/raw.php?i=zrfAFeBc',
			        'conditions': '"undefined" == typeof window.localStorage'
			    },
			    'HkLogger': {
			        'url': 'http://pastebin.com/raw.php?i=Tc4QTEkP',
			        'conditions': '"undefined" == typeof HkLogger'
			    },
			    'HkFinder': {
			        'url': 'http://pastebin.com/raw.php?i=nC9wTKbb',
			        'conditions': '"undefined" == typeof HkFinder'
			    },
			    'HkScriptedStyles': {
			        'url': 'https://github.com/gelgamek/HOMMK-Toolkit/raw/master/hommk_styles.user.js',
			        'conditions': '"undefined" == typeof HkStylesGeneric'
			    },
			    'MootoolsElementSelectors': {
			        'url': 'http://pastebin.com/raw.php?i=2G8yXznG',
			        'conditions': '"undefined" == typeof Element.Methods.Dom.getElementsBySelector'
			    },
			    'MootoolsScroller': {
				    'url': 'http://pastebin.com/raw.php?i=W0gZUcpe'
			    },
			    'SHA256CryptoJs': {
				    'url': 'http://crypto-js.googlecode.com/files/2.5.3-crypto-sha256.js'
			    },
			    'HkPrototypes': {
				    'url': 'http://pastebin.com/raw.php?i=NBX5T7pp'
			    }
			});
		} catch(ex) {
			alert('[AssetLoader][ERROR]' + ex);
		}
		
		window.hkCreateClasses = function() {
			
			window.console.log('[HkPublic][DEBUG]Erzeuge Klassen\u2026');
			
			window.HkStore = {};
			
			try {
				// var HkDataStorage = new Class({
				// $debug: 1,
				// options: {
				// 'clearStorage': false
				// },
				// initialize: function (options) {
				// try {
				// window.console.log('[HkDataStorage][DEBUG]Bereite HkDataStorage vor\u2026');
				// this.setOptions(options);
				// var useDefaults = !!this.options.useStorageKeyDefaults;
				// var storageKey;
				// if(!!this.options.storageKey) {
				// storageKey = this.options.storageKey;
				// } else {
				// storageKey = this.getStorageKey();
				// useDefaults = false;
				// }
				// this.setStorageKey(storageKey, useDefaults);
				// window.console.log('[HkDataStorage][DEBUG]Initialisiere HkDataStorage #' + this.storageKey);
				// if(!!this.options.clearStorage) this.clearDataStorage();
				// if(this.isDataStorageEmpty()) {
				// window.console.log('[HkDataStorage][DEBUG]Erzeuge lokalen Speicher für #' + this.storageKey);
				// this.setDataStorageContent({});
				// }
				// } catch(ex) {
				// window.console.log('[HkDataStorage][ERROR]Initialisierungsfehler: ' + ex);
				// }
				// },
				// /**
				// * @param {String} storageKey
				// * @param {Boolean} useDefaults, Pre-/Postfix für storageKey erzeugen, Default ist `true`
				// */
				// setStorageKey: function setStorageKey(storageKey, useDefaults) {
				// if("undefined" == typeof useDefaults) useDefaults = true;
				// if(useDefaults) {
				// storageKey = "HkStorage" + storageKey + this.getStorageKeyPostfix();
				// }
				// this.storageKey = storageKey;
				// },
				// getStorageKey: function getStorageKey() {
				// if(this.hasOwnProperty("storageKey")) return this.storageKey;
				// var storageKey = "HkStorage" + this.getStorageId() + this.getStorageKeyPostfix();
				// return storageKey;
				// },
				// getStorageId: function getStorageId() {
				// var id = this.getRecursive("id", false);
				// if(!id) id = Crypto.SHA256(this.toString(), {asString: true});
				// return id;
				// },
				// getStorageKeyPostfix: function getStorageKeyPostfix() {
				// var player = window.getRecursive("hk.PlayerId", "");
				// var world = window.getRecursive("hk.WorldId", "");
				// return String(player) + String(world);
				// },
				// dropFromDataStorage: function dropFromDataStorage(key) {
				// window.console.log('[HkDataStorage][DEBUG]Entferne ' + key + ' aus ' + this.storageKey);
				// var data = this.getDataStorageContent();
				// if($defined(data.key) || data.hasOwnProperty(key)) {
				// var dropped = data[key];
				// delete data[key];
				// this.setDataStorageContent(data);
				// return dropped;
				// } else {
				// window.console.log('[HkDataStorage][INFO]Kein Eintrag ' + key + ' in ' + this.storageKey);
				// }
				// return false;
				// },
				// dropAllFromDataStorage: function dropAllFromStorage() {
				// var storageData = this.pullFromDataStorage();
				// window.console.log('[HkDataStorage][DEBUG]Entferne Daten aus ' + this.storageKey);
				// if(storageData) {
				// $each(storageData, function(val, key) {
				// window.console.log('[HkDataStorage][DEBUG]Verarbeite ' + key);
				// this.dropFromDataStorage(key);
				// }.bind(this));
				// }
				// },
				// pushToDataStorage: function pushToDataStorage(key, item) {
				// if(arguments.length < 2) window.console.log('[HkDataStorage][DEBUG]Speichere Daten: ' + Json.toString(key));
				// else window.console.log('[HkDataStorage][DEBUG]Speichere Daten unter #' + key + ": " + Json.toString(item));
				// var data = this.getDataStorageContent();
				// if(arguments.length < 2) {
				// $each(key, function(item, idx) {
				// data[idx] = item;
				// });
				// } else data[key] = item;
				// this.setDataStorageContent(data);
				// },
				// pullFromDataStorage: function pullFromDataStorage(key) {
				// var data = this.getDataStorageContent();
				// if("null" == typeof data) {
				// window.console.log("[HkDataStorage.pull][DEBUG]null-Datentyp im Speicher");
				// data = {};
				// } else {
				// window.console.log("[HkDataStorage.pull][DEBUG]Datentyp im Speicher: " + typeof data);
				// }
				// if(!key) {
				// window.console.log('[HkDataStorage][DEBUG]Kein Schlüssel angefragt, liefere alle Daten zurück: ' +
				// Json.toString(key));
				// return data;
				// }
				// if(!data.hasOwnProperty(key)) return {};
				// var item = data[key];
				// return item;
				// },
				// isDataStorageEmpty: function isDataStorageEmpty(key) {
				// var data = $H(this.getDataStorageContent()).keys();
				// if (data == null || data.length <= 0) {
				// window.console.log('[HkDataStorage][DEBUG]Keine Daten in #' + this.storageKey);
				// return true;
				// }
				// return false;
				// },
				// getDataStorageContent: function getDataStorageContent() {
				// var data = window.localStorage.getItem(this.storageKey);
				// window.console.log('[HkDataStorage][DEBUG]Abgerufene Daten aus #' + this.storageKey + ": " +
				// Json.toString(data));
				// if(null == typeof data || !data) return {};
				// data = Json.evaluate(data);
				// return data;
				// },
				// setDataStorageContent: function setDataStorageContent(data) {
				// var dataString = Json.toString(data);
				// window.console.log('[HkDataStorage][DEBUG]Speichere Daten in #' + this.storageKey + ": " + dataString);
				// window.localStorage.setItem(this.storageKey, dataString);
				// this.fireEvent('onStorageUpdate', data);
				// return data;
				// },
				// clearDataStorage: function clearDataStorage() {
				// window.console.log("[HkDataStorage][DEBUG]Leere Speicher\u2026");
				// window.localStorage.clear();
				// this.fireEvent('onStorageUpdate', {});
				// }
				// });
				// HkDataStorage.implement(new Options, new Events);
			} catch(ex) {
				alert("[HkDataStorage][ERROR]" + ex);
			}
			
			try {
				window.Hk = new Class({
				    idScript: "HkToolkit",
				    version: "2012.01.12.22.44.260000",
				    Coords: {
				        lastRegion: {
				            x: 0,
				            y: 0
				        },
				        lastGoto: {
				            x: 0,
				            y: 0
				        },
				        regExp: /\(?\s*([0-9]+)\s*[,.\-]\s*([0-9]+)\s*\)?/
				    },
				    doNothing: Class.empty,
				    initialize: function() {
					    try {
						    this.HOMMK = window.HOMMK;
						    this.Player = this.HOMMK.player;
						    this.PlayerId = this.Player.get('id');
						    this.UserId = this.Player.get('userId');
						    this.AllianceId = this.Player.get('allianceId');
						    this.AllianceName = this.Player.get('allianceName');
						    this.Map = this.HOMMK.worldMap;
						    this.WorldSize = this.Map.get('_size');
						    this.WorldId = this.Player.get('worldId');
					    } catch(ex) {
						    alert('[Hk][ERROR]Hk-Initialisierung fehlgeschlagen: ' + ex);
					    }
				    },
				    getRegionName: function getRegionName(x, y) {
					    if(arguments.length == 1) {
						    var xy = this.HOMMK.getXYFromRegionNumber();
						    x = xy.x;
						    y = xy.y;
					    }
					    var region = window.HOMMK.getRegionFromXY(x, y);
					    var str = "";
					    if(region.content.hasOwnProperty("cN")) { // Stadt
						    str += region.content.cN; // Name
						    if(region.content.hasOwnProperty("pN") && !!region.content.pN) str += ", " + region.content.pN; // Besitzer
						    if(region.content.hasOwnProperty("iAN") && !!region.content.iAN)
						      str += " (" + region.content.iAN + ")"; // Allianz
					    } else if(region.content.hasOwnProperty("rB")) { // Gebietsgebäude
						    str += region.content.rB.n; // Name
						    if(region.content.rB.hasOwnProperty("owner") && !!region.content.rB.owner) {
							    str += "(" + region.content.rB.owner.name + ")"; // Name
						    }
					    } else {
						    str += "Region #" + window.HOMMK.getRegionNumberFromXY(x, y);
					    }
					    // window.console.log(region);
					    // window.console.log(this.HOMMK.worldMap);
					    return str;
				    },
				    fixPosition: function fixPosition(p) {
					    if(p > this.WorldSize) return p - this.WorldSize;
					    return p;
				    },
				    validatePosition: function validatePosition(p) {
					    p = new Number(p).round();
					    if(isNaN(p) || p <= 0 || p > this.WorldSize) return false;
					    return p;
				    },
				    gotoPosition: function gotoPosition(x, y, zoom) {
					    var p;
					    // window.console.log(this.HOMMK);
					    if(!$defined(zoom)) zoom = window.HOMMK.REGION_WORLDMAP_ZOOM_13X13;
					    p = window.HOMMK.getRegionNumberFromXY(x, y);
					    if(!this.validatePosition(x) || !this.validatePosition(y)) return false;
					    window.HOMMK.setCurrentView(zoom, p, x, y);
					    return true;
				    },
				    getCurrentX: function getCurrentX() {
					    return this.validatePosition(this.Coords.lastRegion.x || window.HOMMK.currentView.regionX);
				    },
				    getCurrentY: function getCurrentY() {
					    return this.validatePosition(this.Coords.lastRegion.y || window.HOMMK.currentView.regionY);
				    }
				});
				// try {
				// window.Hk.implement(new window.HkLogger());
				// } catch(ex) {
				// alert('[Hk][ERROR]Logger-Implementierung fehlgeschlagen: ' + ex);
				// }
			} catch(ex) {
				alert('[Hk][ERROR]' + ex);
			}
			var Hk = window.Hk;
			
			try {
				window.hkToolkit = new Hk();
				window.hk = window.hkToolkit;
			} catch(ex) {
				alert('[HkToolkit][ERROR]' + ex);
			}
			
			var hk = window.hk;
			var HOMMK = hk.HOMMK;
			var idScript = hk.idScript;
			var version = hk.version;
			window.HOMMK_HkToolkit = window.HOMMK_HkToolkit ? window.HOMMK_HkToolkit : {
				'version': hk.version
			};
			window.console.log('[PUBLIC][DEBUG]Starte HkToolkit\u2026');
			
			/**
			 * CSS
			 * 
			 * @todo Core und Shortcuts trennen - Ergänzungen warten auf Core und "docken" sich an...
			 */
			window.hk.Styles = {
			    'Shortcuts': {
			        'list': {
			            'paddingTop': '2px',
			            'paddingBottom': '2px',
			            'marginLeft': '0px',
			            'marginRight': '0px',
			            'marginTop': '0px',
			            'marginBottom': '0px',
			            'clear': 'both',
			            'float': 'none',
			            'backgroundColor': '#0e0e0e',
			            'height': 'auto',
			            'maxHeight': '800px',
			            'width': 'auto',
			            'maxWidth': '1200px'
			        },
			        'Form': {
			            'inputX': {
				            'verticalAlign': 'middle'
			            },
			            'inputY': {
				            'verticalAlign': 'middle'
			            },
			            'inputName': {
			                'verticalAlign': 'middle',
			                'width': '90%'
			            },
			            'submit': {
			                'margin': '0px',
			                'verticalAlign': 'middle',
			                'cursor': 'pointer'
			            },
			            'load': {
			                'margin': '0px',
			                'verticalAlign': 'middle',
			                'cursor': 'pointer'
			            },
			            'gotoPosition': {
			                'margin': '0px',
			                'verticalAlign': 'middle',
			                'cursor': 'pointer'
			            },
			            'error': {},
			            'valid': {}
			        },
			        'Entry': {
			            'deleteButton': {
			                'cursor': 'pointer',
			                'float': 'right',
			                'paddingTop': '3px'
			            },
			            'text': {
			                'cursor': 'pointer',
			                'width': 'auto',
			                'marginLeft': '2px',
			                'marginRight': '20px',
			                'paddingTop': '3px',
			                'paddingBottom': '3px'
			            },
			            'entry': {
			                'padding': '2px 0px',
			                'borderTop': '1px solid #303030',
			                'clear': 'both'
			            }
			        },
			    },
			    'window': {
			        'zIndex': '95000',
			        'margin': 'auto',
			        'display': 'block',
			        'position': 'absolute',
			        'border': '1px solid #000',
			        'border-top-left-radius': '5px',
			        'border-top-right-radius': '5px',
			        'top': '50px',
			        'left': 'auto',
			        'bottom': 'auto',
			        'right': 'auto',
			        'width': 'auto',
			        'height': 'auto',
			        'backgroundColor': '#0e0e0e',
			        'color': '#f2f2f2',
			        'overflow': 'none',
			        'paddingBottom': '0px',
			        'borderTopLeftRadius': '10px',
			        'borderTopRightRadius': '10px',
			        'borderBottomLeftRadius': '5px'
			    },
			    'footer': {
			        'clear': 'both',
			        'float': 'none',
			        'marginTop': '0px',
			        'paddingTop': '3px',
			        'paddingBottom': '0px',
			        'marginBottom': '0px',
			        'marginLeft': '0px',
			        'marginRight': '0px',
			        'height': 'auto',
			        'width': '100%',
			        'backgroundColor': '#1a1a1a'
			    },
			    'donate': {
			        'display': 'block',
			        'float': 'right',
			        'width': 'auto',
			        'marginLeft': 'auto'
			    },
			    'scrollArea': {
			        'float': 'left',
			        'marginLeft': '0px',
			        'height': '16px',
			        'width': 'auto',
			    },
			    'scrollButton': {
				    'cursor': 'pointer'
			    },
			    'content': {
			        'margin': '0px',
			        'marginBottom': '0px',
			        'paddingTop': '2px',
			        'paddingBottom': '2px',
			        'overflow': 'hidden',
			        'height': '48px',
			        'minHeight': '32px',
			        'maxHeight': '800px',
			        'width': '160px',
			        'minWidth': '120px',
			        'maxWidth': '1200px'
			    },
			    'header': {
			        'zIndex': '96000',
			        'marginTop': '0px',
			        'marginBottom': '5px',
			        'paddingTop': '1px',
			        'paddingBottom': '1px',
			        'paddingLeft': '5px',
			        'paddingRight': '5px',
			        'borderTopLeftRadius': '10px',
			        'borderTopRightRadius': '10px',
			        'backgroundColor': '#1a1a1a'
			    },
			    'title': {
			        'fontSize': "0.8em",
			        'paddingLeft': '3px',
			        'backgroundColor': 'transparent',
			        'paddingBottom': '2px',
			        'marginTop': '4px',
			        'marginBottom': '2px',
			        'marginRight': 'auto',
			        'width': 'auto'
			    },
			    'reduceButton': {
			        'zIndex': '97000',
			        'cursor': 'pointer',
			        'float': 'right',
			        'width': '22px',
			        'height': '18px',
			        'backgroundPosition': '-110px',
			        'backgroundRepeat': 'no-repeat',
			        'backgroundImage': 'url("http://cgit.compiz.org/fusion/decorators/emerald/plain/defaults/theme/buttons.min.png")'
			    },
			    'updateLink': {
			        'zIndex': '97000',
			        'verticalAlign': 'middle',
			        'float': 'right',
			        'paddingTop': '2px',
			        'fontSize': '0px'
			    },
			    'updateButton': {
			        'zIndex': '97000',
			        'border': ' none'
			    },
			    'resizeButton': {
			        'zIndex': '97000',
			        'verticalAlign': 'middle',
			        'float': 'right',
			        'cursor': 'se-resize',
			        'border': ' none',
			        'width': '12px',
			        'height': '12px',
			        'backgroundPosition': '0px 0px',
			        'backgroundImage': "url(http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons_by_subject/graphics/png/32x32/cursor-corner-bottom-right.png)"
			    },
			    'closeButton': {}
			};
			

			try {
				/**
				 * Events: onStorageUpdate
				 * 
				 * Options: storageKey clearStorage
				 */
				window.Hk.HkStorage = new Class(
				    {
				        $debug: 1,
				        storageKey: "HkStorage" + window.hk.PlayerId + "" + window.hk.WorldId,
				        options: {
				            'storageKey': "HkStorage" + window.hk.PlayerId + "" + window.hk.WorldId,
				            'clearStorage': false
				        },
				        initialize: function(options) {
					        try {
						        window.console.log('[HkPublic][DEBUG]Bereite HkStorage vor\u2026');
						        this.setOptions(options);
						        this.storageKey = this.options.storageKey;
						        window.console.log('[HkPublic][DEBUG]Initialisiere HkStorage #' + this.storageKey);
						        if(this.options.clearStorage) this.clearStorage();
						        if(this.isEmpty()) {
							        window.console.log('[HkStorage][DEBUG]Erzeuge lokalen Speicher für #' + this.storageKey);
							        this.setStorageData({});
						        }
					        } catch(ex) {
						        window.console.log('[HkStorage][ERROR]Initialisierungsfehler: ' + ex);
					        }
				        },
				        drop: function drop(key) {
					        window.console.log('[HkStorage][DEBUG]Entferne ' + key + ' aus ' + this.storageKey);
					        var data = this.getStorageData();
					        if($defined(data.key) || data.hasOwnProperty(key)) {
						        var dropped = data[key];
						        delete data[key];
						        this.setStorageData(data);
						        return dropped;
					        } else {
						        window.console.log('[HkStorage][INFO]Kein Eintrag ' + key + ' in ' + this.storageKey);
					        }
					        return false;
				        },
				        dropAll: function dropAll() {
					        var storageData = this.pull();
					        window.console.log('[HkStorage][DEBUG]Entferne Daten aus ' + this.storageKey);
					        if(storageData) {
						        $each(storageData, function(val, key) {
							        window.console.log('[HkStorage][DEBUG]Verarbeite ' + key);
							        this.drop(key);
						        }.bind(this));
					        }
				        },
				        push: function push(key, item) {
					        if(arguments.length < 2) window.console.log('[HkStorage][DEBUG]Speichere Daten: '
					            + Json.toString(key));
					        else window.console.log('[HkStorage][DEBUG]Speichere Daten unter #' + key + ": "
					            + Json.toString(item));
					        var data = this.getStorageData();
					        if(arguments.length < 2) {
						        $each(key, function(item, idx) {
							        data[idx] = item;
						        });
					        } else data[key] = item;
					        this.setStorageData(data);
				        },
				        pull: function pull(key) {
					        var data = this.getStorageData();
					        if("null" == typeof data) {
						        window.console.log("[HkStorage.pull][DEBUG]null-Datentyp im Speicher");
						        data = {};
					        } else {
						        window.console.log("[HkStorage.pull][DEBUG]Datentyp im Speicher: " + typeof data);
					        }
					        if(!key) {
						        window.console.log('[HkStorage][DEBUG]Kein Schlüssel angefragt, liefere alle Daten zurück: '
						            + Json.toString(key));
						        var exp = {};
						        for(d in data) {
							        window.console.log('[HkStorage][DEBUG]Prüfe Eintrag: ' + Json.toString(d));
							        if("function" == $type(data[d])) continue;
							        window.console.log('[HkStorage][DEBUG]Eintrag akzeptiert.');
							        exp[d] = data[d];
						        }
						        return exp;
					        }
					        if(!data.hasOwnProperty(key)) return {};
					        var item = data[key];
					        return item;
				        },
				        isEmpty: function isEmpty(key) {
					        var data = $H(this.getStorageData()).keys();
					        if(data == null || data.length <= 0) {
						        window.console.log('[HkStorage][DEBUG]Keine Daten in #' + this.storageKey + ": "
						            + Json.toString(data));
						        return true;
					        }
					        return false;
				        },
				        getStorageData: function getStorageData() {
					        var data = window.localStorage.getItem(this.storageKey);
					        window.console.log('[HkStorage][DEBUG]Abgerufene Daten aus #' + this.storageKey + ": "
					            + Json.toString(data));
					        if(null == typeof data || !data) return {};
					        data = Json.evaluate(data);
					        return data;
				        },
				        setStorageData: function setStorageData(data) {
					        var dataString = Json.toString(data);
					        window.console.log('[HkStorage][DEBUG]Speichere Daten in #' + this.storageKey + ": " + dataString);
					        window.localStorage.setItem(this.storageKey, dataString);
					        this.fireEvent('onStorageUpdate', data);
					        return data;
				        },
				        clearStorage: function clearStorage() {
					        window.console.log("[HkStorage][DEBUG]Leere Speicher...");
					        window.localStorage.clear();
					        this.fireEvent('onStorageUpdate', {});
				        }
				    });
				window.Hk.HkStorage.implement(new Events, new Options);
			} catch(ex) {
				alert('[HkStorage][ERROR]' + ex);
				throw new Exception(ex);
			}
			
			try {
				hk.Storage = {
					Common: new Hk.HkStorage()
				};
			} catch(ex) {
				alert('[HkStorage.Common][ERROR]' + ex);
				throw new Exception(ex);
			}
			
			Hk.HkReducer = new Class({
			    $debug: 1,
			    $status: null,
			    $default: "TargetVisible",
			    IS_REDUCED: "TargetReduced",
			    IS_VISIBLE: "TargetVisible",
			    options: {
				    'duration': 500
			    },
			    initialize: function(toggle, target, options) {
				    this.setOptions(options);
				    this.toggle = toggle;
				    this.target = target;
				    var slideOptions = this.options;
				    slideOptions.onChange = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Change Event");
					    window.console.log(evt);
					    this.fireEvent("onTargetChange", [
					        this.toggle, this.target]);
				    }.bind(this);
				    slideOptions.onTick = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Tick Event");
					    window.console.log(evt);
					    this.fireEvent("onTargetStep", [
					        this.toggle, this.target]);
				    }.bind(this);
				    slideOptions.onComplete = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Complete Event");
					    window.console.log(evt);
					    this.$status = (this.$status == this.IS_REDUCED) ? this.IS_VISIBLE : this.IS_REDUCED;
					    this.fireEvent("on" + this.$status, [
					        this.toggle, this.target]);
					    this.updateDimensions(this.target);
					    this.fireEvent("onTargetComplete", [
					        this.toggle, this.target]);
				    }.bind(this);
				    this.toggle.slider = new Fx.Slide(this.target, slideOptions);
				    this.toggle.target = this.target;
				    this.toggle.reducer = this;
				    this.target.reducer = this;
				    this.toggle.addEvent('mousedown', this.togglePressed.bind(this));
				    this.toggle.addEvent('click', this.toggleClicked.bind(this));
				    // @todo letzten Zustand laden
				    if(this.$status == null) this.$status = this.$default;
				    window.console.log(this.toggle.slider);
				    this.updateDimensions(this.target);
			    },
			    togglePressed: function togglePressed(evt) {
				    var toggle = evt.target;
				    var target = toggle.target;
				    var slider = toggle.slider;
				    if(this.$status == this.IS_VISIBLE) {
					    window.console.log("[HkReducer][Event]Target height: " + target.style.height);
					    // var targetHeight = target.getCoordinates().height;
					    // target.style.height = targetHeight + "px";
					    // var resetTargetHeight = function(target) {
					    // if(parseInt(target.getStyle('height')) > 0) {
					    // target.setStyle('height', 'auto');
					    // }
					    // }
					    // resetTargetHeight.delay(500, this, target);
				    } else {
					    window.console.log("[HkReducer][Event]Target height: " + target.style.height);
				    }
			    },
			    toggleClicked: function toggleClicked(evt) {
				    var toggle = evt.target;
				    var target = toggle.target;
				    var slider = toggle.slider;
				    if(this.$status == this.IS_VISIBLE) {
					    slider.slideOut();
				    } else {
					    slider.slideIn();
				    }
			    },
			    updateDimensions: function updateDimensions(target) {
				    window.console.log("[HkReducer][DEBUG]Passe die Größen an\u2026");
				    var divs = target.getElementsByTagName("div");
				    $each(divs, function(aDiv) {
					    var divHeight = $(aDiv).getStyle('height');
					    var divId = aDiv.id || "N/A";
					    window.console.log("[HkReducer][DEBUG]Passe die Höhe des Containers #" + divId + " an (" + divHeight
					        + ")\u2026");
					    if($chk(divHeight) && divHeight.toInt() <= 0 && divHeight != 'auto') {
						    window.console.log("[HkReducer][DEBUG]Setze Höhe des Containers #" + divId + ": " + divHeight
						        + " \u2192 auto\u2026");
						    aDiv.setStyle('height', 'auto');
					    } else {
						    window.console.log("[HkReducer][DEBUG]Lasse die Höhe des Containers #" + divId + " unverändert ("
						        + divHeight + ")\u2026");
					    }
				    });
				    var targetId = target.id || "N/A";
				    var targetHeight = $(target).getStyle('height');
				    window.console.log("[HkReducer][DEBUG]Setze Höhe des Hauptelements #" + targetId + ": " + targetHeight
				        + " \u2192 auto\u2026");
				    // $$(target, target.getParent()).setStyle('height', 'auto');
				    target.setStyle('height', 'auto');
				    var parentHeight = $(target.getParent).getStyle('height');
				    var realParentHeight = target.getParent().getCoordinates().height + "px";
				    window.console.log("[HkReducer][DEBUG]Setze Höhe des Slide-Elements: " + parentHeight + " \u2192 "
				        + realParentHeight + "\u2026");
				    target.getParent().setStyle('height', realParentHeight);
			    }
			});
			Hk.HkReducer.implement(new Events, new Options);
			
			hk.Storage.HkWindows = new Hk.HkStorage({
				'storageKey': 'HkWindowsInternal'
			});
			
			Hk.HkWindows = new Class(
			    {
			        $debug: 1,
			        storage: window.hk.Storage.HkWindows,
			        windows: [],
			        options: {
			            'id': 'HkWindow',
			            'reduceable': true,
			            'closeable': false,
			            'draggable': true,
			            'resizeable': true,
			            'scrollable': true,
			            'autoScroll': true,
			            'title': 'HkWindow',
			            'createHeader': true,
			            'createTitle': true,
			            'createContentContainer': true,
			            'createDonateButton': false,
			            'preventTextSelection': true,
			            'addToDOM': true,
			            'reduce': false,
			            'updateable': true,
			            // Trunk:
			            // 'updateUrl': "https://github.com/gelgamek/HOMMK-Toolkit/raw/master/hommk_shortcuts.user.js",
			            'updateUrl': "http://userscripts.org/scripts/source/121763.user.js",
			            'scroller': false,
			            'scrollers': {
			                'up': Class.empty,
			                'down': Class.empty
			            },
			            'windowStyles': window.hk.Styles.window,
			            'footerStyles': window.hk.Styles.footer,
			            'donateStyles': window.hk.Styles.donate,
			            'scrollAreaStyles': window.hk.Styles.scrollArea,
			            'scrollButtonStyles': window.hk.Styles.scrollButton,
			            'resizeButtonStyles': window.hk.Styles.resizeButton,
			            'headerStyles': window.hk.Styles.header,
			            'titleStyles': window.hk.Styles.title,
			            'reduceButtonStyles': window.hk.Styles.reduceButton,
			            'closeButtonStyles': window.hk.Styles.closeButton,
			            'updateButtonStyles': window.hk.Styles.updateButton,
			            'updateLinkStyles': window.hk.Styles.updateLink,
			            'contentStyles': window.hk.Styles.content,
			        },
			        initialize: function(options) {
				        this.setOptions(options);
				        this.options.scrollers.up = this.scrollUp;
				        this.options.scrollers.down = this.scrollDown;
			        },
			        createWindow: function createWindow(id, options) {
				        this.setOptions(options);
				        var windowId = this.getWindowId(id, options);
				        var windowNode = new Element("div", {
				            'id': windowId,
				            'class': "HkWindow Radius5BottomLeft Radius10TopLeft Radius10TopRight",
				            'styles': this.options.windowStyles
				        });
				        var contentNode;
				        if(this.options.createContentContainer) {
					        contentNode = this.createContentContainer(id, options);
				        } else {
					        contentNode = new Object;
				        }
				        if(this.options.createHeader) {
					        var headerNode = this.createHeader(id, options);
					        windowNode.adopt(headerNode);
					        if(this.options.draggable) {
						        new Drag.Move(windowNode, {
						            handle: headerNode,
						            hkWindow: this,
						            hkWindowId: id,
						            onComplete: function(evt) {
							            window.console.log('[HkWindow][DEBUG]Drag Complete Event an ' + this.options.hkWindowId);
							            if(!this.options.hkWindow.saveWindowPosition(this.options.hkWindowId,
							                this.options.hkWindow.options)) {
								            window.console
								                .log('[HkWindow][DEBUG]Drag Event Handler saveWindowPosition fehlgeschlagen für '
								                    + windowNode.hkWindowId);
							            }
						            }
						        });
					        }
				        }
				        if(this.options.createContentContainer) {
					        windowNode.adopt(contentNode);
				        }
				        var footer = this.createFooter(id, options);
				        if(this.options.resizeable) {
					        window.console.log('[HkWindow][DEBUG]Erzeuge Resize-Button für ' + id);
					        var resizeButton = this.createResizeButton(id, options);
					        footer.adopt(resizeButton);
				        }
				        if(this.options.scrollable && !this.options.autoScroll) {
					        var scrollArea = this.createScrollArea(id, options);
					        footer.adopt(scrollArea);
				        }
				        windowNode.adopt(footer);
				        if(this.options.addToDOM) {
					        $('MainContainer').adopt(windowNode);
					        if(this.options.resizeable) {
						        this.makeResizeable(id, options, contentNode);
					        }
					        this.windows.push(windowNode);
				        }
				        this.loadWindowPosition(id, options);
				        return windowNode;
			        },
			        getWindowNode: function getWindowNode(id, options) {
				        window.console.log('[HkWindow][DEBUG]Rufe Fenster-Knoten für ' + id);
				        var win = $(this.getWindowId(id, options));
				        return "undefined" == typeof win ? null : win;
			        },
			        getWindowPosition: function getWindowPosition(id, options) {
				        var win = this.getWindowNode(id, options);
				        if(win == null) return null;
				        var pos = win.getPosition();
				        window.console.log('[HkWindow][DEBUG]Abgerufene Fensterposition für  ' + win.id + ': '
				            + Json.toString(pos));
				        return pos;
				        // return this.getWindowData(id, options, "getPosition");
			        },
			        setWindowPosition: function setWindowPosition(pos, id, options) {
				        var win = this.getWindowNode(id, options);
				        if(win == null) return null;
				        window.console.log('[HkWindow][DEBUG]Setze Fensterposition für  ' + win.id + ': ' + Json.toString(pos));
				        if("undefined" == typeof pos || !pos || !('x' in pos) || !('y' in pos)) return null;
				        var windowPosition = {
				            'top': pos.y,
				            'left': pos.x
				        };
				        win.setStyles(windowPosition);
				        return windowPosition;
			        },
			        loadWindowPosition: function loadWindowPosition(id, options) {
				        var win = this.getWindowNode(id, options);
				        if(win == null) return null;
				        var key = "WindowPosition" + win.id;
				        var pos = this.storage.pull(key);
				        window.console.log('[HkWindow][DEBUG]Geladene Fensterposition für  ' + key + ': ' + Json.toString(pos));
				        if("undefined" == typeof pos || !pos || !('x' in pos) || !('y' in pos)) {
					        pos = this.saveWindowPosition(id, options);
				        }
				        this.setWindowPosition(pos, id, options);
				        return pos;
			        },
			        saveWindowPosition: function saveWindowPosition(id, options) {
				        var win;
				        if((win = this.getWindowNode(id, options)) == null) return null;
				        var key = "WindowPosition" + win.id;
				        var pos = this.getWindowPosition(id, options);
				        window.console
				            .log('[HkWindow][DEBUG]Speichere Fensterposition für  ' + key + ': ' + Json.toString(pos));
				        this.storage.push(key, pos);
				        return pos;
			        },
			        showScrollButtons: function showScrollButton(id, options) {

			        },
			        hideScrollButtons: function hideScrollButton(id, options) {

			        },
			        createFooter: function createFooter(id, options) {
				        this.setOptions(options);
				        var scrId = this.getId('HkWindowFooter', id, options);
				        var footerNode = new Element('div', {
				            'id': scrId,
				            'class': 'Radius5BottomLeft',
				            'styles': this.options.footerStyles
				        });
				        // @todo in createWindow verschieben
				        if(this.options.createDonateButton) {
					        var donate = new Element("form", {
					            'action': "https://www.paypal.com/cgi-bin/webscr",
					            'method': 'post',
					            'target': '_blank',
					            'alt': 'Unterstütze den Entwickler!',
					            'title': 'Unterstütze den Entwickler!',
					            'name': 'Unterstütze den Entwickler!',
					            'styles': this.options.donateStyles
					        });
					        donate.innerHTML = '<input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="WRWUH9K7JBMBY"><input type="image" src="http://icons.iconarchive.com/icons/visualpharm/magnets/16/coins-icon.png" border="0" name="submit" title="Den Entwickler unterstützen!" name="Den Entwickler unterstützen!" alt="Den Entwickler unterstützen!"><img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">';
					        footerNode.adopt(donate);
				        }
				        return footerNode;
			        },
			        createScrollArea: function createScrollArea(id, options) {
				        this.setOptions(options);
				        var scrId = this.getId('HkWindowScrollers', id, options);
				        var scrollNode = new Element('div', {
				            'id': scrId,
				            'styles': this.options.scrollAreaStyles
				        });
				        $each(this.options.scrollers, function(handler, dir) {
					        var btn = this.createScrollButton(id, options, dir, handler);
					        scrollNode.adopt(btn);
				        }.bind(this));
				        return scrollNode;
			        },
			        createScrollButton: function createScrollButton(id, options, direction, handler) {
				        this.setOptions(options);
				        if(direction != "up" && direction != "down") direction = "down";
				        var btnId = this.getId('HkWindowScroll' + direction, id, options);
				        var scrollNode = new Element('img', {
				            'id': btnId,
				            'src': 'http://icons.iconarchive.com/icons/saki/nuoveXT/16/Small-arrow-' + direction + '-icon.png',
				            'styles': this.options.scrollButtonStyles
				        });
				        scrollNode.dir = direction;
				        scrollNode.srcId = id;
				        scrollNode.btnId = btnId;
				        scrollNode.btnOpts = options;
				        scrollNode.btnWindow = this;
				        scrollNode.addEvent('click', handler.bind(this));
				        return scrollNode;
			        },
			        scrollUp: function scrollUp(evt) {
				        window.console.log('[HkWindow][DEBUG]scrollUp:');
				        var winId = evt.target.btnWindow.getWindowId(evt.target.srcId, evt.target.btnOpts);
				        window.console.log('[HkWindow][DEBUG]Fenster-ID: ' + winId);
				        var evtRt = $(winId).getElement(".HkContent");
				        window.console.log(evtRt.getSize());
				        var size = evtRt.getSize().size;
				        var scroll = evtRt.getSize().scroll;
				        var scrollSize = evtRt.getSize().scrollSize;
				        var scrollToY = scroll.y - 20 < 0 ? 0 : scroll.y - 20;
				        window.console.log('[HkWindow][DEBUG]Scrolle zu Y=' + scrollToY);
				        evtRt.scrollTo(scroll.x, scrollToY);
				        window.console.log(evtRt.getSize());
			        },
			        scrollDown: function scrollDown(evt) {
				        window.console.log('[HkWindow][DEBUG]scrollDown:');
				        var winId = evt.target.btnWindow.getWindowId(evt.target.srcId, evt.target.btnOpts);
				        window.console.log('[HkWindow][DEBUG]Fenster-ID: ' + winId);
				        var evtRt = $(winId).getElement(".HkContent");
				        window.console.log(evtRt.getSize());
				        var size = evtRt.getSize().size;
				        var scroll = evtRt.getSize().scroll;
				        var scrollSize = evtRt.getSize().scrollSize;
				        var scrollToY = scroll.y + size.y + 20 > scrollSize.y ? scrollSize.y - size.y : scroll.y + 20;
				        window.console.log('[HkWindow][DEBUG]Scrolle zu Y=' + scrollToY);
				        evtRt.scrollTo(scroll.x, scrollToY);
				        window.console.log(evtRt.getSize());
			        },
			        getId: function getId(base, id, options) {
				        return base + $pick($pick(id, this.options.id), this.id);
			        },
			        getWindowId: function getWindowId(id, options) {
				        return this.getId("HkWindow", id, options);
			        },
			        createHeader: function createHeader(id, options) {
				        this.setOptions(options);
				        var headerId = this.getId("HkWindowHeader", id, options);
				        var headerNode = new Element("div", {
				            'id': headerId,
				            'class': "HkWindowHeader GradientGreyDarkgreyGrey Radius10TopLeft Radius10TopRight",
				            'styles': this.options.headerStyles
				        });
				        if(this.options.reduceable) {
					        var reduceButton = this.createReduceButton(id, options);
					        headerNode.adopt(reduceButton);
				        }
				        if(this.options.updateable) {
					        var updateButton = this.createUpdateButton(id, options);
					        headerNode.adopt(updateButton);
				        }
				        if(this.options.createTitle) {
					        var titleNode = this.createTitle(id, options);
					        headerNode.adopt(titleNode);
				        }
				        return headerNode;
			        },
			        createTitle: function createTitle(id, options) {
				        this.setOptions(options);
				        var titleId = this.getId("HkWindowTitle", id, options);
				        var titleNode = new Element('h1', {
				            'id': titleId,
				            'class': 'HkWindowTitle Radius10TopLeft Radius10TopRight',
				            'styles': this.options.titleStyles
				        });
				        titleNode.setText(this.options.title);
				        if(this.options.preventTextSelection) titleNode.preventTextSelection();
				        if(this.options.draggable) {
					        new Drag.Move($(this.getWindowId(id, options)), {
						        handle: titleNode
					        });
					        titleNode.setStyles({
						        cursor: "move"
					        });
				        }
				        return titleNode;
			        },
			        createUpdateButton: function createUpdateButton(id, options) {
				        this.setOptions(options);
				        var updateLink = new Element("a", {
				            'href': this.options.updateUrl,
				            'target': '_blank',
				            'styles': this.options.updateLinkStyles
				        });
				        var updateButton = new Element('img', {
				            'alt': 'Erzwinge Aktualisierung',
				            'title': 'Erzwinge Aktualisierung',
				            'name': 'Erzwinge Aktualisierung',
				            'src': 'http://icons.iconarchive.com/icons/saki/snowish/16/Apps-system-software-update-icon.png',
				            'styles': this.options.updateButtonStyles
				        });
				        updateLink.adopt(updateButton);
				        if(this.options.preventTextSelection) updateLink.preventTextSelection();
				        return updateLink;
			        },
			        createCloseButton: function createCloseButton(id, options) {
				        this.setOptions(options);
				        var closeButton = new Element("div", {
				            'class': 'HkClose HkButton',
				            'styles': this.options.closeButtonStyles
				        });
				        return closeButton;
			        },
			        createContentContainer: function createContentContainer(id, options) {
				        this.setOptions(options);
				        var contentId = this.getId("HkWindowContent", id, options);
				        var contentNode = new Element("div", {
				            'id': contentId,
				            'class': "HkContent",
				            'styles': this.options.contentStyles
				        });
				        if(this.options.preventTextSelection) contentNode.preventTextSelection();
				        return contentNode;
			        },
			        makeScrollable: function makeScrollable(id, options) {
				        this.setOptions(options);
				        if(!this.options.scroll || !this.options.autoScroll) { return; }
				        var scroll = $(this.options.scroll);
				        this.options.scroller = new Scroller(scroll);
				        this.options.scroller.start();
			        },
			        createReduceButton: function createReduceButton(id, options) {
				        this.setOptions(options);
				        var reduceButton = new Element("div", {
				            'class': 'HkReduce HkButton',
				            'title': 'Einrollen',
				            'name': 'Einrollen',
				            'styles': this.options.reduceButtonStyles
				        });
				        reduceButton.setOpacity('0.8');
				        if(this.options.preventTextSelection) reduceButton.preventTextSelection();
				        return reduceButton;
			        },
			        makeReduceable: function makeReduceable(id, options) {
				        this.setOptions(options);
				        if(!this.options.reduce) return;
				        var reduce = $(this.options.reduce);
				        var headerDivs = $(this.getWindowId(id)).getElementsByTagName("div");
				        var reduceButton = false;
				        $each(headerDivs, function(hd) {
					        hd = $(hd);
					        if(hd.hasClass('HkReduce')) {
						        reduceButton = hd;
					        }
				        });
				        if(reduceButton && reduce) {
					        new Hk.HkReducer(reduceButton, reduce, {
					            // onTargetVisible: function(evt) {
					            // window.console.log("[HkWindow][Event]HkReducer Target Visible Event");
					            // window.console.log(evt);
					            // },
					            // onTargetStep: function(evt) {
					            // window.console.log("[HkWindow][Event]HkReducer Target Step Event");
					            // window.console.log(evt);
					            // },
					            // onTargetChange: function(evt) {
					            // window.console.log("[HkWindow][Event]HkReducer Target Change Event");
					            // window.console.log(evt);
					            // },
					            // onTargetComplete: function(evt) {
					            // window.console.log("[HkWindow][Event]HkReducer Target Complete Event");
					            // window.console.log(evt);
					            // },
					            // onTargetReduced: function(evt) {
					            // window.console.log("[HkWindow][Event]HkReducer Target Reduced Event");
					            // window.console.log(evt);
					            // },
					            hkWindowId: id,
					            hkWindow: this
					        });
				        }
			        },
			        createResizeButton: function createResizeButton(id, options) {
				        var btnId = this.getId("HkWindowResize", id, options);
				        var resizeNode = new Element("div", {
				            'id': btnId,
				            'class': 'HkWindowResizeButton',
				            'styles': this.options.resizeButtonStyles
				        });
				        if(this.options.preventTextSelection) resizeNode.preventTextSelection();
				        return resizeNode;
			        },
			        makeResizeable: function makeResizeable(id, options, resizeElement) {
				        this.setOptions(options);
				        if(!this.options.resizeable) return;
				        var btnId = this.getId("HkWindowResize", id, options);
				        // var dpnNode = this.getId("HkWindowContent", id, options);
				        resizeElement = $(($defined(resizeElement) ? resizeElement : this.getId("HkWindow", id, options)));
				        this.resizeElement = $(resizeElement);
				        window.console.log('[HkWindow][DEBUG]Erzeuge Resizeable-Funktion via ' + btnId);
				        new Drag.Base(resizeElement,
				            {
				                handle: $(btnId),
				                // hkDependent: $(dpnNode),
				                hkResize: this.resizeElement,
				                hkWindow: this,
				                hkWindowId: id,
				                modifiers: {
				                    x: 'width',
				                    y: 'height'
				                },
				                onStart: function(evt) {
					                window.console.log('[HkWindow][Event]Resize Start Event an ' + this.options.hkWindowId);
				                },
				                onDrag: function(evt) {
					                window.console.log('[HkWindow][Event]Resize Event an ' + this.options.hkWindowId);
				                },
				                onComplete: function(evt) {
					                window.console.log('[HkWindow][Event]Resize Complete Event an ' + this.options.hkWindowId);
					                if(this.options.hkWindow.options.reduceable) {
						                window.console.log('[HkWindow][DEBUG]Löse Höhenfestlegung durch Reduceable für '
						                    + this.options.hkWindowId);
						                var reduceable = evt.getParent();
						                // window.console.log('[HkWindow][DEBUG]Reduceable-Stile: ' +
						                // JSON.toString(evt.getStyles()));
						                if(reduceable.getStyle('overflow') == 'hidden' && reduceable.getStyle('height') != 'auto') {
							                reduceable.setStyle('height', 'auto');
						                }
					                }
					                if(!this.options.hkWindow.saveWindowSize(this.options.hkWindowId,
					                    this.options.hkWindow.options)) {
						                window.console
						                    .log('[HkWindow][WARN]Resize Event Handler saveWindowSize fehlgeschlagen für '
						                        + this.options.hkWindowId);
					                }
				                }
				            });
			        },
			        getWindowSize: function getWindowSize(id, options) {
				        var win = this.resizeElement || this.getWindowNode(id, options);
				        if(win == null) return null;
				        var size = win.getSize();
				        window.console.log('[HkWindow][DEBUG]Abgerufene Fenstergröße für  ' + win.id + ': '
				            + Json.toString(size));
				        return size;
			        },
			        setWindowSize: function setWindowSize(size, id, options) {
				        var win = this.resizeElement || this.getWindowNode(id, options);
				        if(win == null) return null;
				        window.console.log('[HkWindow][DEBUG]Setze Fenstergröße für  ' + win.id + ': ' + Json.toString(size));
				        if("undefined" == typeof size || !size || !('size' in size) || !('x' in size.size)
				            || !('y' in size.size)) return null;
				        var windowSize = {
				            'width': size.size.x,
				            'height': size.size.y
				        };
				        win.setStyles(windowSize);
				        return windowSize;
			        },
			        loadWindowSize: function loadWindowSize(id, options) {
				        var win = this.resizeElement || this.getWindowNode(id, options);
				        if(win == null) return null;
				        var key = "WindowSize" + win.id;
				        var size = this.storage.pull(key);
				        window.console.log('[HkWindow][DEBUG]Geladene Fenstergröße für  ' + key + ': ' + Json.toString(size));
				        if("undefined" == typeof size || !size || !('size' in size) || !('x' in size.size)
				            || !('y' in size.size)) {
					        size = this.saveWindowSize(id, options);
				        }
				        this.setWindowSize(size, id, options);
				        return size;
			        },
			        saveWindowSize: function saveWindowSize(id, options) {
				        var win = this.resizeElement || this.getWindowNode(id, options);
				        if(win == null) return null;
				        var key = "WindowSize" + win.id;
				        var size = this.getWindowSize(id, options);
				        window.console.log('[HkWindow][DEBUG]Speichere Fenstergröße für  ' + key + ': ' + Json.toString(size));
				        this.storage.push(key, size);
				        return size;
			        }
			    });
			Hk.HkWindows.implement(new Events, new Options);
			
			hk.Windows = new Hk.HkWindows();
			
			/**
			 * Datenstruktur für Shortcuts
			 * 
			 * @todo Auslagern
			 */
			Hk.Shortcut = new Class({
			    $debug: 1,
			    options: {
			        x: -1,
			        y: -1,
			        name: ""
			    },
			    initialize: function initialize(x, y, name) {
				    var options;
				    if(arguments.length == 1) options = x;
				    else options = {
				        'x': x,
				        'y': y,
				        'name': name
				    };
				    this.setOptions(options);
			    },
			    isValid: function isValid() {
				    var xv = window.hk.validatePosition(this.x());
				    var yv = window.hk.validatePosition(this.y());
				    if(!xv || !yv) return false;
				    return this.name().length > 0;
			    },
			    x: function x() {
				    return this.options.x;
			    },
			    y: function y() {
				    return this.options.y;
			    },
			    name: function name() {
				    return this.options.name;
			    },
			    toString: function toString() {
				    return Json.toString(this.options);
			    }
			});
			Hk.Shortcut.implement(new Options);
			
			hk.Storage.Shortcuts = new Hk.HkStorage({
				'storageKey': window.hk.idScript + "HkShortcuts" + window.hk.PlayerId + "" + window.hk.WorldId,
			});
			if(hk.Storage.Shortcuts.isEmpty()) {
				var storageData = window.hk.Storage.Common.pull();
				if(storageData) {
					$each(storageData, function(shortcutData, shortcutName) {
						if(shortcutName != "WindowPositionHkWindowHkShortcuts"
						    && shortcutName != "WindowPositionHkWindowHkExplorer") {
							window.hk.Storage.Shortcuts.push(shortcutName, shortcutData);
						} else {
							window.hk.Storage.Common.pull(shortcutName);
						}
					});
				}
			}
			
			/**
			 * Shortcuts
			 * 
			 * @todo Auslagern
			 */
			Hk.HkShortcutsWindow = new Class({
			    $debug: 1,
			    $cleanStorage: 0,
			    $hkWin: false,
			    'inputStyles': {
			        'valid': {
				        'border': '1px solid #030303'
			        },
			        'error': {
				        'border': '1px solid #fa0c0c'
			        }
			    },
			    initialize: function initialize() {
				    if(this.$debug == 1) {
					    window.hk.Storage.Shortcuts.$debug = 1;
					    window.hk.Storage.Common.$debug = 1;
					    window.hk.$debug = 1;
				    }
				    /**
						 * Speicher leeren bei fehlgeschlagener Migation… - DEV
						 * 
						 * @todo löschen!
						 */
				    if(this.$cleanStorage == 1 && !window.hk.Storage.Common.isEmpty()) {
					    window.console.log('[HkShortcutsWindow][DEBUG]Leere Shortcut-Speicher...');
					    window.hk.Storage.Shortcuts.dropAll();
				    }
				    if(window.hk.Storage.Shortcuts.isEmpty()) {
					    window.console.log("[HkShortcutsWindow][DEBUG]Shortcut-Speicher leer, versuche Migration\u2026");
					    var storageData = window.hk.Storage.Common.pull();
					    window.console.log('[HkShortcutsWindow][DEBUG]Migrationsdaten: ' + Json.toString(storageData));
					    if(storageData) {
						    $each(storageData, function(shortcutData, shortcutName) {
							    window.console.log('[HkShortcutsWindow][DEBUG]Verarbeite ' + shortcutName);
							    if(shortcutName != "WindowPositionHkWindowHkShortcuts"
							        && shortcutName != "WindowPositionHkWindowHkExplorer") {
								    window.hk.Storage.Shortcuts.push(shortcutName, shortcutData);
								    window.hk.Storage.Common.drop(shortcutName);
							    } else {
								    window.hk.Storage.Common.drop(shortcutName);
							    }
						    });
					    }
				    }
				    window.hk.Storage.Shortcuts.addEvent("onStorageUpdate", this.updateShortcutList);
				    this.$hkWin = window.hk.Windows.createWindow("HkShortcuts", {
					    'title': "HkShortcuts"
				    });
				    this.createContent(this.$hkWin, window.hk.Windows, window.hk.Storage.Shortcuts);
			    },
			    cleanStorage: function(storage) {
				    if(storage.isEmpty()) {
					    window.console.log('[HkShortcutsWindow][DEBUG]Leere Speicher #' + storage.options.storageKey);
					    var storageData = window.hk.Storage.Common.pull();
					    window.console.log('[HkShortcutsWindow][DEBUG]Migrationsdaten: ' + Json.toString(storageData));
					    if(storageData) {
						    $each(storageData, function(shortcutData, shortcutName) {
							    window.console.log('[HkShortcutsWindow][DEBUG]Verarbeite ' + shortcutName);
							    if(shortcutName != "WindowPositionHkWindowHkShortcuts"
							        && shortcutName != "WindowPositionHkWindowHkExplorer") {
								    window.hk.Storage.Shortcuts.push(shortcutName, shortcutData);
							    } else {
								    window.hk.Storage.Common.drop(shortcutName);
							    }
						    });
					    }
				    }
			    },
			    loadCurrentPosition: function loadCurrentPosition() {
				    window.console.log('[HkShortcutsWindow][DEBUG]Lade Shortcut...');
				    $("ShortcutInputX").value = window.hk.getCurrentX();
				    window.hk.Shortcuts.validateData("ShortcutInputX");
				    $("ShortcutInputY").value = window.hk.getCurrentY();
				    window.hk.Shortcuts.validateData("ShortcutInputY");
				    var name = window.hk.getRegionName(window.hk.getCurrentX(), window.hk.getCurrentY());
				    $("ShortcutInputName").value = name;
			    },
			    resetData: function resetData(wasInvalid) {
				    var useStyle;
				    if($chk(wasInvalid) && wasInvalid) useStyle = this.inputStyles.error.border;
				    else useStyle = this.inputStyles.valid.border;
				    $("ShortcutInputX").value = "";
				    $("ShortcutInputX").setStyles({
					    'border': useStyle
				    });
				    $("ShortcutInputY").value = "";
				    $("ShortcutInputY").setStyles({
					    'border': useStyle
				    });
			    },
			    validateData: function validateData(key) {
				    var i = $(key).value;
				    if(window.hk.validatePosition(i)) {
					    $(key).setStyle('border', this.inputStyles.valid.border);
				    }
			    },
			    getCurrentData: function getCurrentData() {
				    var x = $("ShortcutInputX").value;
				    var y = $("ShortcutInputY").value;
				    var nm = $("ShortcutInputName").value;
				    var shortcut = new window.Hk.Shortcut(x, y, nm);
				    return shortcut;
			    },
			    createShortcut: function createShortcut(evt) {
				    evt.preventDefault();
				    var shortcut = window.hk.Shortcuts.getCurrentData();
				    if(shortcut.isValid()) {
					    window.hk.Storage.Shortcuts.push(shortcut.name(), shortcut.options);
				    } else {
					    this.resetData(true);
				    }
			    },
			    shortcutClicked: function shortcutClicked(evt) {
				    window.console.log('[HkShortcutsWindow][DEBUG]Rufe Shortcut auf');
				    var entry = evt.target;
				    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
				    while(entry.getTag() != "div") {
					    entry = entry.getParent();
					    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
				    }
				    var shortcutName = entry.getProperty("name");
				    window.console.log('[HkShortcutsWindow][DEBUG]Rufe Werte des Eintrags ' + shortcutName + ' ab');
				    var shortcut = window.hk.Storage.Shortcuts.pull(shortcutName);
				    window.console.log('[HkShortcutsWindow][DEBUG]Werte des Eintrags: ' + Json.toString(shortcut));
				    var x = shortcut.x;
				    var y = shortcut.y;
				    window.console.log('[HkShortcutsWindow][DEBUG]Gehe zu Shortcut: ' + x + ", " + y);
				    window.hk.gotoPosition(x, y);
			    },
			    gotoCurrentPosition: function gotoCurrentPosition() {
				    var shortcut = window.hk.Shortcuts.getCurrentData();
				    window.hk.gotoPosition(shortcut.x(), shortcut.y());
			    },
			    updateShortcutList: function updateShortcutList() {
				    window.console.log('[HkShortcutsWindow][DEBUG]Aktualisiere Shortcut-Liste');
				    $("ShortcutList").empty();
				    var storageData = window.hk.Storage.Shortcuts.pull();
				    if(storageData) {
					    $each(storageData, function(shortcutData, shortcutName) {
						    var shortcut = new window.Hk.Shortcut(shortcutData);
						    window.hk.Shortcuts.addShortcutToList(shortcut);
					    });
				    }
				    window.hk.Shortcuts.updateDimensions();
			    },
			    updateDimensions: function updateDimensions() {
				    var divs = $("ShortcutList").getElementsByTagName("div");
				    $each(divs, function(aDiv) {
					    var divHeight = $(aDiv).getStyle('height');
					    if($chk(divHeight) && divHeight.toInt() <= 0) {
						    aDiv.setStyle('height', 'auto');
					    }
				    });
				    $('ShortcutList').setStyle('height', 'auto');
			    },
			    addShortcutToList: function addShortcutToList(shortcut) {
				    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + Json.toString(shortcut.options));
				    var str = shortcut.name() + "   (" + shortcut.x() + ", " + shortcut.y() + ")";
				    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + str);
				    var text = new Element('p', {
				        'class': 'EntryText EntryLink',
				        'styles': window.hk.Styles.Shortcuts.Entry.text
				    });
				    text.setText(str);
				    text.preventTextSelection();
				    text.addEvent('click', this.shortcutClicked);
				    var deleteButton = new Element('img', {
				        'class': 'EntryButton DeleteButton',
				        'name': 'delete' + shortcut.name(),
				        'title': 'Eintrag löschen',
				        'alt': 'Eintrag löschen',
				        'src': "http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/16/Actions-dialog-close-icon.png",
				        'styles': window.hk.Styles.Shortcuts.Entry.deleteButton
				    });
				    deleteButton.addEventListener('click', this.onDeleteShortcut);
				    var entry = new Element('div', {
				        'class': 'hkScLEntry',
				        'name': shortcut.name(),
				        'styles': window.hk.Styles.Shortcuts.Entry.entry
				    });
				    entry.adopt(deleteButton);
				    entry.adopt(text);
				    text.addEventListener('click', this.shortcutClicked);
				    $("ShortcutList").adopt(entry);
			    },
			    onDeleteShortcut: function onDeleteShortcut(evt) {
				    window.console.log('[HkShortcutsWindow][DEBUG]Rufe Shortcut auf');
				    var entry = evt.target;
				    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
				    while(entry.getTag() != "div") {
					    entry = entry.getParent();
					    window.console.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
				    }
				    var shortcutName = entry.getProperty("name");
				    window.console.log('[HkShortcutsWindow][DEBUG]Entferne Eintrag ' + shortcutName + '\u2026');
				    var shortcut = window.hk.Storage.Shortcuts.drop(shortcutName);
				    window.console.log('[HkShortcutsWindow][DEBUG]Entfernter Eintrag: ' + Json.toString(shortcut));
				    window.hk.Shortcuts.updateDimensions();
			    },
			    nameInputHasFocus: function nameInputHasFocus(evt) {
				    if(!($chk($("ShortcutInputX").value) || $chk($("ShortcutInputY").value))) {
					    window.hk.Shortcuts.loadCurrentPosition();
				    }
			    },
			    inputFocusLost: function inputFocusLost(evt) {
				    window.hk.Shortcuts.validateData(evt.target.id);
			    },
			    createContent: function createContent(windowNode, hkWindows, hkStorage) {
				    var contentNode = windowNode.getElement(".HkContent");
				    contentNode.setStyle('paddingTop', '0px');
				    var inputForm = new Element("form", {
				        id: "ShortcutForm",
				        name: "inputForm"
				    });
				    inputForm.setStyles({
				        paddingTop: '0px',
				        verticalAlign: 'middle'
				    });
				    inputForm.addEventListener('submit', this.createShortcut);
				    var shortcutList = new Element("div", {
				        'id': "ShortcutList",
				        'styles': window.hk.Styles.Shortcuts.list
				    });
				    var inputX = new Element("input", {
				        'id': "ShortcutInputX",
				        'name': "inputX",
				        'size': 3,
				        'maxlength': 3,
				        'styles': window.hk.Styles.Shortcuts.Form.inputX
				    });
				    inputX.addEventListener('blur', this.inputFocusLost);
				    var inputY = new Element("input", {
				        'id': "ShortcutInputY",
				        'name': "inputY",
				        'size': 3,
				        'maxlength': 3,
				        'styles': window.hk.Styles.Shortcuts.Form.inputY
				    });
				    inputY.addEventListener('blur', this.inputFocusLost);
				    var inputName = new Element("input", {
				        'id': "ShortcutInputName",
				        'name': "inputName",
				        'styles': window.hk.Styles.Shortcuts.Form.inputName
				    });
				    inputName.addEventListener('focus', this.nameInputHasFocus);
				    var gotoPosition = new Element("img", {
				        'id': 'GotoPosition',
				        'name': 'gotoPosition',
				        'alt': 'Springe zu angegebenen Koordinaten',
				        'title': 'Springe zu angegebenen Koordinaten',
				        'src': "http://icons.iconarchive.com/icons/itzikgur/my-seven/16/Favorities-icon.png",
				        'styles': window.hk.Styles.Shortcuts.Form.gotoPosition
				    });
				    gotoPosition.preventTextSelection();
				    gotoPosition.addEventListener('click', this.gotoCurrentPosition);
				    var loadPosition = new Element("img", {
				        'id': 'LoadPosition',
				        'name': 'loadPosition',
				        'alt': 'Lade Informationen der aktuellen Kartenposition',
				        'title': 'Lade Informationen der aktuellen Kartenposition',
				        'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/update-icon.png",
				        'styles': window.hk.Styles.Shortcuts.Form.load
				    });
				    loadPosition.preventTextSelection();
				    loadPosition.addEventListener('click', this.loadCurrentPosition);
				    var submitInput = new Element("img", {
				        'id': "ShortcutSubmit",
				        'name': "shortcutSubmit",
				        'alt': "Speichern",
				        'title': "Speichern",
				        'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/accept-icon.png",
				        'styles': window.hk.Styles.Shortcuts.Form.submit
				    });
				    submitInput.preventTextSelection();
				    submitInput.addEventListener('click', this.createShortcut);
				    inputForm.adopt(inputX, inputY, gotoPosition, loadPosition, submitInput, inputName);
				    contentNode.adopt(inputForm, shortcutList);
			    }
			});
			Hk.HkShortcutsWindow.implement(new Events, new Options);
			
			/**
			 * Erzeugt Shortcuts-Fenster
			 * 
			 * @todo Umbenennen und auslagern
			 */
			window.initHkToolkit = function initHkToolkit() {
				window.console.log('[HkPublic][DEBUG]Initialisiere HkToolkit\u2026');
				try {
					window.hk.Shortcuts = new window.Hk.HkShortcutsWindow();
				} catch(ex) {
					window.console.log('[HkPublic][ERROR]Fehler beim Erzeugen des Shortcuts-Fensters: ' + ex);
				}
				try {
					window.hk.Shortcuts.updateShortcutList();
				} catch(ex) {
					window.console.log('[HkPublic][ERROR]Fehler beim Aktualisieren des Shortcuts-Fensters: ' + ex);
				}
				try {
					window.hk.Windows.makeReduceable("HkShortcuts", {
					    'reduce': $("HkWindowContentHkShortcuts"),
					    'title': "HkShortcuts"
					});
					window.hk.Windows.makeScrollable("HkShortcuts", {
					    'scroll': $("HkWindowContentHkShortcuts"),
					    'title': "HkShortcuts"
					});
					window.hk.Shortcuts.updateDimensions();
				} catch(ex) {
					window.console.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Shortcuts-Fensters: ' + ex);
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
			return window.initHkToolkit;
		};
		
		window.console.log('Erzeuge Loader-Objekt\u2026');
		
		/**
		 * Verfügbarkeit der HOMMK-Objekte prüfen
		 */
		window.HkToolkitLoader = {
		    loaded: false,
		    load: function load() {
			    if(window.HkToolkitLoader.loaded) {
				    window.console.log('[HkToolkitLoader][DEBUG]HkToolkit geladen\u2026');
				    try {
					    window.HkToolkitLoaderActive = $clear(window.HkToolkitLoaderActive);
					    delete window.HkToolkitLoader;
				    } catch(ex) {
					    alert('[HkToolkitLoader][Error]Fehler beim Beenden des Loaders: ' + ex);
				    }
				    return;
			    }
			    window.console.log('[HkToolkitLoader][DEBUG]Warte auf Hk\u2026');
			    if(!!(window.HOMMK && window.HOMMK.worldMap && window.hkCreateClasses && window.assetLoader && window.assetLoader.waiting.length == 0)) {
				    window.console.log('[HkToolkitLoader][DEBUG]Hk verfügbar, bereite HkToolkit vor\u2026');
				    try {
					    window.HkToolkitLoader.loaded = true;
					    var initFunction = window.hkCreateClasses();
					    initFunction();
				    } catch(ex) {
					    alert('[HkToolkitLoader][ERROR]Fehler beim Erzeugen der Klassen für HkToolkit: ' + ex);
				    }
			    } else {
				    window.console.log('[HkToolkitLoader][DEBUG]HkToolkit wartet auf die Verfügbarkeit von Hk.');
			    }
		    }
		};
		
		window.console.log('Starte Loader\u2026');
		
		/**
		 * Alle 1000ms die Verfügbarkeit prüfen.
		 */
		try {
			window.HkToolkitLoaderActive = window.HkToolkitLoader.load.periodical(1000);
		} catch(ex) {
			alert('[HkPublic][DEBUG]Fehler beim Laden von HkToolkit: ' + ex);
		}
		
	} catch(ex) {
		alert('[HkPublic][ERROR]Unbekannter Fehler: ' + ex);
	}
}