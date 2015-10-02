stripHtml = ($commonMark) ->
	(text) ->
		$commonMark.stripHtml(text)

stripHtml.$inject = ['$commonMark']

export default stripHtml;
