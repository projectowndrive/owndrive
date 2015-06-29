ownDriveCtrl.controller('FileShareDialogCtrl', ['$scope', '$mdDialog', '$animate', 'item', 'StoreItemProcessServ',
    function ($scope, $mdDialog, $animate, item, StoreItemProcessServ) {


        $scope.share = function () {
            var selectedUserIds = [];

            angular.forEach($scope.selectedUsers, function (selectedUser) {
                selectedUserIds.push(selectedUser.id);
            })

            var unsharedUserIds = $scope.unsharedUserIds();
            StoreItemProcessServ.shareFile(item.id, selectedUserIds, unsharedUserIds).then(function () {
                $mdDialog.hide();
            })
        }


        $scope.unsharedUserIds = function () {
            var unshareUserIds = [];
            var selectedUserIds = [];

            angular.forEach($scope.selectedUsers, function (selecteduser) {
                selectedUserIds.push(selecteduser.id);
            })

            if (item.shared_with) {
                angular.forEach(item.shared_with, function (id) {
                    if (selectedUserIds.indexOf(id) === -1) {
                        unshareUserIds.push(id);
                    }
                })
            }

            return unshareUserIds;
        }


        $scope.addToSelectedUsers = function (users) {
            var selectedUsers = [];

            angular.forEach(users, function (user) {
                if (item.shared_with && item.shared_with.indexOf(user.id) > -1) {
                    selectedUsers.push(user);
                }
            })

            return selectedUsers;
        }


        $scope.closeDialog = function () {
            $mdDialog.cancel();
        }
    }
])