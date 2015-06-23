ownDriveCtrl.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$mdToast', '$window', 'AuthServ', 'toastr',
        function($scope, $rootScope, $state, $mdToast, $window, AuthServ, toastr) {

            $scope.cred = { remember: false}

            $scope.login = function(cred) {

                if ($scope.cred.username&&$scope.cred.password){

                    AuthServ.login(cred).then(function (response) {

                        //console.log(response);
                        if (response.loginStatus) {
                            toastr.success('Successfully Logged in', 'Success');
                            $state.go('app.explorer');
                        } else {
                            toastr.error('Log in unsuccessful', 'Error');
                        }
                    });

            }

            }

 }]);