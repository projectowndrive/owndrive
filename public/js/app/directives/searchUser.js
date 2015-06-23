'use strict'
ownDriveDir.directive('searchUser', function () {
	return {
		restrict: '',
		templateUrl: '/templates/directives/search.html',
		controller: 'UserSearchDirCtrl'
	}
});

