ownDriveCtrl.controller('StoreItemDirCtrl', ['$scope', 'StoreItemProcessServ',
    function($scope, StoreItemProcessServ) {




        if ($scope.itemType === 'folder') {
            $scope.folder = true;
        } else if ($scope.itemType === 'file') {
            $scope.file = true;
            $scope.itemIcon = StoreItemProcessServ.getIetmIcon($scope.mimeType);
        }

//ion-android-list
    }
])