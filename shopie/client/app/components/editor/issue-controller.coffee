issueController = ($scope, $showdown, $http, $sanitize) ->
	$scope.editor = {text: '', wordCount: 0}
	$scope.replies = []
	$scope.preloadData = window.preloadData or {}
