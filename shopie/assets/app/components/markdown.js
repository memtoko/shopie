import wordCount from '../utils/word-count';
import commonMark from '../services/common-mark';

function markdownHtmlLink($commonMark, $sanitize, $sce) {
	return function (scope, element, attrs) {
	  scope.$watch('model', function (newValue) {
	    if (typeof newValue === 'string') {
	      let html = $commonMark.makeHtml(newValue);
	      scope.trustedHtml = $sanitize(html);
	    } else {
	      scope.trustedHtml = '';
	    }
	  });
	};
}

let markdownHtml = function($commonMark, $sanitize, $sce) {
	'ngInject';
	return {
		restrict: 'A',
		link: markdownHtmlLink($commonMark, $sanitize, $sce),
   		scope: {
      		model: '=markdownToHtml'
    	},
    	template: '<div class="js-markdown-to-html" ng-bind-html="trustedHtml"></div>'
	}	
};

let stripHtml = function($commonMark) {
	'ngInject';
	return function (text) {
        return $commonMark.stripHtml(text);
    };
};

let wordCountDirective = function($commonMark) {
	'ngInject';
	return {
    	restrict: 'A',
    	link: getWordCount($commonMark),
   		scope: {
      		model: '=wordCount'
    	},
    	template: '<span class="js-word-count" ng-bind-html="editorWordCount"></span> kata'
  	};
};

function getWordCount($commonMark) {
	return function (scope, element, attrs) {
		scope.$watch('model', function(updatedValue) {
			let html;
	    	if (typeof updatedValue === 'string' && updatedValue !== '') {
	      		html = $commonMark.makeHtml(updatedValue);
	      		scope.editorWordCount = wordCount(html);
	    	} else {
	      		scope.editorWordCount = 0;
	    	}
		});
	};
}

let markdown = angular.module('shopie.markdown', ['ngSanitize']);
markdown
	.provider('$commonMark', commonMark)
	.directive('markdownToHtml', markdownHtml)
	.directive('wordCount', wordCountDirective)
	.filter('stripHtml', stripHtml);

export default markdown;
