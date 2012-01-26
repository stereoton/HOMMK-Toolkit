/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
window.HkStylesExtra = {
    'Shortcuts': {
        'list': {
            'padding': '2px 0px',
            'margin': '0px',
            'clear': 'both',
            'float': 'none',
            'backgroundColor': '#0e0e0e',
            'height': 'auto',
            'width': 'auto'
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
        'zIndex': '$zIndex$',
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
        'borderBottomLeftRadius': '5px',
        'opacity': '$Opacity$'
    },
    'footer': {
        'clear': 'both',
        'float': 'none',
        'margin': '0px',
        'paddingTop': '3px 0px 0px 0px',
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
        'padding': '2px 0px',
        'overflow': 'hidden',
//        'height': '48px',
//        'width': '160px',
        'minHeight': '32px',
        'minWidth': '120px',
        'maxHeight': parseInt(window.getHeight()) / 2 + 'px',
        'maxWidth': parseInt(window.getWidth()) / 3 + 'px'
    },
    'header': {
        'zIndex': "" + ($zIndex$ + 1000) + "",
        'marginTop': '0px 0px 5px 0px',
        'padding': '1px 5px',
        'borderTopLeftRadius': '10px',
        'borderTopRightRadius': '10px',
        'backgroundColor': '#1a1a1a'
    },
    'title': {
        'fontSize': "0.8em",
        'padding': '0px 0px 2px 3px',
        'backgroundColor': 'transparent',
        'margin': '4px auto 2px',
        'width': 'auto'
    },
    'reduceButton': {
        'zIndex': '' + ($zIndex$ + 2000) + '',
        'cursor': 'pointer',
        'float': 'right',
        'width': '22px',
        'height': '18px',
        'backgroundPosition': '-110px',
        'backgroundRepeat': 'no-repeat',
        'backgroundImage': 'url("http://cgit.compiz.org/fusion/decorators/emerald/plain/defaults/theme/buttons.min.png")'
    },
    'updateLink': {
        'zIndex': '' + ($zIndex$ + 2000) + '',
        'verticalAlign': 'middle',
        'float': 'right',
        'paddingTop': '2px',
        'fontSize': '0px'
    },
    'updateButton': {
        'zIndex': '' + ($zIndex$ + 2000) + '',
        'border': ' none'
    },
    'resizeButton': {
        'zIndex': '' + ($zIndex$ + 2000) + '',
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