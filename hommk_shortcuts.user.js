// ==UserScript==
// @name          HkToolkit
// @version       2011.12.30.23.03.140000
// @description   Werkzeugkasten für HOMMK
// @author        Gelgamek <gelgamek@arcor.de>
// @copyright	  Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
// @icon          http://icons.iconarchive.com/icons/webiconset/mobile/32/maps-icon.png
// @namespace     http://mightandmagicheroeskingdoms.ubi.com/play
// @match         http://mightandmagicheroeskingdoms.ubi.com/play*
//
// Content Scope Runner:
// @require http://userscripts.org/scripts/source/68059.user.js
// TODO Alternative zum Content Scope Runner: contentEval, ohne setTimeout()
// @-require http://userscripts.org/scripts/source/100842.user.js
//
// Local Storage-Kompatibilität · http://developer.mozilla.org
// @require http://pastebin.com/raw.php?i=zrfAFeBc
//
// Element.Selectors.js 1.12 · http://mootools.net
// @require http://pastebin.com/raw.php?i=2G8yXznG
//
// Scroller 1.12 · http://mootools.net
// @require http://pastebin.com/raw.php?i=W0gZUcpe
//
// Prototype-Ergänzungen
// @require http://pastebin.com/raw.php?i=NBX5T7pp
// ==/UserScript==

var w = window || safeWindow;
if(!w.hasOwnProperty("isGoogleChromeUA")) {
  w.isGoogleChromeUA = function() {
	return navigator.vendor.toLowerCase().indexOf('google') > -1;
  }
}

/**
 * Page Scrope Runner für Google Chrome wegen fehlendem @require-Support, siehe
 * http://www.chromium.org/developers/design-documents/user-scripts
 */
if(w.isGoogleChromeUA() && 'undefined' == typeof __HKU_PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
	// If we're _not_ already running in the page, grab the full source
	// of this script.
	var my_src = "(" + page_scope_runner.caller.toString() + ")();";

	// Create a script node holding this script, plus a marker that lets us
	// know we are running in the page scope (not the Greasemonkey sandbox).
	// Note that we are intentionally *not* scope-wrapping here.
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.textContent = "var __HKU_PAGE_SCOPE_RUN__ = true;\n" + my_src;

	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up.  Use setTimeout to force execution "outside" of
	// the user script scope completely.
	setTimeout(function() {
	  document.body.appendChild(script);
	  document.body.removeChild(script);
	}, 0);
  })();
  // Stop running, because we know Greasemonkey actually runs us in an anonymous wrapper.
  return;
}

w.hkCreateClasses = function () {

  window.HkLogger = new Class({
	log: function log(msg) {
	  var $debug = this.hasOwnProperty('$debug') ? 0 : this.$debug;
	  if($debug > 1) {
		alert(msg);
	  } else if($debug < 1 || undefined == typeof console || "undefined" == typeof console) {
		return;
	  } else {
		console.log(msg);
	  }
	}
  });
  var HkLogger = window.HkLogger;

  window.Hk = new Class({
	$debug: 1,
	idScript: "HkToolkit",
	version: "2011.12.30.23.03.140000",
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
	  this.WorldId = this.Player.get('worldId');
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
		if(region.content.hasOwnProperty("iAN") && !!region.content.iAN) str += " (" + region.content.iAN + ")";  // Allianz
	  }	else if(region.content.hasOwnProperty("rB")) { // Gebietsgebäude
		str += region.content.rB.n; // Name
		if(region.content.rB.hasOwnProperty("owner") && !!region.content.rB.owner) {
		  str += "(" + region.content.rB.owner.name + ")"; // Name
		}
	  }	else {
		str += "Region #" + this.HOMMK.getRegionNumberFromXY(x, y);
	  }
	  window.hk.log(region);
	  window.hk.log(this.HOMMK.worldMap);
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

  window.HOMMK_HkToolkit = window.HOMMK_HkToolkit || {
	'version': hk.version
  };
  var HOMMK = hk.HOMMK;
  var idScript = hk.idScript;
  var version = hk.version;
  hk.log('[PUBLIC][DEBUG]Starte HkToolkit\u2026');

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
	  'backgroundColor': '#0e0e0e',
	  'color': '#f2f2f2',
	  'overflow': 'none',
	  'paddingBottom': '0px'
	},
	'footer': {
	  'clear': 'both',
	  'marginTop': '2px',
	  'paddingTop': '3px',
	  'paddingBottom': '0px',
	  'marginBottom': '0px',
	  'marginLeft': '0px',
	  'marginRight': '0px',
	  'height': '19px',
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
	  'height': 'auto',
	  'margin': '0px',
	  'paddingTop': '0px',
	  'overflow': 'hidden',
	  'maxHeight': '450px'
	},
	'header': {
	  'zIndex': 96000,
	  'paddingBottom': '0px',
	  'backgroundColor': '#1a1a1a'
	},
	'title': {
	  'fontSize': "0.8em",
	  'paddingLeft': '3px',
	  'backgroundColor': '#1a1a1a'
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
	'updateLink': {
	  'zIndex': 97000,
	  'verticalAlign': 'middle',
	  'float': 'right',
	  'paddingTop': '3px'
	},
	'updateButton': {
	  'zIndex': 97000,
	  'border': ' none'
	},
	'closeButton': {}
  };


  /**
   * Events:
   *	onStorageUpdate
   *
   * Options:
   *	storageKey
   *	clearStorage
   */
  Hk.HkStorage = new Class({
	'$debug': 0,
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
	$debug: 0,
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
	  if(parent.getStyle('height').toString().toInt() == 0) {
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
		var divHeight = $(aDiv).getStyle('height');
		if($chk(divHeight) && divHeight.toInt() <= 0) {
		  aDiv.setStyle('height', 'auto');
		}
	  });
	  target.setStyle('height', 'auto');
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
	  'scrollable': true,
	  'autoScroll': true,
	  'title': 'HkWindow',
	  'createHeader': true,
	  'createTitle': true,
	  'createContentContainer': true,
	  'preventTextSelection': true,
	  'addToDOM': true,
	  'reduce': false,
	  'updateable': true,
	  'updateUrl': "https://github.com/gelgamek/HOMMK-Toolkit/raw/master/hommk_shortcuts.user.js",
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
		'class': "HkWindow",
		'styles': this.options.windowStyles
	  });
	  if(this.options.createContentContainer) {
		var contentNode = this.createContentContainer(id, options);
	  }
	  if(this.options.reduceable) {
		var reduceButton = this.createReduceButton(id, options);
		windowNode.adopt(reduceButton);
	  }
	  if(this.options.updateable) {
		var updateButton = this.createUpdateButton(id, options);
		windowNode.adopt(updateButton);
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
	  var footer = this.createFooter(id, options);
	  if(this.options.scrollable && !this.options.autoScroll) {
		var scrollArea = this.createScrollArea(id, options);
		footer.adopt(scrollArea);
	  }
	  windowNode.adopt(footer);
	  if(this.options.addToDOM) {
		$('MainContainer').adopt(windowNode);
		if(this.options.reduceable) this.makeReduceable();
//		if(this.options.scrollable) this.makeScrollable();
		this.windows.push(windowNode);
	  }
	  return windowNode;
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
		'styles': this.options.footerStyles
	  });
	  var donate = new Element("form", {
		'action': "https://www.paypal.com/cgi-bin/webscr",
		'method': 'post',
		'target': '_blank',
		'alt': 'Die Entwicklung unterstützen - Spende an Gelgamek',
		'styles': this.options.donateStyles
	  });
	  donate.innerHTML = '<input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="WRWUH9K7JBMBY"><input type="image" src="http://icons.iconarchive.com/icons/visualpharm/magnets/16/coins-icon.png" border="0" name="submit" title="Den Entwickler unterstützen!" name="Den Entwickler unterstützen!" alt="Den Entwickler unterstützen!"><img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">';
	  footerNode.adopt(donate);
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
	  window.hk.log('[HkWindow][DEBUG]scrollUp:');
	  var winId = evt.target.btnWindow.getWindowId(evt.target.srcId, evt.target.btnOpts);
	  window.hk.log('[HkWindow][DEBUG]Fenster-ID: ' + winId);
	  var evtRt = $(winId).getElement(".HkContent");
	  window.hk.log(evtRt.getSize());
	  var size = evtRt.getSize().size;
	  var scroll = evtRt.getSize().scroll;
	  var scrollSize = evtRt.getSize().scrollSize;
	  var scrollToY = scroll.y - 20 < 0 ? 0 : scroll.y - 20;
	  window.hk.log('[HkWindow][DEBUG]Scrolle zu Y=' + scrollToY);
	  evtRt.scrollTo(scroll.x, scrollToY);
	  window.hk.log(evtRt.getSize());
	},
	scrollDown: function scrollDown(evt) {
	  window.hk.log('[HkWindow][DEBUG]scrollDown:');
	  var winId = evt.target.btnWindow.getWindowId(evt.target.srcId, evt.target.btnOpts);
	  window.hk.log('[HkWindow][DEBUG]Fenster-ID: ' + winId);
	  var evtRt = $(winId).getElement(".HkContent");
	  window.hk.log(evtRt.getSize());
	  var size = evtRt.getSize().size;
	  var scroll = evtRt.getSize().scroll;
	  var scrollSize = evtRt.getSize().scrollSize;
	  var scrollToY = scroll.y + size.y + 20 > scrollSize.y ? scrollSize.y - size.y : scroll.y + 20;
	  window.hk.log('[HkWindow][DEBUG]Scrolle zu Y=' + scrollToY);
	  evtRt.scrollTo(scroll.x, scrollToY);
	  window.hk.log(evtRt.getSize());
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
		'styles': this.options.headerStyles
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
	createReduceButton: function createReduceButton(id, options) {
	  this.setOptions(options);
	  var reduceButton = new Element("div", {
		'class': 'HkReduce HkButton',
		'styles': this.options.reduceButtonStyles
	  });
	  return reduceButton;
	},
	createUpdateButton: function createUpdateButton(id, options) {
	  this.setOptions(options);
	  var updateLink = new Element("a", {
		'href': this.options.updateUrl,
		'target': '_blank',
		'styles': this.options.updateLinkStyles
	  });
	  var updateButton = new Element('img', {
		'src': 'http://icons.iconarchive.com/icons/saki/snowish/16/Apps-system-software-update-icon.png',
		'styles': this.options.updateButtonStyles
	  });
	  updateLink.adopt(updateButton);
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
	  return new Element("div", {
		'id': contentId,
		'class': "HkContent",
		'styles': this.options.contentStyles
	  });
	},
	makeScrollable: function makeScrollable(id, options) {
	  this.setOptions(options);
	  if(!this.options.scroll || !this.options.autoScroll) {
		return;
	  }
	  window.hk.log('[HkShortcutsWindow][DEBUG]makeScrollable wird verarbeitet mit Scroll-Objekt:');
	  var scroll = $(this.options.scroll);
	  window.hk.log(scroll);
	  this.options.scroller = new Scroller(scroll);
	  this.options.scroller.start();
	},
	makeReduceable: function makeReduceable(id, options) {
	  this.setOptions(options);
	  if(!this.options.reduce) return;
	  var reduce = $(this.options.reduce);
	  var headerDivs = $(this.getId("HkWindow", id)).getElementsByTagName("div");
	  var reduceButton = false;
	  $each(headerDivs, function(hd) {
		hd = $(hd);
		if(hd.hasClass('HkReduce')) {
		  reduceButton = hd;
		}
	  });
	  if(reduceButton && reduce) {
		new Hk.HkReducer(reduceButton, reduce, {
		  onTargetVisible: window.hk.log,
		  onTargetHidden: window.hk.log
		});
	  }
	}
  });
  Hk.HkWindows.implement(new Events, new Options, new HkLogger);

  hk.Windows = new Hk.HkWindows();

  /**
   * Datenstruktur für Shortcuts @todo Auslagern
   */
  Hk.Shortcut = new Class({
	$debug: 0,
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

  hk.Storage.Shortcuts = new Hk.HkStorage(window.hk.idScript + "HkShortcuts" + window.hk.WorldId);

  /**
   * Shortcuts @todo Auslagern
   */
  Hk.HkShortcutsWindow = new Class({
	$debug: 0,
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
	gotoCurrentPosition: function gotoCurrentPosition() {
	  var shortcut = window.hk.Shortcuts.getCurrentData();
	  window.hk.gotoPosition(shortcut.x(), shortcut.y());
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
	  hk.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + Json.toString(shortcut.options));
	  var str = shortcut.name() + "   (" + shortcut.x() + ", " + shortcut.y() + ")";
	  hk.log('[HkShortcutsWindow][DEBUG]Shortcut: ' + str);
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
	  window.hk.log('[HkShortcutsWindow][DEBUG]Rufe Shortcut auf');
	  var entry = evt.target;
	  window.hk.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
	  while(entry.getTag() != "div") {
		entry = entry.getParent();
		window.hk.log('[HkShortcutsWindow][DEBUG]Shortcut-Eintrag: ' + entry);
	  }
	  var shortcutName =  entry.getProperty("name");
	  window.hk.log('[HkShortcutsWindow][DEBUG]Entferne Eintrag ' + shortcutName + '…');
	  var shortcut = window.hk.Storage.Shortcuts.drop(shortcutName);
	  window.hk.log('[HkShortcutsWindow][DEBUG]Entfernter Eintrag: ' + Json.toString(shortcut));
	  window.hk.Shortcuts.updateDimensions();
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
	  var gotoPosition = new Element("img", {
		'id': 'GotoPosition',
		'name': 'gotoPosition',
		'src': "http://icons.iconarchive.com/icons/itzikgur/my-seven/16/Favorities-icon.png",
		'styles': window.hk.Styles.Shortcuts.Form.gotoPosition
	  });
	  gotoPosition.preventTextSelection();
	  gotoPosition.addEventListener('click', this.gotoCurrentPosition);
	  var loadPosition = new Element("img", {
		'id': 'LoadPosition',
		'name': 'loadPosition',
		'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/update-icon.png",
		'styles': window.hk.Styles.Shortcuts.Form.load
	  });
	  loadPosition.preventTextSelection();
	  loadPosition.addEventListener('click', this.loadCurrentPosition);
	  var submitInput = new Element("img", {
		'id': "ShortcutSubmit",
		'name': "shortcutSubmit",
		'src': "http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/accept-icon.png",
		'styles': window.hk.Styles.Shortcuts.Form.submit
	  });
	  submitInput.preventTextSelection();
	  submitInput.addEventListener('click', this.createShortcut);
	  inputForm.adopt(inputX, inputY, gotoPosition, loadPosition, submitInput, inputName);
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
	  window.hk.log('[HkPublic][ERROR]Fehler beim Erzeugen des Shortcuts-Fensters: '+ex);
	}
	try {
	  window.hk.Shortcuts.updateShortcutList();
	} catch(ex) {
	  window.hk.log('[HkPublic][ERROR]Fehler beim Aktualisieren des Shortcuts-Fensters: '+ex);
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
	  window.hk.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Shortcuts-Fensters: '+ex);
	}
  };

};

/**
 * Prüft die Verfügbarkeit der HOMMK-Objekte... @todo Braucht's das überhaupt?
 */
function wait(){
  if(!!w.HOMMK && w.HOMMK.worldMap && w.HOMMK.worldMap.content && w.HOMMK.worldMap.content._size){
	clearInterval(loader);
	w.hkCreateClasses();
	w.initHkToolkit();
  }	else {
  }
}

/**
 * Browser-Hack: Skripte aus Metabereich für Google Chrome, siehe
 * http://www.chromium.org/developers/design-documents/user-scripts
 */
if(w.isGoogleChromeUA() && 'undefined' != typeof __HKU_PAGE_SCOPE_RUN__) {
  /**
   * Local Storage-Kompatibilität · http://developer.mozilla.org · http://pastebin.com/raw.php?i=zrfAFeBc
   */
  if (!window.localStorage) {
	Object.defineProperty(window, "localStorage", new (function () {
	  var aKeys = [], oStorage = {};
	  Object.defineProperty(oStorage, "getItem", {
		value: function (sKey) { return sKey ? this[sKey] : null; },
		writable: false,
		configurable: false,
		enumerable: false
	  });
	  Object.defineProperty(oStorage, "key", {
		value: function (nKeyId) { return aKeys[nKeyId]; },
		writable: false,
		configurable: false,
		enumerable: false
	  });
	  Object.defineProperty(oStorage, "setItem", {
		value: function (sKey, sValue) {
		  if(!sKey) { return; }
		  document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
		},
		writable: false,
		configurable: false,
		enumerable: false
	  });
	  Object.defineProperty(oStorage, "length", {
		get: function () { return aKeys.length; },
		configurable: false,
		enumerable: false
	  });
	  Object.defineProperty(oStorage, "removeItem", {
		value: function (sKey) {
		  if(!sKey) { return; }
		  var sExpDate = new Date();
		  sExpDate.setDate(sExpDate.getDate() - 1);
		  document.cookie = escape(sKey) + "=; expires=" + sExpDate.toGMTString() + "; path=/";
		},
		writable: false,
		configurable: false,
		enumerable: false
	  });
	  this.get = function () {
		var iThisIndx;
		for (var sKey in oStorage) {
		  iThisIndx = aKeys.indexOf(sKey);
		  if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
		  else { aKeys.splice(iThisIndx, 1); }
		  delete oStorage[sKey];
		}
		for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
		for (var iCouple, iKey, iCouplId = 0, aCouples = document.cookie.split(/\s*;\s*/); iCouplId < aCouples.length; iCouplId++) {
		  iCouple = aCouples[iCouplId].split(/\s*=\s*/);
		  if (iCouple.length > 1) {
			oStorage[iKey = unescape(iCouple[0])] = unescape(iCouple[1]);
			aKeys.push(iKey);
		  }
		}
		return oStorage;
	  };
	  this.configurable = false;
	  this.enumerable = true;
	})());
  }
  /*
  Script: Element.Selectors.js
	  Css Query related functions and <Element> extensions

  License:
	  MIT-style license.
  */

  /* Section: Utility Functions */

  /*
  Function: $E
	  Selects a single (i.e. the first found) Element based on the selector passed in and an optional filter element.
	  Returns as <Element>.

  Arguments:
	  selector - string; the css selector to match
	  filter - optional; a DOM element to limit the scope of the selector match; defaults to document.

  Example:
	  >$E('a', 'myElement') //find the first anchor tag inside the DOM element with id 'myElement'

  Returns:
	  a DOM element - the first element that matches the selector
  */

  function $E(selector, filter){
	  return ($(filter) || document).getElement(selector);
  }

  /*
  Function: $ES
	  Returns a collection of Elements that match the selector passed in limited to the scope of the optional filter.
	  See Also: <Element.getElements> for an alternate syntax.
	  Returns as <Elements>.

  Returns:
	  an array of dom elements that match the selector within the filter

  Arguments:
	  selector - string; css selector to match
	  filter - optional; a DOM element to limit the scope of the selector match; defaults to document.

  Examples:
	  >$ES("a") //gets all the anchor tags; synonymous with $$("a")
	  >$ES('a','myElement') //get all the anchor tags within $('myElement')
  */

  function $ES(selector, filter){
	  return ($(filter) || document).getElementsBySelector(selector);
  }

  $$.shared = {

	  'regexp': /^(\w*|\*)(?:#([\w-]+)|\.([\w-]+))?(?:\[(\w+)(?:([!*^$]?=)["']?([^"'\]]*)["']?)?])?$/,

	  'xpath': {

		  getParam: function(items, context, param, i){
			  var temp = [context.namespaceURI ? 'xhtml:' : '', param[1]];
			  if (param[2]) temp.push('[@id="', param[2], '"]');
			  if (param[3]) temp.push('[contains(concat(" ", @class, " "), " ', param[3], ' ")]');
			  if (param[4]){
				  if (param[5] && param[6]){
					  switch(param[5]){
						  case '*=': temp.push('[contains(@', param[4], ', "', param[6], '")]'); break;
						  case '^=': temp.push('[starts-with(@', param[4], ', "', param[6], '")]'); break;
						  case '$=': temp.push('[substring(@', param[4], ', string-length(@', param[4], ') - ', param[6].length, ' + 1) = "', param[6], '"]'); break;
						  case '=': temp.push('[@', param[4], '="', param[6], '"]'); break;
						  case '!=': temp.push('[@', param[4], '!="', param[6], '"]');
					  }
				  } else {
					  temp.push('[@', param[4], ']');
				  }
			  }
			  items.push(temp.join(''));
			  return items;
		  },

		  getItems: function(items, context, nocash){
			  var elements = [];
			  var xpath = document.evaluate('.//' + items.join('//'), context, $$.shared.resolver, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			  for (var i = 0, j = xpath.snapshotLength; i < j; i++) elements.push(xpath.snapshotItem(i));
			  return (nocash) ? elements : new Elements(elements.map($));
		  }

	  },

	  'normal': {

		  getParam: function(items, context, param, i){
			  if (i == 0){
				  if (param[2]){
					  var el = context.getElementById(param[2]);
					  if (!el || ((param[1] != '*') && (Element.getTag(el) != param[1]))) return false;
					  items = [el];
				  } else {
					  items = $A(context.getElementsByTagName(param[1]));
				  }
			  } else {
				  items = $$.shared.getElementsByTagName(items, param[1]);
				  if (param[2]) items = Elements.filterById(items, param[2], true);
			  }
			  if (param[3]) items = Elements.filterByClass(items, param[3], true);
			  if (param[4]) items = Elements.filterByAttribute(items, param[4], param[5], param[6], true);
			  return items;
		  },

		  getItems: function(items, context, nocash){
			  return (nocash) ? items : $$.unique(items);
		  }

	  },

	  resolver: function(prefix){
		  return (prefix == 'xhtml') ? 'http://www.w3.org/1999/xhtml' : false;
	  },

	  getElementsByTagName: function(context, tagName){
		  var found = [];
		  for (var i = 0, j = context.length; i < j; i++) found.extend(context[i].getElementsByTagName(tagName));
		  return found;
	  }

  };

  $$.shared.method = (window.xpath) ? 'xpath' : 'normal';

  /*
  Class: Element
	  Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
  */

  Element.Methods.Dom = {

	  /*
	  Property: getElements
		  Gets all the elements within an element that match the given (single) selector.
		  Returns as <Elements>.

	  Arguments:
		  selector - string; the css selector to match

	  Examples:
		  >$('myElement').getElements('a'); // get all anchors within myElement
		  >$('myElement').getElements('input[name=dialog]') //get all input tags with name 'dialog'
		  >$('myElement').getElements('input[name$=log]') //get all input tags with names ending with 'log'

	  Notes:
		  Supports these operators in attribute selectors:

		  - = : is equal to
		  - ^= : starts-with
		  - $= : ends-with
		  - != : is not equal to

		  Xpath is used automatically for compliant browsers.
	  */

	  getElements: function(selector, nocash){
		  var items = [];
		  selector = selector.trim().split(' ');
		  for (var i = 0, j = selector.length; i < j; i++){
			  var sel = selector[i];
			  var param = sel.match($$.shared.regexp);
			  if (!param) break;
			  param[1] = param[1] || '*';
			  var temp = $$.shared[$$.shared.method].getParam(items, this, param, i);
			  if (!temp) break;
			  items = temp;
		  }
		  return $$.shared[$$.shared.method].getItems(items, this, nocash);
	  },

	  /*
	  Property: getElement
		  Same as <Element.getElements>, but returns only the first. Alternate syntax for <$E>, where filter is the Element.
		  Returns as <Element>.

	  Arguments:
		  selector - string; css selector
	  */

	  getElement: function(selector){
		  return $(this.getElements(selector, true)[0] || false);
	  },

	  /*
	  Property: getElementsBySelector
		  Same as <Element.getElements>, but allows for comma separated selectors, as in css. Alternate syntax for <$$>, where filter is the Element.
		  Returns as <Elements>.

	  Arguments:
		  selector - string; css selector
	  */

	  getElementsBySelector: function(selector, nocash){
		  var elements = [];
		  selector = selector.split(',');
		  for (var i = 0, j = selector.length; i < j; i++) elements = elements.concat(this.getElements(selector[i], true));
		  return (nocash) ? elements : $$.unique(elements);
	  }

  };

  Element.extend({

	  /*
	  Property: getElementById
		  Targets an element with the specified id found inside the Element. Does not overwrite document.getElementById.

	  Arguments:
		  id - string; the id of the element to find.
	  */

	  getElementById: function(id){
		  var el = document.getElementById(id);
		  if (!el) return false;
		  for (var parent = el.parentNode; parent != this; parent = parent.parentNode){
			  if (!parent) return false;
		  }
		  return el;
	  }/*compatibility*/,

	  getElementsByClassName: function(className){
		  return this.getElements('.' + className);
	  }

	  /*end compatibility*/

  });

  document.extend(Element.Methods.Dom);
  Element.extend(Element.Methods.Dom);

  /*
  Script: Scroller.js
	  Contains the <Scroller>.

  License:
	  MIT-style license.
  */

  /*
  Class: Scroller
	  The Scroller is a class to scroll any element with an overflow (including the window) when the mouse cursor reaches certain buondaries of that element.
	  You must call its start method to start listening to mouse movements.

  Note:
	  The Scroller requires an XHTML doctype.

  Arguments:
	  element - required, the element to scroll.
	  options - optional, see options below, and <Fx.Base> options.

  Options:
	  area - integer, the necessary boundaries to make the element scroll.
	  velocity - integer, velocity ratio, the modifier for the window scrolling speed.

  Events:
	  onChange - optionally, when the mouse reaches some boundaries, you can choose to alter some other values, instead of the scrolling offsets.
		  Automatically passes as parameters x and y values.
  */

  var Scroller = new Class({

	  options: {
		  area: 20,
		  velocity: 1,
		  onChange: function(x, y){
			  this.element.scrollTo(x, y);
		  }
	  },

	  initialize: function(element, options){
		  this.setOptions(options);
		  this.element = $(element);
		  this.mousemover = ([window, document].contains(element)) ? $(document.body) : this.element;
	  },

	  /*
	  Property: start
		  The scroller starts listening to mouse movements.
	  */

	  start: function(){
		  this.coord = this.getCoords.bindWithEvent(this);
		  this.mousemover.addListener('mousemove', this.coord);
	  },

	  /*
	  Property: stop
		  The scroller stops listening to mouse movements.
	  */

	  stop: function(){
		  this.mousemover.removeListener('mousemove', this.coord);
		  this.timer = $clear(this.timer);
	  },

	  getCoords: function(event){
		  this.page = (this.element == window) ? event.client : event.page;
		  if (!this.timer) this.timer = this.scroll.periodical(50, this);
	  },

	  scroll: function(){
		  var el = this.element.getSize();
		  var pos = this.element.getPosition();

		  var change = {'x': 0, 'y': 0};
		  for (var z in this.page){
			  if (this.page[z] < (this.options.area + pos[z]) && el.scroll[z] != 0)
				  change[z] = (this.page[z] - this.options.area - pos[z]) * this.options.velocity;
			  else if (this.page[z] + this.options.area > (el.size[z] + pos[z]) && el.scroll[z] + el.size[z] != el.scrollSize[z])
				  change[z] = (this.page[z] - el.size[z] + this.options.area - pos[z]) * this.options.velocity;
		  }
		  if (change.y || change.x) this.fireEvent('onChange', [el.scroll.x + change.x, el.scroll.y + change.y]);
	  }

  });

  Scroller.implement(new Events, new Options);

  /**
   * Prototype Ergänzungen · http://pastebin.com/raw.php?i=NBX5T7pp
   */
  if (String.prototype.toCurrency == null) {
	String.prototype.toCurrency = function toCurrency() {
	  var n = this.toString();
	  var regex = /^(.*\s)?([\-+\u00A3\u20AC]?\d+)(\d{3}\b)/;
	  return n == (n = n.replace(regex, "$1$2,$3")) ? n : this.toCurrency(n); //english
	};
  }

  if (String.prototype.padLeft == null) {
	String.prototype.padLeft = function padLeft(size, chr) {
	  var input = this.toString();
	  while ( input.length < size ) {
		input = chr + input;
	  }
	  return input;
	};
  }

  if (Number.prototype.toK == null) {
	Number.prototype.toK = function toK() {
	  var n = Number(this.toString());
	  var i = Number(Math.abs(n));
	  if((i.toInt() / 1000000) >= 1) return n.toFixedString(1000000, 1, true) + "M";
	  if((i.toInt() / 1000) >= 1) return n.toFixedString(1000) + "K";
	  return n;
	};
  }

  if (Number.prototype.toFixedString == null) {
	Number.prototype.toFixedString = function toFixedString() {
	  var n = this.toString();
	  var div, digits, currency;
	  var a = Array.prototype.slice.call(arguments);
	  if(a.length > 2) div = a.shift();
	  else div = 1;
	  digits = a.shift();
	  currency = a.shift();
	  n = n / div;
	  var num = parseFloat((n || '0').toString().replace(',', '.').replace(/[^0-9e\.\-+]/g, '')) || 0;
	  var unsigned = Number(Math.abs(n)).toUnsignedString(digits);
	  if ( isNaN(unsigned) ) unsigned = 0;
	  unsigned = (num < 0 ? "-" : "") + unsigned;
	  if (currency == true ) return unsigned.toCurrency();
	  return Number(unsigned);
	};
  }

  if (Number.prototype.toFixedString == null) {
	Number.prototype.toUnsignedString = function toUnsignedString(digits) {
	  var n = this.toString();
	  var start, end, t;
	  var str = "" + Math.round(n * Math.pow(10, digits));
	  if (/\D/.test(str)) return "" + n;
	  str = str.padLeft(1 + digits, "0");
	  start = str.substring(0, t = (str.length - digits));
	  end = str.substring(t);
	  if (end) end = "." + end;
	  return start + end; // avoid "0."
	};
  }

  if (Node.prototype.preventTextSelection == null) {
	var applyToTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a", "img"];
	/**
	  * Verhindert die Textauswahl auf dem Element.
	  * @return das geänderte Element selbst
	  */
	Node.prototype.preventTextSelection = function(node) {
	  if($type(this) != "element") return this;
	  if(!applyToTags.contains(this.getTag())) return this;
	  var styles = {
		"-webkit-user-select": "none",
		"-khtml-user-select": "none",
		"-moz-user-select": "none",
		"-o-user-select": "none",
		"user-select": "none"
	  };
	  this.setStyles(styles);
	  return this;
	}
  }

}

/**
 * Alle 300ms die Verfügbarkeit prüfen.  @todo Braucht's das überhaupt?
 */
var loader = setInterval(wait,300);
