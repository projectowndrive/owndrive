ownDriveCtrl.controller('MainToolbarDirCtrl', ['$scope', '$window', '$state', 'toastr', '$rootScope', '$mdDialog', 'AuthServ', 'UserServ', 'owndriveconst', function ($scope, $window, $state, toastr, $rootScope,$mdDialog, Auth, User, owndriveconst) {

    $rootScope.activeUser = JSON.parse($window.localStorage.getItem('activeUser'));

    $scope.avatar = owndriveconst.APP_BACKEND + '/img/profile/' + $rootScope.activeUser.profile_pic;
    $rootScope.userName = $rootScope.activeUser.first_name + ' ' + $rootScope.activeUser.last_name;


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


    $scope.profileSettings = function(){
        function afterShowAnimation(scope, element, options) {
            // post-show code here: DOM element focus, etc.
        }


        $mdDialog.show({
            templateUrl: 'templates/components/profile-settings.html',
            controller: 'ProfileSettingsCtrl',
            onComplete: afterShowAnimation
        })
            .then(function (data) {

            })
        function afterShowAnimation() {

        }
    }


}]);