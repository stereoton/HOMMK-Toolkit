/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
// Master-Switch f. Debug-Ausgabe
	window.$debug = $Debug$;
	try {
		if(!window.hasOwnProperty("$Name$AssetLoader")) {
			window.$Name$AssetLoader = new AssetLoader({
//				'SHA256CryptoJs': {
//					'url': 'http://crypto-js.googlecode.com/files/2.5.3-crypto-sha256.js'
//				}
			});
		}
	} catch(ex) {
		window.console.log('[$Name$AssetLoader][ERROR]' + ex);
	}
	
	if(!window.hasOwnProperty("$Name$CreateClasses")) {
		
		window.$Name$CreateClasses = function() {
			
			window.console.log('[$Name$][DEBUG]Erzeuge Klassen für $Name$\u2026');
			
			if(!window.hasOwnProperty("HkStore")) window.HkStore = {};
			
			if("undefined" != typeof hk && "undefined" != typeof Hk && !hk.hasOwnProperty("Windows")) {
				hk.Windows = new Hk.HkWindows();
			}
			
			/**
			 * Datenstruktur für Shortcuts
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
					    if($chk(divHeight) && parseInt(divHeight) <= 0) {
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
				        'styles': window.HkStylesExtra.Shortcuts.Entry.text
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
				        'styles': window.HkStylesExtra.Shortcuts.Entry.deleteButton
				    });
				    deleteButton.addEventListener('click', this.onDeleteShortcut);
				    var entry = new Element('div', {
				        'class': 'hkScLEntry',
				        'name': shortcut.name(),
				        'styles': window.HkStylesExtra.Shortcuts.Entry.entry
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
				    if("undefined" == entry) return;
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
				        'styles': window.HkStylesExtra.Shortcuts.list
				    });
				    var inputX = new Element("input", {
				        'id': "ShortcutInputX",
				        'name': "inputX",
				        'size': 3,
				        'maxlength': 3,
				        'styles': window.HkStylesExtra.Shortcuts.Form.inputX
				    });
				    inputX.addEventListener('blur', this.inputFocusLost);
				    var inputY = new Element("input", {
				        'id': "ShortcutInputY",
				        'name': "inputY",
				        'size': 3,
				        'maxlength': 3,
				        'styles': window.HkStylesExtra.Shortcuts.Form.inputY
				    });
				    inputY.addEventListener('blur', this.inputFocusLost);
				    var inputName = new Element("input", {
				        'id': "ShortcutInputName",
				        'name': "inputName",
				        'styles': window.HkStylesExtra.Shortcuts.Form.inputName
				    });
				    inputName.addEventListener('focus', this.nameInputHasFocus);
				    var gotoPosition = new Element("img", {
				        'id': 'GotoPosition',
				        'name': 'gotoPosition',
				        'alt': 'Springe zu angegebenen Koordinaten',
				        'title': 'Springe zu angegebenen Koordinaten',
				        'src': "http://icons.iconarchive.com/icons/itzikgur/my-seven/16/Favorities-icon.png",
				        'styles': window.HkStylesExtra.Shortcuts.Form.gotoPosition
				    });
				    gotoPosition.preventTextSelection();
				    gotoPosition.addEventListener('click', this.gotoCurrentPosition);
				    var loadPosition = new Element("img", {
				        'id': 'LoadPosition',
				        'name': 'loadPosition',
				        'alt': 'Lade Informationen der aktuellen Kartenposition',
				        'title': 'Lade Informationen der aktuellen Kartenposition',
				        'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/update-icon.png",
				        'styles': window.HkStylesExtra.Shortcuts.Form.load
				    });
				    loadPosition.preventTextSelection();
				    loadPosition.addEventListener('click', this.loadCurrentPosition);
				    var submitInput = new Element("img", {
				        'id': "ShortcutSubmit",
				        'name': "shortcutSubmit",
				        'alt': "Speichern",
				        'title': "Speichern",
				        'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/accept-icon.png",
				        'styles': window.HkStylesExtra.Shortcuts.Form.submit
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
				} catch(ex) {
					window.console.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Shortcuts-Fensters: ' + ex);
				}
				try {
					window.hk.Shortcuts.updateDimensions();
				}	catch(ex) {
					window.console.log('[HkPublic][WARN]Update der Abmessungen des Shortcuts-Fensters fehlgeschlagen: ' + ex);
				}
				try {
					window.hk.Windows.makeScrollable("HkShortcuts", {
					    'scroll': $("HkWindowContentHkShortcuts"),
					    'title': "HkShortcuts",
					    'autoScroll': true
					}).start();
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
	}
	
	window.HkShortcutsDependentObjectsAvailable = function() {
		try {
			return window.Hk && window.hk && window.Hk.HkWindows && window.hk.Windows;
		}	catch (ex) {
			return false;
		}
	};
	