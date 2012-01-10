if ("undefined" == typeof(HkStylesGeneric)) {

  try {
	if(!$type(console)) {
	  var console = {
		log: function log(msg) {
		  // do nothing
		}
	  };
	}
  } catch(ex) {}

  var HkStylesGeneric = new Class({
	initialize: function() {

	},
	applyStyles: function applyStyles() {
	  $A(this.styles).each(function(style, idx) {
		var selection;
		if(style.selector.indexOf(".") != -1 || style.selector.indexOf('#') != -1) {
		  selection = $$(style.selector);
		} else {
		  selection = $(style.selector.substr(1));
		}
		if(selection) {
		  console.log("Wende Stile an:");
		  console.log(style.selector);
		  console.log(style.styles);
		  console.log(selection);
		  selection.setStyles(style.styles);
		}
	  });
	},
	'styles': [
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background-image': 'linear-gradient(to bottom, #1a1a1a, #040404 66%, #1a1a1a)'
		}
	  },
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background-image': 'linear-gradient(top, #1a1a1a, #040404 66%, #1a1a1a)'
		}
	  },
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background-image': '-webkit-linear-gradient(top, #1a1a1a, #040404 66%, #1a1a1a)'
		}
	  },
	  {
		'selector': '.GradientGreyDarkgreyGrey',
		'styles': {
		  'background-image': '-moz-linear-gradient(to bottom, #1a1a1a, #040404 66%, #1a1a1a)'
		}
	  },
	  {
		'selector': '.Radius5',
		'styles': {
		  'border-radius': '5px'
		}
	  },
	  {
		'selector': '.Radius5BottomLeft',
		'styles': {
		  'border-bottom-left-radius': '5px'
		}
	  },
	  {
		'selector': '.Radius10',
		'styles': {
		  'border-radius': '10px'
		}
	  },
	  {
		'selector': '.Radius10TopLeft',
		'styles': {
		  'border-top-left-radius': '5px'
		}
	  },
	  {
		'selector': '.Radius10TopRight',
		'styles': {
		  'border-top-right-radius': '5px'
		}
	  },
	  {
		'selector': '.HkButton',
		'styles': {
		  'border': 'none'
		}
	  }
	]
  });
}
