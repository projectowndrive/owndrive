ownDriveCtrl.controller('UserChipsDirCtrl', ['$scope', '$animate', 'owndriveconst', 'UserServ',
    function ($scope, $animate, owndriveconst, UserServ) {

        $scope.selectedUsers = [];

        $scope.getUserList = function () {
            UserServ.getUserList().then(function (response) {
                $scope.users = response;

                angular.forEach($scope.users, function(user) {
                    user.lowercaseName = angular.lowercase(user.first_name + ' ' + user.last_name);
                    user.name = user.first_name + ' ' + user.last_name;
                    user.image = owndriveconst.APP_BACKEND + '/img/profile/' + user.profile_pic;
                })

                if($scope.addToSelectedUsers){
                    $scope.selectedUsers = $scope.addToSelectedUsers($scope.users);
                }
            })
        }

        $scope.getUserList();


        /**
         * Search for contacts.
         */

        $scope.userSearch = function(query) {
            if(query) {
                var arr = $scope.users.filter(function(user) {
                    return (user.lowercaseName.indexOf(query.toLowerCase()) != -1)||(user.email.indexOf(query.toLowerCase()) != -1);

                });
                return arr;
            }
            return [];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
                return ($scope.user.lowercaseName.indexOf(lowercaseQuery) != -1);
        }
    }
])