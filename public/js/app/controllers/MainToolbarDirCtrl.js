ownDriveCtrl.controller('MainToolbarDirCtrl', ['$scope', '$state', 'toastr', '$rootScope', 'AuthServ', 'UserServ', function ($scope, $state, toastr, $rootScope, Auth, User) {
	

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


	User.getAvatar().then(function (data) {
		$scope.avatar = data;


    /*$scope.getMatches = function(searchText) {
        return {
          display: ''
        };

        $scope.searchText  = '';
    };    */

	});

	


}]);