/** common mark */

var commonMark = function() {
	var commonmark = window.commonmark,
	var writer = new commonmark.HtmlRenderer({ sourcepos: true, smart: true, safe:true });
	var reader = new commonmark.Parser();

	function commonMarkObject() {
		this.makeHtml = function(text) {
			parsed = reader.parse(text);
			return writer.render(parsed);
		};

		this.stripHtml = function(text) {
			return String(text).replace(/<[^>]+>/gm, '');
		};
	}

	this.$get = function() {
		return new commonMarkObject();
	};	
};

export default commonMark;
