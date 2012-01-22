/**
 * @author Gelgamek <gelgamek@arcor.de>
 * @copyright Gelgamek et al., Artistic License 2.0, http://www.opensource.org/licenses/Artistic-2.0
 */
if(String.prototype.toCurrency == null) {
	String.prototype.toCurrency = function toCurrency() {
		var n = this.toString();
		var regex = /^(.*\s)?([\-+\u00A3\u20AC]?\d+)(\d{3}\b)/;
		return n == (n = n.replace(regex, "$1$2,$3")) ? n : this.toCurrency(n); // english
	};
}

if("undefined" == typeof stringPadLeft) {
	var stringPadLeft = function(str, size, chr) {
		while(str.length < size) {
			str = String(chr) + String(str);
		}
		return str;
	}
}

if("undefined" == typeof stringPadRight) {
	var stringPadRight = function(str, size, chr) {
		while(str.length < size) {
			str = String(str) + String(chr);
		}
		return str;
	}
}

if(String.prototype.padLeft == null || String.padLeft == null) {
	String.prototype.padLeft = function (size, chr) {
		return stringPadLeft(this.toString, size, chr);
	};
}

if(String.prototype.padRight == null || String.padRight == null) {
	String.prototype.padRight = function (size, chr) {
		return stringPadRight(this.toString(), size, chr);
	};
}

if(Number.prototype.toK == null) {
	Number.prototype.toK = function toK() {
		var n = Number(this.toString());
		var i = Number(Math.abs(n));
		if((i.toInt() / 1000000) >= 1) return n.toFixedString(1000000, 1, true) + "M";
		if((i.toInt() / 1000) >= 1) return n.toFixedString(1000) + "K";
		return n;
	};
}

if(Number.prototype.toFixedString == null) {
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
		if(isNaN(unsigned)) unsigned = 0;
		unsigned = (num < 0 ? "-" : "") + unsigned;
		if(currency == true) return unsigned.toCurrency();
		return Number(unsigned);
	};
}

if(Number.prototype.toFixedString == null) {
	Number.prototype.toUnsignedString = function toUnsignedString(digits) {
		var n = this.toString();
		var start, end, t;
		var str = "" + Math.round(n * Math.pow(10, digits));
		if(/\D/.test(str)) return "" + n;
		str = str.padLeft(1 + digits, "0");
		start = str.substring(0, t = (str.length - digits));
		end = str.substring(t);
		if(end) end = "." + end;
		return start + end; // avoid "0."
	};
}

if(Node.prototype.preventTextSelection == null) {
	var applyToTags = [
	    "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a", "img"];
	/**
	 * Verhindert die Textauswahl auf dem Element.
	 * 
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
	};
}