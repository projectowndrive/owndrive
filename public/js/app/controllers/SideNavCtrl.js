ownDriveCtrl
	.controller('SideNavCtrl',[ '$scope', '$timeout', '$mdSidenav', '$log', '$state', '$rootScope', 'FileUploader', 'owndriveconst', function ($scope, $timeout, $mdSidenav, $log, $state, $rootScope, FileUploader, owndriveconst) {
		$scope.toggleLeft = function () {
			$mdSidenav('left').toggle()
				.then(function () {
					$log.debug("toggle left is done");
				});
		};

        $scope.explorer = function(){
            $state.go('app.explorer');
        }


        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $scope.disableUpload = $rootScope.disableUpload;
                console.log('disableUpload: ' + $scope.disableUpload)
            })

        $scope.uploader = $rootScope.uploader;

        $scope.uploader.onAfterAddingAll = function(items){
            classie.remove(document.querySelector('.overlay-img'), 'animated');
            classie.remove(document.querySelector('.overlay-img'), 'bounceIn');


            angular.forEach(items, function (item) {
                item.formData.push({'path': $rootScope.parentpath});
            })

            if ($rootScope.uploadDialog){
                $rootScope.uploadDialog.close();
            }

            $rootScope.uploadDialog = ngDialog.open({ template: 'templates/components/upload-dialog.html', controller: 'UploadDialogCtrl'});
        }


        $("#upload_file_btn").click(function() {
            $(".upload_file").trigger("click");
        });


	}]);