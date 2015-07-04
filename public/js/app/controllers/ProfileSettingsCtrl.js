/**
 * Created by Wave Studios on 06/30/15.
 */

ownDriveCtrl.controller('ProfileSettingsCtrl', ['$scope', '$window', '$mdDialog', '$rootScope', 'FileUploader', 'owndriveconst', 'UserServ', function ($scope, $window, $mdDialog, $rootScope, FileUploader, owndriveconst, User) {
    $scope.user = $rootScope.activeUser;

    $scope.avatar = owndriveconst.APP_BACKEND + '/img/profile/' + $scope.user.profile_pic;
    $scope.userEmail = $rootScope.activeUser.email;
    $scope.userName = $rootScope.activeUser.first_name + ' ' + $rootScope.activeUser.last_name;

    $scope.uploader = new FileUploader();
    $scope.uploader.url = owndriveconst.APP_BACKEND + '/settings/profilePic/save';
    $scope.uploader.autoUpload = true;
    $scope.uploader.withCredentials = true;
    $scope.uploader.headers = {Accept: 'application/json'};
    $scope.uploader.removeAfterUpload = true;
    $scope.uploader.alias = 'image';


    $scope.uploader.onAfterAddingFile = function (item) {
        $scope.showProgress = true;
    }

    $scope.uploader.onSuccessItem = function (item) {
        $scope.showProgress = false;
        var img = document.querySelector(".profile-pic");
        img.src = img.src + '?' + ((Math.random() * 100) + 1);
        var img = document.querySelector(".profile-pic-settings");
        img.src = img.src + '?' + ((Math.random() * 100) + 1);
    }

    $scope.uploader.onErrorItem = function (item) {
        $scope.showProgress = false;
        var img = document.querySelector(".profile-pic");
        img.src = img.src + '?' + ((Math.random() * 100) + 1);
        var img = document.querySelector(".profile-pic-settings");
        img.src = img.src + '?' + ((Math.random() * 100) + 1);
    }

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.save = function () {
        var data = {
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            email: $scope.user.email
        }

        User.saveSettings('profilesettings', data).then(function (response) {
            $window.localStorage.setItem("activeUser", JSON.stringify(response.data));
            $rootScope.activeUser = JSON.parse($window.localStorage.getItem("activeUser"));
            $rootScope.userName = $rootScope.activeUser.first_name + ' ' + $rootScope.activeUser.last_name;
            $scope.userName = $rootScope.activeUser.first_name + ' ' + $rootScope.activeUser.last_name;
            $mdDialog.hide();
        })
    }

    $scope.changePassword = function () {
        if ($scope.passwordChange.currentpassword && $scope.passwordChange.newpassword && $scope.passwordChange.verifiedpassword) {
            User.saveSettings('newpassword', $scope.passwordChange).then(function (response) {
                $scope.passwordChange = '';
                console.log(response);
            })
        }
    }

    $scope.showFileSelectDialog = function () {
        console.log('clicked');
        $(".upload_profile_pic").trigger("click");
    }


}])
