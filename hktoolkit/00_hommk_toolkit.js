if(!window.hasOwnProperty("HkToolkitCreateClasses")) {
	window.HkToolkitCreateClasses = function() {
		try {
			if(!window.hasOwnProperty("Hk")) {
				window.Hk = new Class({
				    idScript: "HkToolkit",
				    version: "2012.01.20.07.59.060000",
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
						    window.console.log('[Hk][ERROR]Hk-Initialisierung fehlgeschlagen: ' + ex);
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
			}
		} catch(ex) {
			window.console.log('[Hk][ERROR]' + ex);
		}
		var initCoreHkToolkit = function() {
			window.console.log('[PUBLIC][DEBUG]Starte HkToolkit\u2026');
			try {
				if(!window.hasOwnProperty("hkToolkit")) window.hkToolkit = new window.Hk();
				if(!window.hasOwnProperty("hk")) window.hk = window.hkToolkit;
			} catch(ex) {
				window.console.log('[HkToolkit][ERROR]' + ex);
			}
			window.HOMMK_HkToolkit = window.HOMMK_HkToolkit ? window.HOMMK_HkToolkit : {
				'version': window.hk.version
			};
		};
		return initCoreHkToolkit;
	};
	window.HkToolkitDependentObjectsAvailable = function() {
		return !!(window.HOMMK && window.HOMMK.worldMap);
	};
	
}
