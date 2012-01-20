if(!window.hasOwnProperty("HkStore")) window.HkStore = {};

if(!window.hasOwnProperty("HkStorageCreateClasses")) {
	window.HkStorageCreateClasses = function() {
		
		try {
			if(window.hasOwnProperty("Hk") && !window.hasOwnProperty("HkStorage")) {
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
			}
		} catch(ex) {
			window.console.log('[HkStorage][ERROR]' + ex);
		}
		var initHkStorage = function() {
			try {
				if(!window.hk.hasOwnProperty("Storage")) {
					window.hk.Storage = {
						Common: new window.Hk.HkStorage()
					};
				}
			} catch(ex) {
				window.console.log('[HkStorage.Common][ERROR]' + ex);
			}
		};
		return initHkStorage;
	};
	window.HkStorageDependentObjectsAvailable = function() {
		return !!(window.Hk && window.hk);
	};
}
