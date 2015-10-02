getLinkFn = ($commonMark, $sanitize, $sce) ->
	(scope, element, attr) ->
		scope.$watch('model', (newValue) ->
			if typeof newValue == 'String'
				rendered = $commonMark.makeHtml(newValue)
				scope.trustedHtml = $sanitize(rendered)
			else
				scope.trustedHtml = ''
		)

markdownToHtml = ($commonMark, $sanitize, $sce) ->
	restrict: 'A'
	link: getLinkFn($commonMark, $sanitize, $sce)
	scope:
		model: '=markdownToHtml'
	template: '<div class="js-markdown-to-html" ng-bind-html="trustedHtml"></div>'
	
markdownToHtml.$inject = ['$commonMark', '$sanitize', '$sce']

export default markdownToHtml;
