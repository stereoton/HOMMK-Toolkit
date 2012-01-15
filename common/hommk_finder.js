
if("undefined" == typeof HkFinder) {
	
	var HkFinder = new Class({
		/**
		 * @param {String}
		 *          path
		 * @param {Object}
		 *          defaultReturnValue
		 * @return {any[]}
		 */
		getRecursive: function getRecursive(path, defaultReturnValue) {
			/** @type Array */
			var cur = this;
			var ret = defaultReturnValue;
			var pathElems = path.split(".");
			if(!pathElems.every(function(val, idx, arr) {
				if(!cur.hasOwnProperty(val)) return false;
				cur = cur.val;
				if(idx + 1 >= arr.length) ret = cur;
				return true;
			}, null)) return defaultReturnValue;
			return ret;
		}
	});
}