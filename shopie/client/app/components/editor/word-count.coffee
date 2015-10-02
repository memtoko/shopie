wordCount = ($commonMark) ->
	restrict: 'A'
	link: getWordCount($commonMark)
	scope:
		model: '=wordCount'
	template: '<span class="js-word-count" ng-bind-html="editorWordCount"></span> kata'
	
getWordCount = ($commonMark) ->
	(scope, element, attrs) ->
		scope.$watch('model', (updateValue) ->
			if typeof updateValue == 'String' and updateValue != ''
				rendered = $commonMark.makeHtml(updatedValue)
				scope.editorWordCount = computeWordCount(rendered)
			else
				scope.editorWordCount = 0
		)

computeWordCount = (s) ->
	s = s.replace(/<(.|\n)*?>/g, ' ')

wordCount.$inject = ['$commonMark']

export default wordCount;
