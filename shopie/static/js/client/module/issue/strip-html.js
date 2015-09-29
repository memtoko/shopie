var stripHtml = function($commonMark) {
	'ngInject';
	return function (text) {
        return $commonMark.stripHtml(text);
    };
};

export default stripHtml;
