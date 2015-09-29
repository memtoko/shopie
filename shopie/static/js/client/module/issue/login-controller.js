/**
 * when user still not logins, display them a form
 */
var LoginController = function($scope) {
	'ngInject';
	$scope.loginForm = {
		'action': '/account/login/',
		'next': document.location.origin + document.location.pathname,
		'csrfToken': $('input[name=csrfmiddlewaretoken]').val()
	};	
};
