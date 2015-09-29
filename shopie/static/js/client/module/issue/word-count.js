var wordCount = function($commonMark) {
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

function computeWordCount(s) {
    s = s.replace(/<(.|\n)*?>/g, ' '); // strip tags
    s = s.replace(/(^\s*)|(\s*$)/gi, ''); // exclude starting and ending white-space
    s = s.replace(/\n /gi, ' '); // convert newlines to spaces
    s = s.replace(/\n+/gi, ' ');
    s = s.replace(/[ ]{2,}/gi, ' '); // convert 2 or more spaces to 1

    return s.split(' ').length;
}

function getWordCount($commonMark) {
	return function (scope, element, attrs) {
		scope.$watch('model', function(updatedValue) {
			var rendered;
	    	if (typeof updatedValue === 'string' && updatedValue !== '') {
	      		rendered = $commonMark.makeHtml(updatedValue);
	      		scope.editorWordCount = computeWordCount(rendered);
	    	} else {
	      		scope.editorWordCount = 0;
	    	}
		});
	};
}

export default wordCount;
