/**
 * CSS
 * 
 * @todo Core und Shortcuts trennen - Ergänzungen warten auf Core und "docken" sich an...
 */
window.HkStylesExtra = {
    'Generic': {
        'itemList': {
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
        'listItem': {
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
            'item': {
                'padding': '2px 0px',
                'borderTop': '1px solid #303030',
                'clear': 'both'
            }
        }
    },
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