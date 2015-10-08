var commonMark = function() {
	var writer = commonmark.HtmlRenderer({ sourcepos: true, smart: true, safe:true });	
	var reader = commonmark.Parser();

	function commonMarkObject = function() {

		this.makeHtml = function(text) {
			return writer.render(reader.parse(text)); 
		};

		this.stripHtml = function(text) {
			return String(text).replace(/<[^>]+>/gm, '');
		};

	};

	this.$get = function() {
		return new commonMarkObject();
	};
};

export default commonMark;
