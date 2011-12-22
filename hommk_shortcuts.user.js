// ==UserScript==
// @name          HkToolkit
// @namespace     http://mightandmagicheroeskingdoms.ubi.com/play
// @description   Werkzeugkasten für HOMMK
// @version		  1.01
// @include       http://mightandmagicheroeskingdoms.ubi.com/play
// @include       http://mightandmagicheroeskingdoms.ubi.com/play*
// "Jail break""
// @ require		  http://pastebin.com/raw.php?i=6TeU4De3
// @require		  http://pastebin.com/raw.php?i=AuW3JP1z
// Mootoolsl 1.12
// @require		  http://mootools.net/download/get/mootools-1.1.2-yc.js
// Local Storage-Kompatibilität · http://developer.mozilla.org
// @require		  http://pastebin.com/raw.php?i=zrfAFeBc
// Element.js 1.12 · http://mootools.net
// @ require	  http://pastebin.com/raw.php?i=5Rvtvt2s
// Element.Selectors.js 1.12 · http://mootools.net
// @require		  http://pastebin.com/raw.php?i=2G8yXznG
// Element.Filters.js 1.12 · http://mootools.net
// @ require		  http://pastebin.com/raw.php?i=i1BkpHsg
// Accordion.js 1.12 · http://mootools.net
// @require		  http://pastebin.com/raw.php?i=CePFJAgz
// Prototypes
// @require		  http://pastebin.com/raw.php?i=NBX5T7pp
// ==/UserScript==

window.HkLogger = new Class({
  log: function log(msg) {
	var $debug = this.hasOwnProperty('$debug') ? 1 : this.$debug;
	if($debug > 1) {
	  alert(msg);
	} else if($debug < 1 || undefined == typeof console || "undefined" == typeof console) {
	  return;
	} else {
	  console.log(msg);
	}
  }
});

window.hkCreateClasses = function () {
  var HkLogger = window.HkLogger;

  window.Hk = new Class({
	$debug: 1,
	idScript: "HkToolkit",
	version: "0.01",
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
	doNothing: Class.empty(),
	initialize: function() {
	  this.HOMMK = window.HOMMK;
	  this.Player = this.HOMMK.player;
	  this.PlayerId = this.Player.get('id');
	  this.UserId = this.Player.get('userId');
	  this.AllianceId = this.Player.get('allianceId');
	  this.AllianceName = this.Player.get('allianceName');
	  this.Map = this.HOMMK.worldMap;
	  this.WorldSize = this.Map.get('_size');
	  this.WorldId = this.elementId;
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
	  this.log(this.HOMMK);
	  if (!$defined(zoom)) zoom = this.HOMMK.REGION_WORLDMAP_ZOOM_13X13;
	  p = this.HOMMK.getRegionNumberFromXY(x, y);
	  if(!this.validatePosition(x) || !this.validatePosition(y)) return false;
	  this.HOMMK.setCurrentView(zoom, p, x, y);
	  return true;
	},
	getCurrentX: function getCurrentX() {
	  return this.validatePosition(this.Coords.lastRegion.x || window.HOMMK.currentView.regionX);
	},
	getCurrentY: function getCurrentY() {
	  return this.validatePosition(this.Coords.lastRegion.y || window.HOMMK.currentView.regionY);
	}
  });
  window.Hk.implement(new Events, new Options, new HkLogger);
  var Hk = window.Hk;

  window.hkToolkit = new Hk();
  window.hk = window.hkToolkit;
  var hk = window.hk;
  var hkToolkit = hk;

  window.HOMMK_HkToolkit = window.HOMMK_HkToolkit || {
	'version': hk.version
  };
  var w = window;
  var HOMMK = hk.HOMMK;
  var idScript = hk.idScript;
  var version = hk.version;
  hk.log('[PUBLIC][DEBUG]Starte HkToolkit\u2026');

  /**
   * Events:
   *	onStorageUpdate
   *
   * Options:
   *	storageKey
   *	clearStorage
   */
  Hk.HkStorage = new Class({
	'$debug': 1,
	'storageKey': "HkStorage" + window.hk.PlayerId + "" + window.hk.WorldId,
	options: {
	  'storageKey': "HkStorage" + window.hk.PlayerId + "" + window.hk.WorldId,
	  'clearStorage': false
	},
	initialize: function (options) {
	  try {
		this.setOptions(options);
		this.storageKey = this.options.storageKey;
		this.log('[HkPublic][DEBUG]Initialisiere HkStorage #' + this.storageKey);
		if(this.options.clearStorage) this.clearStorage();
		if(this.isEmpty()) {
		  this.log('[HkStorage][DEBUG]Erzeuge lokalen Speicher für #' + this.storageKey);
		  this.setStorageData({});
		}
	  }	catch(ex) {
		this.log('[HkStorage][ERROR]Initialisierungsfehler: ' + ex);
	  }
	},
	drop: function drop(key) {
	  var data = this.getStorageData();
	  if(data.hasOwnProperty(key)) {
		var dropped = data[key];
		delete data[key];
		this.setStorageData(data);
		return dropped;
	  }
	  return false;
	},
	push: function push(key, item) {
	  if(arguments.length < 2) this.log('[HkStorage][DEBUG]Speichere Daten: ' + Json.toString(key));
	  else this.log('[HkStorage][DEBUG]Speichere Daten unter #' + key + ": " + Json.toString(item));
	  var data = this.getStorageData();
	  if(arguments.length < 2) {
		$each(key, function(item, idx) {
		  data[idx] = item;
		});
	  }	else data[key] = item;
	  this.setStorageData(data);
	},
	pull: function pull(key) {
	  var data = this.getStorageData();
	  if("null" == typeof data) {
		this.log("[HkStorage.pull][DEBUG]null-Datentyp im Speicher");
		data = {};
	  }	else {
		this.log("[HkStorage.pull][DEBUG]Datentyp im Speicher: " + typeof data);
	  }
	  if(!key) {
		this.log('[HkStorage][DEBUG]Kein Schlüssel angefragt, liefere alle Daten zurück: ' + Json.toString(key));
		return data;
	  }
	  if(!data.hasOwnProperty(key)) return {};
	  var item = data[key];
	  return item;
	},
	isEmpty: function isEmpty(key) {
	  var data = this.getStorageData();
	  return (data.length <= 0);
	},
	getStorageData: function getStorageData() {
	  var data = window.localStorage.getItem(this.storageKey);
	  this.log('[HkStorage][DEBUG]Abgerufene Daten aus #' + this.storageKey + ": " + Json.toString(data));
	  if(null == typeof data || !data) return {};
	  data = Json.evaluate(data);
	  this.log("[HkStorage.getStorageData][DEBUG]Evaluierte Daten aus Speicher: " + Json.toString(data));
	  return data;
	},
	setStorageData: function setStorageData(data) {
	  var dataString = Json.toString(data);
	  this.log('[HkStorage][DEBUG]Speichere Daten in #' + this.storageKey + ": " + dataString);
	  window.localStorage.setItem(this.storageKey, dataString);
	  this.fireEvent('onStorageUpdate', data);
	  return data;
	},
	clearStorage: function clearStorage() {
	  this.log("[HkStorage][DEBUG]Leere Speicher...");
	  window.localStorage.clear();
	  this.fireEvent('onStorageUpdate', {});
	}
  });
  Hk.HkStorage.implement(new Events, new Options, new HkLogger);

  hk.Storage = {
	Common: new Hk.HkStorage()
  };

  Hk.HkReducer = new Class({
	$debug: 1,
	options: {
	  'onTargetVisible': Class.empty,
	  'onTargetReduced': Class.empty,
	  'duration': 500
	},
	initialize: function(toggle, target, options) {
	  this.setOptions(options);
	  this.toggle = toggle;
	  this.target = target;
	  this.toggle.slider = new Fx.Slide(this.target, this.options);
	  this.toggle.target = this.target;
	  this.toggle.reducer = this;
	  this.target.reducer = this;
	  this.toggle.addEvent('click', this.toggleClicked.bind(this));
	},
	toggleClicked: function toggleClicked(evt) {
	  var toggle = evt.target;
	  var target = toggle.target;
	  var slider = toggle.slider;
	  var parent = target.getParent();
	  if(parent.getStyle('height').toInt() == 0) {
		slider.slideIn().chain(this.updateDimensions(target)).chain(this.fireEvent("onTargetVisible", [toggle, target]));
	  } else {
		slider.slideOut().chain(this.updateDimensions(target)).chain(function() {
		  this.fireEvent("onTargetReduced", [toggle, target])
		}.bind(this));
	  }
	},
	updateDimensions: function updateDimensions(target) {
	  var divs = target.getElementsByTagName("div");
	  $each(divs, function(aDiv) {
		if($(aDiv).getStyle('height').intVal() <= 0) {
		  aDiv.setStyle('height', 'auto');
		}
	  });
	}
  });
  Hk.HkReducer.implement(new Events, new Options, new HkLogger);

  Hk.HkWindows = new Class({
	$debug: 1,
	storage: window.hk.Storage.Common,
	windows: [],
	options: {
	  'id': 'HkWindow',
	  'reduceable': true,
	  'closeable': false,
	  'draggable': true,
	  'title': 'HkWindow',
	  'createHeader': true,
	  'createTitle': true,
	  'createContentContainer': true,
	  'preventTextSelection': true,
	  'addToDOM': true,
	  'reduce': false
	},
	initialize: function(options) {
	  this.setOptions(options);
	},
	createWindow: function createWindow(id, options) {
	  this.setOptions(options);
	  var windowId = this.getWindowId(id, options);
	  var windowNode = new Element("div", {
		'id': windowId,
		'class': "HkWindow",
		'styles': window.hk.Styles.window
	  });
	  if(this.options.createContentContainer) {
		var contentNode = this.createContentContainer(id, options);
	  }
	  if(this.options.reduceable) {
		var reduceButton = this.createReduceButton(id, options);
		windowNode.adopt(reduceButton);
	  }
	  if(this.options.createHeader) {
		var headerNode = this.createHeader(id, options);
		windowNode.adopt(headerNode);
		if(this.options.draggable) {
		  new Drag.Move(windowNode, {
			handle: headerNode
		  });
		}
	  }
	  if(this.options.createContentContainer) {
		windowNode.adopt(contentNode);
	  }
	  if(this.options.addToDOM) {
		$('MainContainer').adopt(windowNode);
		if(this.options.reduceable) this.makeReduceable();
		this.windows.push(windowNode);
	  }
	  return windowNode;
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
		'class': "HkWindowHeader",
		'styles': window.hk.Styles.header
	  });
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
		'class': 'HkWindowTitle',
		'styles': window.hk.Styles.title
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
	createReduceButton: function createReduceButton(id, options) {
	  this.setOptions(options);
	  var reduceButton = new Element("div", {
		'class': 'HkReduce HkButton',
		'styles': window.hk.Styles.reduceButton
	  });
	  return reduceButton;
	},
	createCloseButton: function createCloseButton(id, options) {
	  this.setOptions(options);
	  var closeButton = new Element("div", {
		'class': 'HkClose HkButton',
		'styles': window.hk.Styles.closeButton
	  });
	  return closeButton;
	},
	createContentContainer: function createContentContainer(id, options) {
	  this.setOptions(options);
	  var contentId = this.getId("HkWindowContent", id, options);
	  return new Element("div", {
		'id': contentId,
		'class': "HkContent",
		'styles': window.hk.Styles.content
	  });
	},
	makeReduceable: function makeReduceable(id, options) {
	  this.setOptions(options);
	  if(!this.options.reduce) return;
	  var reduce = $(this.options.reduce);
	  window.hk.log(reduce);
	  var headerDivs = $(this.getId("HkWindow", id)).getElementsByTagName("div");
	  window.hk.log(headerDivs);
	  var reduceButton = false;
	  $each(headerDivs, function(hd) {
		hd = $(hd);
		window.hk.log(hd);
		if(hd.hasClass('HkReduce')) {
		  window.hk.log(hd);
		  reduceButton = hd;
		}
	  });
	  if(reduceButton && reduce) {
		window.hk.log("Implementiere Reducer");
		window.hk.log(reduceButton);
		window.hk.log(reduce);
		new Hk.HkReducer(reduceButton, reduce, {
		  onTargetVisible: window.hk.log,
		  onTargetHidden: window.hk.log
		});
	  }	else {
		window.hk.log(reduceButton);
		window.hk.log(reduce);
	  }
	}
  });
  Hk.HkWindows.implement(new Events, new Options, new HkLogger);

  hk.Windows = new Hk.HkWindows();

/**
 * Datenstruktur für Shortcuts @todo Auslagern
 */
  Hk.Shortcut = new Class({
	'$debug': 1,
	options: {
	  x: -1,
	  y: -1,
	  name: ""
	},
	initialize: function initialize(x, y, name) {
	  var options ;
	  if(arguments.length == 1) options = x;
	  else options = {
		'x': x,
		'y': y,
		'name': name
	  }
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
  Hk.Shortcut.implement(new Options, new HkLogger);

  hk.Storage.Shortcuts = new Hk.HkStorage(hk.idScript + "HkShortcuts" + hk.WorldId);

/**
 * Shortcuts @todo Auslagern
 */
  Hk.HkShortcutsWindow = new Class({
	'$debug': 1,
	'$hkWin': false,
	'inputStyles': {
	  'valid': {
		'border': '1px solid #030303'
	  },
	  'error': {
		'border': '1px solid #fa0c0c'
	  }
	},
	initialize: function initialize() {
	  window.hk.Storage.Shortcuts.addEvent("onStorageUpdate", this.updateShortcutList);
	  this.$hkWin = window.hk.Windows.createWindow("HkShortcuts", {
		'title': "HkShortcuts"
	  });
	  this.createContent(this.$hkWin, window.hk.Windows, window.hk.Storage.Shortcuts);
	},
	loadCurrentPosition: function loadCurrentPosition() {
	  window.hk.log('[HkShortcutsWindow][DEBUG]Lade Shortcut...');
	  $("ShortcutInputX").value = window.hk.getCurrentX();
	  window.hk.Shortcuts.validateData("ShortcutInputX");
	  $("ShortcutInputY").value = window.hk.getCurrentY();
	  window.hk.Shortcuts.validateData("ShortcutInputY");
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
	  }	else {
		this.resetData(true);
	  }
	},
	shortcutClicked: function shortcutClicked(evt) {
	  window.hk.log('[HkShortcutsWindow][DEBUG]Rufe Shortcut auf');
	  var entry = evt.target;
	  window.hk.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
	  while(entry.getTag() != "div") {
		entry = entry.getParent();
		window.hk.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
	  }
	  var shortcutName =  entry.getProperty("name");
	  window.hk.log('[HkShortcutsWindow][DEBUG]Rufe Werte des Eintrags ' + shortcutName + ' ab');
	  var shortcut = window.hk.Storage.Shortcuts.pull(shortcutName);
	  window.hk.log('[HkShortcutsWindow][DEBUG]Werte des Eintrags: ' + Json.toString(shortcut));
	  var x = shortcut.x;
	  var y = shortcut.y;
	  window.hk.log('[HkShortcutsWindow][DEBUG]Gehe zu Shortcut: ' + x + ", " + y);
	  window.hk.gotoPosition(x, y);
	},
	updateShortcutList: function updateShortcutList() {
	  window.hk.log('[HkShortcutsWindow][DEBUG]Aktualisiere Shortcut-Liste');
	  $("ShortcutList").empty();
	  var storageData = window.hk.Storage.Shortcuts.pull();
	  if(storageData) {
		$each(storageData, function(shortcutData, shortcutName) {
		  var shortcut = new window.Hk.Shortcut(shortcutData);
		  window.hk.Shortcuts.addShortcutToList(shortcut);
		});
	  }
	},
	addShortcutToList: function addShortcutToList(shortcut) {
	  hk.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + Json.toString(shortcut.options));
	  var str = shortcut.name() + "   (" + shortcut.x() + ", " + shortcut.y() + ")";
	  hk.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + str);
	  var text = new Element('p', {
		'class': 'EntryText EntryLink',
		'styles': window.hk.Styles.Shortcuts.Entry.text
	  });
	  text.setText(str);
	  text.preventTextSelection();
	  var deleteButton = new Element('img', {
		'class': 'EntryButton DeleteButton',
		'name': 'delete' + shortcut.name(),
		'src': "http://icongal.com/gallery/download/160532/actions_edit_delete_shred/png",
		'styles': window.hk.Styles.Shortcuts.Entry.deleteButton
	  });
	  deleteButton.addEventListener('click', this.onDeleteShortcut);
	  var entry = new Element('div', {
		'class': 'hkScLEntry',
		'name': shortcut.name(),
		'styles': window.hk.Styles.Shortcuts.Entry.entry
	  });
	  entry.addEvent('click', this.shortcutClicked);
	  entry.adopt(deleteButton);
	  entry.adopt(text);
	  text.addEventListener('click', this.shortcutClicked);
	  $("ShortcutList").adopt(entry);
	},
	onDeleteShortcut: function onDeleteShortcut(evt) {

	},
	nameInputHasFocus: function nameInputHasFocus(evt) {
	  if(!($chk($("ShortcutInputX").value) || $chk($("ShortcutInputY").value))) {
		window.hk.Shortcuts.loadCurrentPosition();
	  }
	},
	inputFocusLost: function inputFocusLost(evt) {
	  window.hk.Shortcuts.validateData(evt.target.id)
	},
	createContent: function createContent(windowNode, hkWindows, hkStorage) {
	  var contentNode = windowNode.getElement(".HkContent");
	  contentNode.setStyle('paddingTop', '10px');
	  var inputForm = new Element("form", {
		id: "ShortcutForm",
		name: "inputForm"
	  });
	  inputForm.setStyles({
		paddingTop: '10px',
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
	  inputX.addEventListener('blur', this.inputFocusLost)
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
	  var loadPosition = new Element("img", {
		'id': 'LoadPosition',
		'name': 'loadPosition',
		'src': "http://icongal.com/gallery/download/268172/office_word_microsoft_docx_pdf_submit/png",
		'styles': window.hk.Styles.Shortcuts.Form.load
	  });
	  loadPosition.preventTextSelection();
	  loadPosition.addEventListener('click', this.loadCurrentPosition);
	  var submitInput = new Element("img", {
		'id': "ShortcutSubmit",
		'name': "shortcutSubmit",
		'src': "http://icongal.com/gallery/download/160325/actions_games_config_theme_video/png",
		'styles': window.hk.Styles.Shortcuts.Form.submit
	  });
	  submitInput.preventTextSelection();
	  submitInput.addEventListener('click', this.createShortcut);
	  inputForm.adopt(inputX, inputY, loadPosition, submitInput, inputName);
	  contentNode.adopt(inputForm, shortcutList);
	}
  });
  Hk.HkShortcutsWindow.implement(new Events, new Options, new HkLogger);

  /**
  * Erzeugt Shortcuts-Fenster @todo Umbenennen und auslagern
  */
  window.initHkToolkit = function initHkToolkit() {
	try {
	  window.hk.Shortcuts = new window.Hk.HkShortcutsWindow();
	} catch(ex) {
	  alert('[HkPublic][UNKNOWN ERROR] '+ex);
	}
	try {
	  window.hk.Shortcuts.updateShortcutList();
	} catch(ex) {
	  alert('[HkPublic][UPDATE ERROR] '+ex);
	}
	try {
	  window.hk.Windows.makeReduceable("HkShortcuts", {
		'reduce': $("HkWindowContentHkShortcuts"),
		'title': "HkShortcuts"
	  });
	} catch(ex) {
	  alert('[HkPublic][UICREATE ERROR] '+ex);
	}
  };

  /**
   * CSS @todo Core und Shortcuts trennen - Ergänzungen warten auf Core und "docken" sich an...
   */
  window.hk.Styles = {
	'Shortcuts': {
	  'list': {
		'paddingBottom': '10px'
	  },
	  'Form': {
		'inputX': {
		  'verticalAlign': 'middle'
		},
		'inputY': {
		  'verticalAlign': 'middle'
		},
		'inputName': {
		  'verticalAlign': 'middle'
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
		'error': {

		},
		'valid': {

		}
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
		  'marginRight': 'auto',
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
	  'zIndex': 95000,
	  'margin': 'auto',
	  'display': 'block',
	  'position': 'absolute',
	  'top': '50px',
	  'left': 'auto',
	  'bottom': 'auto',
	  'right': 'auto',
	  'width': '160px',
	  'maxWidth': '320px',
	  'height': 'auto',
	  'maxHeight': '450px',
	  'backgroundColor': '#0e0e0e',
	  'color': '#f2f2f2'
	},
	'content': {
	  'height': 'auto',
	  'maxHeight': '400px',
	  'margin': '0px'
	},
	'header': {
	  'zIndex': 96000,
	},
	'title': {
	  'fontSize': "0.8em",
	  'paddingLeft': '3px'
	},
	'reduceButton': {
	  'zIndex': 97000,
	  'cursor': 'pointer',
	  'float': 'right',
	  'width': '22px',
	  'height': '18px',
	  'backgroundPosition': '-110px',
	  'backgroundRepeat': 'no-repeat',
	  'backgroundImage': 'url("http://cgit.compiz.org/fusion/decorators/emerald/plain/defaults/theme/buttons.min.png")'
	},
	'closeButton': {

  }
  };


};

/**
 * Prüft die Verfügbarkeit der HOMMK-Objekte... @todo Braucht's das überhaupt?
 */
function wait(){
  if(!!window.HOMMK && window.HOMMK.worldMap && window.HOMMK.worldMap.content && window.HOMMK.worldMap.content._size){
	clearInterval(loader);
	window.hkCreateClasses();
	window.initHkToolkit();
  }else {
  }
}

/**
 * Alle 300ms die Verfügbarkeit prüfen.  @todo Braucht's das überhaupt?
 */
var loader = setInterval(wait,300);
