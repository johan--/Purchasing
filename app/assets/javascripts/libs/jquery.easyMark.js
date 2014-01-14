// I removed all of the unicode mapping to save space (this feature was not needed)


/*

 jQuery easymark plugin

 Highlights multiple keywords in a given search area.

 Copyright 2011 Isaac Tewolde for Thoora.com

 Based on work by Johann Burkhard & Marcel Stor

 Marcel Stor
 <http://www.frightanic.com/projects/lenient-jquery-highlight-plugin-javascript/>

 Johann Burkhard
 <http://johannburkard.de/blog/programming/javascript/dynacloud-a-dynamic-javascript-tag-keyword-cloud-with-jquery.html>

 MIT license.

 */

/*
 * Highlights the given terms in all text nodes.
 */

(function($) {

	var settings = {
		'highlightClass' : 'highlight',
		'partial' : true,
		'lenient' : false,
	};

	var methods = {
		init : function(options) {
			if(options) {
				$.extend(settings, options);
			}
		},
		//Highlights all the words that appear on the searchString
		highlight : function(searchString) {
			var input = searchString;

			//Partial matches are allowed
			if(settings.partial) {
				var inputPattern = new RegExp(input.split(' ').join('|'), 'ig');
			} else {
				var inputPattern = new RegExp('\\b' + input.split(' ').join('|\\b'), 'ig');
			}
			return this.each(function() {
				//alert(this);
				setHighlight(this, inputPattern);
			});
		},
		//Removes all highlights
		removeHighlight : function() {
			return this.find("span." + settings.highlightClass).each(function() {
				this.parentNode.firstChild.nodeName
				with(this.parentNode) {
					replaceChild(this.firstChild, this);
					normalize();
				}
			}).end();
		},
	};

	$.fn.easymark = function(method) {
		// Method calling logic
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if( typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.easyMark');
		}
	};
	/*******************************
	 * Private methods
	 *******************************/
	function log(message) {
		if(window.console && window.console.log)
			window.console.log(message);
	};

	function setHighlight(node, pattern) {
		var skip = 0;
		// Do this only for text nodes. Else go find child nodes...
		if(node.nodeType == 3) {
			var changed = 0;
			var replacement = node.data.replace(pattern, function(match) {
				changed = 1;
				return "<span class='highlight'>" + match + "</span>";
			});
			if(changed) {
				$(node).replaceWith(replacement);
				skip = 1;
			}
		} else {
			if(node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				//Check if it has not been highlighted already
				if(!(/(span)/i.test(node.tagName) && ($(node).hasClass(settings.highlightClass)))) {
					for(var i = 0; i < node.childNodes.length; ++i) {
						i += setHighlight(node.childNodes[i], pattern);
					}
				}
			}
		}
		return skip;
	}
})(jQuery);
