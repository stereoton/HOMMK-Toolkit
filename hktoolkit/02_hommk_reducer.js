/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
if(!window.hasOwnProperty("HkReducerCreateClasses")) {
	window.HkReducerCreateClasses = function() {
		if(!Hk.hasOwnProperty("HkReducer")) {
			Hk.HkReducer = new Class({
			    $debug: 1,
			    $status: null,
			    $default: "TargetVisible",
			    IS_REDUCED: "TargetReduced",
			    IS_VISIBLE: "TargetVisible",
			    options: {
				    'duration': 500
			    },
			    initialize: function(toggle, target, options) {
				    this.setOptions(options);
				    this.toggle = toggle;
				    this.target = target;
				    var slideOptions = this.options;
				    slideOptions.onChange = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Change Event");
					    window.console.log(evt);
					    this.fireEvent("onTargetChange", [
					        this.toggle, this.target]);
				    }.bind(this);
				    slideOptions.onTick = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Tick Event");
					    window.console.log(evt);
					    this.fireEvent("onTargetStep", [
					        this.toggle, this.target]);
				    }.bind(this);
				    slideOptions.onComplete = function(evt) {
					    window.console.log("[HkReducer][Event]Slider Complete Event");
					    window.console.log(evt);
					    this.$status = (this.$status == this.IS_REDUCED) ? this.IS_VISIBLE : this.IS_REDUCED;
					    this.fireEvent("on" + this.$status, [
					        this.toggle, this.target]);
					    this.updateDimensions(this.target);
					    this.fireEvent("onTargetComplete", [
					        this.toggle, this.target]);
				    }.bind(this);
				    this.toggle.slider = new Fx.Slide(this.target, slideOptions);
				    this.toggle.target = this.target;
				    this.toggle.reducer = this;
				    this.target.reducer = this;
				    this.toggle.addEvent('mousedown', this.togglePressed.bind(this));
				    this.toggle.addEvent('click', this.toggleClicked.bind(this));
				    // @todo letzten Zustand laden
				    if(this.$status == null) this.$status = this.$default;
				    window.console.log(this.toggle.slider);
				    this.updateDimensions(this.target);
			    },
			    togglePressed: function togglePressed(evt) {
				    var toggle = evt.target;
				    var target = toggle.target;
				    var slider = toggle.slider;
				    if(this.$status == this.IS_VISIBLE) {
					    window.console.log("[HkReducer][Event]Target height: " + target.style.height);
					    // var targetHeight = target.getCoordinates().height;
					    // target.style.height = targetHeight + "px";
					    // var resetTargetHeight = function(target) {
					    // if(parseInt(target.getStyle('height')) > 0) {
					    // target.setStyle('height', 'auto');
					    // }
					    // }
					    // resetTargetHeight.delay(500, this, target);
				    } else {
					    window.console.log("[HkReducer][Event]Target height: " + target.style.height);
				    }
			    },
			    toggleClicked: function toggleClicked(evt) {
				    var toggle = evt.target;
				    var target = toggle.target;
				    var slider = toggle.slider;
				    if(this.$status == this.IS_VISIBLE) {
					    slider.slideOut();
				    } else {
					    slider.slideIn();
				    }
			    },
			    updateDimensions: function updateDimensions(target) {
				    window.console.log("[HkReducer][DEBUG]Passe die Größen für " + target + " an\u2026");
				    var divs = target.getElementsByTagName("div");
				    $each(divs, function(aDiv) {
					    var divHeight = $(aDiv).getStyle('height');
					    var divId = aDiv.id || "N/A";
//					    window.console.log("[HkReducer][DEBUG]Passe die Höhe des Containers #" + divId + " an (" + divHeight  + ")\u2026");
					    if($chk(divHeight) && divHeight.toInt() <= 0 && divHeight != 'auto') {
//						    window.console.log("[HkReducer][DEBUG]Setze Höhe des Containers #" + divId + ": " + divHeight + " \u2192 auto\u2026");
						    aDiv.setStyle('height', 'auto');
//					    } else {
//						    window.console.log("[HkReducer][DEBUG]Lasse die Höhe des Containers #" + divId + " unverändert ("  + divHeight + ")\u2026");
					    }
				    });
				    var targetId = target.id || "N/A";
				    var targetHeight = $(target).getStyle('height');
//				    window.console.log("[HkReducer][DEBUG]Setze Höhe des Hauptelements #" + targetId + ": " + targetHeight  + " \u2192 auto\u2026");
//				    $$(target, target.getParent()).setStyle('height', 'auto');
				    target.setStyle('height', 'auto');
				    var tP = $(target).getParent();
				    if($defined(tP)) {
				    	var parentHeight = tP.getStyle('height');
				    	var realParentHeight = tP.getCoordinates().height + "px";
					    window.console.log("[HkReducer][DEBUG]Setze Höhe des Slide-Elements: " + parentHeight + " \u2192 " + realParentHeight + "\u2026");
					    tP.setStyle('height', realParentHeight);
				    }
			    }
			});
			Hk.HkReducer.implement(new Events, new Options);
		}
		var initHkReducer = function() {

		};
		return initHkReducer;
	};
	window.HkReducerDependentObjectsAvailable = function() {
		return !!(window.Hk && window.hk && window.Hk.HkStorage && window.hk.Storage);
	};
}