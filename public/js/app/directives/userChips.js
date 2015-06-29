'use strict'
ownDriveDir.directive('userChips', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/user-chips.html',
		controller: 'UserChipsDirCtrl'
	}
});

