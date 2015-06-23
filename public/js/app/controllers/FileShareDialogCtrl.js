ownDriveCtrl.controller('FileShareDialogCtrl',['$scope', '$mdDialog', '$animate', 'item', 'StoreItemProcessServ',
    function ($scope, $mdDialog, $animate, item, StoreItemProcessServ) {
        $scope.newName = item.name;

        $scope.closeDialog = function () {
            $mdDialog.cancel({});
        }
        $scope.share = function () {
            StoreItemProcessServ.share().then(function (response) {
                $mdDialog.hide({});
            })
        }
    }
])