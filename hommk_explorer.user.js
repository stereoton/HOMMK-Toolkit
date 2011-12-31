// ==UserScript==
// @name          HkExplorer
// @version       2011.12.31.17.52.060000
// @description   Explorer für HkToolkit
// @author        Gelgamek <gelgamek@arcor.de>
// @copyright	  Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
// @icon          http://icons.iconarchive.com/icons/webiconset/mobile/32/maps-icon.png
// @namespace     http://mightandmagicheroeskingdoms.ubi.com/play
// @match         http://mightandmagicheroeskingdoms.ubi.com/play*
//
// Content Scope Runner:
// @require http://pastebin.com/raw.php?i=LasRLxsF
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

var w = window || unsafeWindow;
if(!w.hasOwnProperty("isGoogleChromeUA")) {
  w.isGoogleChromeUA = function() {
	return navigator.vendor.toLowerCase().indexOf('google') > -1;
  }
}

/**
 * Page Scrope Runner für Google Chrome wegen fehlendem @require-Support, siehe
 * http://www.chromium.org/developers/design-documents/user-scripts
 */
if(w.isGoogleChromeUA() && !$type(__HKEXP_PAGE_SCOPE_RUN__)) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __HKEXP_PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 0);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}


window.hkCreateExplorer = function() {

  if(window.HkExplorerLoader.loaded) return;

  var Hk = window.Hk;
  var hk = window.hk;

  window.HOMMK_HkExplorer = window.HOMMK_HkExplorer || {
	'version': hk.version
  };

  var HOMMK = hk.HOMMK;
  var idScript = hk.idScript;
  var version = hk.version;

  hk.log('[PUBLIC][DEBUG]Starte HkExplorer\u2026');

//  hk.Storage.Explorer = new window.Hk.HkStorage(window.hk.idScript + "HkExplorer" + window.hk.WorldId);

  Hk.HkExplorer = new Class({
	$debug: 1,
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
	  this.log('[HkExplorer][DEBUG]Initialisiere\u2026');
	  window.hk.log('[HkExplorer][DEBUG]Initialisiere\u2026');
	  try {
  //	  Wir brauchen hier keine Updates bei Änderungen im Speicher - sonst würden wir das ergänzen:
  //	  window.hk.Storage.Explorer.addEvent("onStorageUpdate", this.updateExplorer);
		this.$hkWin = window.hk.Windows.createWindow("HkExplorer", {
		  'title': "HkExplorer",
		  "updateable": false
		});
		this.log('[HkExplorer][DEBUG]Erzeuge Content\u2026');
		window.hk.log('[HkExplorer][DEBUG]Erzeuge Content\u2026');
		this.createContent();
	  }	catch (ex) {
		this.log('[HkExplorer][DEBUG]Fehler bei der Initialisierung: ' + ex);
		window.hk.log('[HkExplorer][DEBUG]Fehler bei der Initialisierung: ' + ex);
	  }
	},
	createContent: function createContent() {
	  var contentNode = this.$hkWin.getElement(".HkContent");
	  contentNode.setStyle('paddingTop', '0px');
	  this.log(window.HOMMK.worldMap);
	  window.hk.log(window.HOMMK.worldMap);
	  this.log(window.HOMMK.player);
	  window.hk.log(window.HOMMK.player);
	  this.log(window.HOMMK);
	  window.hk.log(window.HOMMK);
	},
	updateExplorer: function updateExplorer() {

	},
	updateDimensions: function updateDimensions() {

	}
  });
  Hk.HkExplorer.implement(new Events, new Options, new window.HkLogger);
//  window.hk.hkExplorer = new window.Hk.HkExplorer();

  /**
   * Erzeugt Explorer-Fenster
   */
  var initHkExplorer = function () {
	try {
	  window.hk.log('[HkPublic][DEBUG]Erzeuge Explorer-Fenster');
	  window.hk.Explorer = window.hk.hkExplorer || new window.Hk.HkExplorer();
	} catch(ex) {
	  window.hk.log('[HkPublic][ERROR]Fehler beim Erzeugen des Explorer-Fensters: '+ex);
	}
	try {
	  window.hk.Explorer.updateExplorer();
	} catch(ex) {
	  window.hk.log('[HkPublic][ERROR]Fehler beim Aktualisieren des Explorer-Fensters: '+ex);
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
	  window.hk.Explorer.log('[HkPublic][ERROR]Fehler bei der Finalisierung des Explorer-Fensters: '+ex);
	}
  };
  try {
	if(!window.HkExplorerLoader.loaded) initHkExplorer();
  } catch(ex) {
	console.log('[HkPublic][ERROR]Fehler bei der HkExplorer-Initialisierung: ' + ex);
  }
}

try {
  if(!$type(console)) {
	var console = {
	  log: function log(msg) {
		// do nothing
	  }
	};
  }
} catch(ex) {}


/**
 * Prüft die Verfügbarkeit der HOMMK-Objekte und des HkToolkits…
 */
window.HkExplorerLoader = {
  hkToolkitAvailable: false,
  load: function load() {
	console.log('[HkPublic][DEBUG]waitHkExplorer\u2026');
	window.HkExplorerLoader.hkToolkitAvailable = !!(window.initHkToolkit && window.HOMMK_HkToolkit && w.hk && window.hkCreateExplorer);
	if(window.HkExplorerLoader.hkToolkitAvailable) {
	  console.log('[HkPublic][DEBUG]Toolkit verfügbar, bereite HkExplorer vor\u2026');
	  window.hk.log('[HkPublic][DEBUG]Toolkit verfügbar, bereite HkExplorer vor\u2026');
	  try {
		window.HkExplorerLoader.load = $clear(window.HkExplorerLoader.load);
		window.hkCreateExplorer();
		window.HkExplorerLoader.loaded = true;
	  } catch(ex) {
		window.hk.log('[HkPublic][ERROR]Fehler beim Erzeugen der Klassen für HkExplorer: ' + ex);
	  }
	} else {
	  console.log('[HkPublic][DEBUG]HkExplorer wartet auf die Verfügbarkeit des Toolkits.');
	}
  }
}


/**
 * Alle 1000ms die Verfügbarkeit prüfen.
 */
window.HkExplorerLoader.load.periodical(1000);
