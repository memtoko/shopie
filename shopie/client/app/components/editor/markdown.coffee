markdown = ->
	commonMark = window.commonmark
	writer = new commonmark.HtmlRenderer({ sourcepos: true, smart: true, safe:true })
	reader = new commonmark.Parser(

	markdownObject = ->

		makeHtml = (text) ->
			writer.render(reader.parse(text))

		stripHtml (text) ->
			String(text).replace(/<[^>]+>/gm, '')

	$get = ->
		new markdownObject()

export default markdown;
