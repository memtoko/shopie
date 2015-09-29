var markdownToHtml = function($commonMark, $sanitize, $sce) {
	'ngInject';
	return {
		restrict: 'A',
		link: getLinkFn($commonMark, $sanitize, $sce),
		scope: {
			model: '=markdownToHtml'
		},
		template: '<div class="js-markdown-to-html" ng-bind-html="trustedHtml"></div>'
	};
};

function getLinkFn($commonMark, $sanitize, $sce) {
	return function(scope, element, attr) {
		scope.$watch('model', function(newValue) {
			var rendered;
			if (typeof newValue === 'string') {
				rendered = $commonMark.makeHtml(newValue);
				scope.trustedHtml = $sanitize(rendered);
			} else {
				scope.trustedHtml = typeof newValue;
			}
		})
	};
}

export default markdownToHtml;
