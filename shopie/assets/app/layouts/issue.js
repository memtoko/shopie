let issue = angular.module('shopie.issue', ['shopie.markdown', 'ngAnimate', 'ngRoute']);

let issueListController = function($scope, $commonMark, $http, $sanitize) {
	let preloadData = window.preloadData || {};
	$scope.preloadData = preloadData;
	$scope.notAuthenticated = $scope.preloadData.user_authenticated ? 0: 1;	
};
