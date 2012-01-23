/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
if(!window.hasOwnProperty("HkWindowsCreateClasses")) {
	window.HkWindowsCreateClasses = function() {
		var Hk = window.Hk;
		var hk = window.hk;
		if(hk.hasOwnProperty("Storage") && !hk.Storage.hasOwnProperty("HkWindows")) {
			hk.Storage.HkWindows = new Hk.HkStorage({
				'storageKey': 'HkWindowsInternal'
			});
		}
		if(!Hk.hasOwnProperty("HkAdapter")) {
			Hk.HkAdapter = new Class({
				initialize: function() {
					return this;
				},
				injectIntoAll: function injectIntoAll(id, name) {
					$(id).setStyle('display', none);
					var results = [];
					results.push(this.injectIntoHOMMKGold(id, name));
					if(!results.every(function(val, idx) { return !!(val);})) {;
						$(id).setStyle('display', "block");
					}
				},
				injectIntoHOMMKGold: function injectIntoHOMMKGold(id, name) {
					if("undefined" == typeof id) return false;
					if("undefined" == typeof name) name = id;
					window.console.log("[$Name$][DEBUG]Prüfe HOMMK Gold.");
					var hkgT = $E('div.ui-widget', $("MainContainer"));
					//"z-index: 101000; position: absolute; top: -1px; width: 100%; right: -1px; border: 0px none; left: -5px; overflow: visible; height: 17px; max-height: 17px;">
					var hgST = {
							zIndex: 101000,
							position: "absolute",
							width: "100%",
							maxHeight: '17px'
					};
					if(hkgT.getStyles('zIndex', 'position', 'width', 'maxHeight') != hgST) return false;
					window.console.log("[$Name$][DEBUG]HOMMK Gold vorhanden.");
					window.console.log("[$Name$][DEBUG]Rufe HOMMK Gold-Menu ab.");
					var hgTR = hkgT.getElement("table tr");
					var hgTD = hkgT.getLast();
					var hgML = hkTD.getFirst();
					/** @type Node */
					window.console.log("[$Name$][DEBUG]Lege Eintrag für " + name + " im Menü an (ID: " + id + ")");
					var hgAC = new Element("td");
					var hgAL = new Element("a");
					window.console.log("[$Name$][DEBUG]Übertrage Stile.");
					hgAC.setAttribute('style', hgTD.getAttribute(style));
					window.console.log("[$Name$][DEBUG]Übertrage Attribute.");
					hgAL.setProperties({
						"class": hgML.getAttribute("class"),
						"style": hgML.getAttribute("style"),
						"href": hgML.getAttribute("href"),
						"target": hgML.getAttribute("target")
					});
					hgAL.setText(name);
					window.console.log("[$Name$][DEBUG]Registriere Event-Handler.");
					hgAL.onclick = function(evt) {
						window.console.log("[$Name$][DEBUG]HOMMK GOLD Adapter Link geklickt...");
						evt.preventDefault();
						var oS = $(id).getStyle('display');
						var nS = oS == "none" ? "block" : "none"; 
						window.console.log("[$Name$][DEBUG]Setze display-Wert von " + name + " auf " + nS);
						$(id).setStyle('display', nS);
					};
					hgAL.injectInside(hgAC);						
					window.console.log("[$Name$][DEBUG]Registriere Adapter im HOMMK GOLD Menü...");
					hgAC.injectInside(hgTR);
					/* <a class="toolbar_button ui-button ui-button-text-only 
					 * ui-widget ui-state-default " style="display: block; text-align: 
					 * center; width: 120px;" target="_blank" href="#"><img 
					 * src="http://img834.imageshack.us/img834/9264/infotj.png">
					 * info-panel</a> */
					return true;
				}
			});
		}
		if(!Hk.hasOwnProperty("HkWindows")) {
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
			            'windowStyles': window.HkStylesExtra.window,
			            'footerStyles': window.HkStylesExtra.footer,
			            'donateStyles': window.HkStylesExtra.donate,
			            'scrollAreaStyles': window.HkStylesExtra.scrollArea,
			            'scrollButtonStyles': window.HkStylesExtra.scrollButton,
			            'resizeButtonStyles': window.HkStylesExtra.resizeButton,
			            'headerStyles': window.HkStylesExtra.header,
			            'titleStyles': window.HkStylesExtra.title,
			            'reduceButtonStyles': window.HkStylesExtra.reduceButton,
			            'closeButtonStyles': window.HkStylesExtra.closeButton,
			            'updateButtonStyles': window.HkStylesExtra.updateButton,
			            'updateLinkStyles': window.HkStylesExtra.updateLink,
			            'contentStyles': window.HkStylesExtra.content,
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
				        var wid = this.getWindowId(id, options);
				        $(wid).autoScroller = new Scroller(scroll);
				        return $(wid).autoScroller;
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
					                var reduceable = this.hkResize || evt.getParent();
					                reduceable.setStyles({
					                	'maxHeight': (parseInt(window.getHeight())) / 2 + "px" 
				                	});
				                },
				                onDrag: function(evt) {
					                window.console.log('[HkWindow][Event]Resize Event an ' + this.options.hkWindowId);
				                },
				                onComplete: function(evt) {
					                window.console.log('[HkWindow][Event]Resize Complete Event an ' + this.options.hkWindowId);
					                if(this.options.hkWindow.options.reduceable) {
						                window.console.log('[HkWindow][DEBUG]Löse Höhenfestlegung durch Reduceable für ' + this.options.hkWindowId);
						                var reduceable = evt.getParent();
						                // window.console.log('[HkWindow][DEBUG]Reduceable-Stile: ' +
						                // JSON.toString(evt.getStyles()));
						                if(reduceable.getStyle('overflow') == 'hidden' && reduceable.getStyle('height') != 'auto') {
							                reduceable.setStyles({
							                	'height': 'auto',
							                	'maxHeight': (parseInt(window.getHeight())) / 2 + "px" 
						                	});
						                }
					                }
					                if(!this.options.hkWindow.saveWindowSize(this.options.hkWindowId,
					                    this.options.hkWindow.options)) {
						                window.console.log('[HkWindow][WARN]Resize Event Handler saveWindowSize fehlgeschlagen für ' + this.options.hkWindowId);
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
			window.Hk.HkWindows.implement(new Events, new Options);
		}
		var initHkWindows = function() {
			if(!window.hk.hasOwnProperty("Windows")) {
				window.hk.Windows = new window.Hk.HkWindows();
			}
		};
		return initHkWindows;
	};
	window.HkWindowsDependentObjectsAvailable = function() {
		return !!(window.Hk && window.hk && window.Hk.HkReducer);
	};
}
