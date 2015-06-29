ownDriveCtrl.controller('ExplorerCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', 'ngDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, ngDialog, $mdToast) {

        $scope.pathFrmUrl = $stateParams.path ? decodeURIComponent($stateParams.path) : null;
        $scope.parentpath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '/';
        $scope.selectedItem = '';
        $scope.selectedItem.id = '';



        /*Get drive contents*/

        var getStoreContents = function (id, path) {
            var temppath = '';
            if (id) {
                temppath = $scope.selectedItem.path;
            } else if (path) {
                temppath = path;
                //window.location.assign(path);
            } else {
                temppath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '/';
                path = $scope.pathFrmUrl;
            }


            ExplorerServ.getStoreContents(id, path).then(function (data) {
                $scope.StoreContents = data;
                // window.history.pushState("object or string", "Title", "/new-url");
                $scope.parentpath = temppath;
            });


            $rootScope.parentpath = $scope.parentpath;
        }

        getStoreContents();



        /*Upload*/


        $scope.uploader = $rootScope.uploader;
        $rootScope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            refresh();
        };

        document.querySelector('.explorer').addEventListener("dragover", function(){
                classie.add(document.querySelector('.overlay-img'), 'animated');
                classie.add(document.querySelector('.overlay-img'), 'bounceIn');
        })


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


        /*On Item Focus*/

        $scope.storeItemFocus = function (ietmType, selectedItem) {
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer(ietmType);
            $scope.selectedItem = selectedItem;


            if ($scope.selectedItem.starred === 0) {
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'add to favorites') {
                        item.enabled = true;
                    }
                })
            } else if ($scope.selectedItem.starred === 1) {
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'remove from favorites') {
                        item.enabled = true;
                    }
                })
            }

            classie.remove(document.querySelector('.overlay-img'), 'animated');
            classie.remove(document.querySelector('.overlay-img'), 'bounceIn');
        }



        /*On Empty Area Context Menu*/
        $scope.emptyAreaContextMenu = function () {
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer('blank-area-explorer');

            if ($rootScope.copyclipboard || $rootScope.moveclipboard) {
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'paste') {
                        item.enabled = true;
                    }

                })
            } else {
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'paste') {
                        item.enabled = false;
                    }

                })
            }

        }

        /*On Empty Area Focus*/
        $scope.emptyAreaFocus = function () {
            classie.remove(document.querySelector('.overlay-img'), 'animated');
            classie.remove(document.querySelector('.overlay-img'), 'bounceIn');
        }


        /*Functions for context menu*/
        //open
        $scope.openDirectory = function () {
            if ($scope.selectedItem.type === 'folder') {
                var path = $scope.selectedItem.path + $scope.selectedItem.name;
                $scope.parentpath = path;
                $state.go('app.explorer', {path: path});
            }
        }

        //properties
        var bottomsheetProperties = function () {
            var filesize = StoreItemProcess.getFormatedSize($scope.selectedItem.size);
            $scope.bottemsheetItems = {
                '  Name': $scope.selectedItem.name,
                ' File Type': '',
                ' File size': filesize,
                'Date Created': $scope.selectedItem.created_at,
                'Date Modified': $scope.selectedItem.updated_at
            }
            $mdBottomSheet.show({
                templateUrl: 'templates/components/bottom-sheet.html',
                controller: 'BottomSheetCtrl',
                locals: {
                    bottemsheetItems: $scope.bottemsheetItems,
                    item: $scope.selectedItem
                }
            });
        }


        //rename
        var rename = function () {

            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
            }


            $mdDialog.show({
                templateUrl: 'templates/components/rename.html',
                locals: {
                    item: $scope.selectedItem
                },
                controller: ['$scope', '$mdToast', '$animate', 'item', 'StoreItemProcessServ',
                    function ($scope, $mdToast, $animate, item, StoreItemProcessServ) {
                        $scope.newName = item.name;
                        $scope.closeDialog = function () {
                            $mdDialog.cancel();
                        }
                        $scope.renameItem = function () {
                            StoreItemProcessServ.rename(item.id, $scope.newName).then(function (response) {
                                $mdDialog.hide({'status': response.status, 'newName': $scope.newName});
                            })
                        }
                    }
                ],
                onComplete: afterShowAnimation
            })
                .then(function (data) {
                    if (data && data.status === 'success') {
                        $scope.selectedItem.name = data.newName;
                        refresh()
                    } else {
                        refresh();
                    }
                })
            function afterShowAnimation() {

            }

        }


        //create new directory
        var newDirectory = function () {
            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
            }


            $mdDialog.show({
                templateUrl: 'templates/components/new-directory.html',
                locals: {
                    parent: $scope.parentpath,
                    contents: $scope.StoreContents
                },
                controller: ['$scope', '$mdToast', '$animate', 'parent', 'contents', 'StoreItemProcessServ',
                    function ($scope, $mdToast, $animate, parent, contents, StoreItemProcessServ) {

                        var generateDirectoryName = function (items) {
                            var suffix = 1;
                            var newName = 'New directory';
                            $scope.directoryName = 'New directory';

                            angular.forEach(items, function (item) {
                                if (item.name === $scope.directoryName) {
                                    $scope.directoryName = newName + ' ' + suffix;
                                    suffix = suffix + 1;
                                }
                            });
                        }

                        generateDirectoryName(contents);

                        $scope.closeDialog = function () {
                            $mdDialog.cancel();
                        }

                        $scope.createDirectory = function () {
                            StoreItemProcessServ.createDirectory($scope.directoryName, parent).then(function (response) {
                                $mdDialog.hide({'status': response.status, 'newName': $scope.newName});
                            })
                        }
                    }
                ],
                onComplete: afterShowAnimation
            })
                .then(function (data) {
                    if (data && data.status === 'success') {
                        refresh();
                    } else {
                    }
                })
            function afterShowAnimation() {


            }
        }


        //share
        var share = function () {

            function afterShowAnimation(scope, element, options) {
                // post-show code here: DOM element focus, etc.
            }


            $mdDialog.show({
                templateUrl: 'templates/components/file-share.html',
                locals: {
                    item: $scope.selectedItem
                },
                controller: 'FileShareDialogCtrl',
                onComplete: afterShowAnimation
            })
                .then(function (data) {
                        refresh();
                })
            function afterShowAnimation() {

            }

        }



        //refresh
        var refresh = function () {
            $rootScope.copyclipboard = '';
            $rootScope.moveclipboard = ''
            getStoreContents(null, $scope.parentpath);
        }

        //copy
        var copy = function (id) {
            $rootScope.moveclipboard = '';
            $rootScope.copyclipboard = id;
        }

        //cut
        var cut = function (id) {
            $rootScope.copyclipboard = '';
            $rootScope.moveclipboard = id;
        }

        //paste
        var paste = function () {
            if ($rootScope.copyclipboard === '' && $rootScope.moveclipboard !== '') {
                console.log($scope.parentpath);
                StoreItemProcess.move($rootScope.moveclipboard, $scope.parentpath).then(function (data) {
                    refresh();
                })
            }
            else if ($rootScope.moveclipboard === '' && $rootScope.copyclipboard !== '') {
                console.log($scope.parentpath);
                StoreItemProcess.copy($rootScope.copyclipboard, $scope.parentpath).then(function (data) {
                    refresh();
                })
            }
        }


        //delete
        var trash = function () {
            StoreItemProcess.trash($scope.selectedItem.id).then(function (data) {
                refresh();
            })

        }

        //add to favorites
        var addFav = function () {
            StoreItemProcess.addFavorites($scope.selectedItem.id).then(function () {
                refresh();
            })
        }


        //remove from favorites
        var removeFav = function () {
            StoreItemProcess.removeFavorites($scope.selectedItem.id).then(function () {
                refresh();
            })
        }



        //Download
        var download = function () {
            StoreItemProcess.download($scope.selectedItem.id, $scope.selectedItem.mime, $scope.selectedItem.name).then(function () {
            })
        }


        $scope.contextMenuAction = function (action) {
            var item = $scope.selectedItem;


            switch (action) {
                case 'newDirectory':
                    newDirectory();
                    break;
                case 'properties':
                    bottomsheetProperties();
                    break;
                case 'rename':
                    rename();
                    break;
                case 'refresh':
                    refresh();
                    break;
                case 'copy':
                    copy(item.id);
                    break;
                case 'cut':
                    cut(item.id);
                    break;
                case 'paste':
                    paste();
                    break;
                case 'open':
                    $scope.openDirectory(item.id);
                    break;
                case 'delete':
                    trash();
                    break;
                case 'fav':
                    addFav();
                    break;
                case 'share':
                    share();
                    break;
                case 'removefav':
                    removeFav();
                    break;
                case 'download':
                    download();
                    break;

                default:

            }
        }


    }


]);