ownDriveCtrl.controller('MainToolbarDirCtrl', ['$scope', '$window', '$state', 'toastr', '$rootScope', 'AuthServ', 'UserServ', 'owndriveconst', function ($scope, $window, $state, toastr, $rootScope, Auth, User, owndriveconst) {
	

	$scope.logout = function() {
    	Auth.logout().then(function(data){
            console.log(data);
            if (!data.loginStatus){
                toastr.success('Successfully Logged out.', 'success');
                $state.go('login');
            }
            else{
                toastr.error('Log out unsuccessful', 'Error');
            }
        });
    };

    $rootScope.activeUser = JSON.parse($window.localStorage.getItem('activeUser'));

    $scope.avatar = owndriveconst.APP_BACKEND + '/img/profile/' + $rootScope.activeUser.profile_pic;
    $scope.userName = $rootScope.activeUser.first_name + $rootScope.activeUser.last_name


	/*User.getAvatar().then(function (data) {
		$scope.avatar = data;


    *//*$scope.getMatches = function(searchText) {
        return {
          display: ''
        };

        $scope.searchText  = '';
    };    *//*

	});*/

	


}]);