/**
 * Created by Wave Studios on 06/09/15.
 */
ownDriveCtrl.controller('UploadDialogCtrl', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog){

    $scope.fullWindow = true;
    $scope.restoreIcon = 'ion-android-remove';

    $scope.uploader = $rootScope.uploader;
    $scope.uploadQueue = $rootScope.uploader.queue;


    console.log($scope.uploadQueue);

/*    $scope.cancelItem = function(item){
        angular.forEach($rootScope.uploader.queue, function (queueItem) {
            if(queueItem === item){
                queueItem.cancel();
            }
        })
    }*/

    $scope.uploadItem = function(item){
        $rootScope.uploader.uploadItem (item);
    }

    $scope.cancelItem = function(item){
        $rootScope.uploader.cancelItem (item);
    }

    $scope.removeFromQueue = function(item){
        $rootScope.uploader.removeFromQueue (item);
    }

    $scope.restore = function() {
        $scope.fullWindow = !$scope.fullWindow;

        if($scope.restoreIcon === 'ion-android-remove'){
            $scope.restoreIcon = 'ion-android-checkbox-outline-blank';
        } else {
            $scope.restoreIcon = 'ion-android-remove';
        }
    }

}])