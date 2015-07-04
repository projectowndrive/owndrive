ownDriveCtrl.controller('RegisterCtrl', ['$scope', '$rootScope', '$state', '$mdToast', '$window', 'AuthServ', 'toastr',
    function ($scope, $rootScope, $state, $mdToast, $window, AuthServ, toastr) {

        $scope.formData = {};

        $scope.registerUser = function (formData) {

            if ($scope.agreeTos) {
                $scope.registerData = angular.copy(formData);
                if ($scope.registerData) {
                    AuthServ.registerUser(formData).then(function (response) {
                        console.log(response)
                        if (response.status == "success") {
                            $state.go("login");
                        }
                    })
                }
            } else {
                toastr.warning('You have not accepted Terms od Service', 'Warning')
            }
        }

        $scope.reset = function () {
            $scope.formData = {};
        };


    }]);