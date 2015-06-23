ownDriveCtrl.controller('FavoritesCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, $mdToast) {

        $scope.pathFrmUrl = $stateParams.path ? $stateParams.path : null;
        $scope.parentpath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '/';
        $scope.selectedItem = '';
        $scope.selectedItem.id = '';


        /*Get drive contents*/

        var getStoreContents = function(id, path){
            var temppath = '';
            if (id){
                temppath = $scope.selectedItem.path;
            } else if(path){
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


        }


        var getFav = function () {
            ExplorerServ.getFavoriteContents().then(function (data){
                $scope.StoreContents = data;
                $scope.parentpath = '';
            });
        }

        getFav();



        /*On Item Focus*/

        $scope.storeItemFocus = function (ietmType, selectedItem) {
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer(ietmType);
            $scope.selectedItem = selectedItem;


            if($scope.selectedItem.starred === 0) {
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'add to favorites') {
                        item.enabled = true;
                    }
                })
            } else if($scope.selectedItem.starred === 1){
                angular.forEach($scope.contextMenuItems, function (item) {
                    if (item.label == 'remove from favorites') {
                        item.enabled = true;
                    }
                })
            }
        }

        $scope.emptyAreaContextMenu = function(){
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer('blank-area');
        }

        /*Functions for context menu*/
        //open
        $scope.openDirectory = function () {
            if($scope.selectedItem.type === 'folder'){
                var path = $scope.selectedItem.path + $scope.selectedItem.name;
                $scope.parentpath = path;
                $state.go('app.explorer', {path : path});
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
                'Date Modified': $scope.selectedItem.updated_at,
            }
            $mdBottomSheet.show({
                templateUrl: 'templates/components/bottom-sheet.html',
                controller: 'BottomSheetCtrl',
                locals: {
                    bottemsheetItems: $scope.bottemsheetItems,
                    item: $scope.selectedItem,
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
                    item: $scope.selectedItem,
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
                onComplete: afterShowAnimation,
            })
                .then(function (data) {
                    if (data.status === 'success') {
                        $scope.selectedItem.name = data.newName;
                        $mdToast.show($mdToast.simple().position('top right').content('Successfully Renamed.'));
                    } else {
                        $mdToast.show($mdToast.simple().position('top right').content('Rename Failed.'));
                    }
                })
            function afterShowAnimation() {

            }

        }

        //refresh
        var refresh = function () {
            $rootScope.copyclipboard = '';
            $rootScope.moveclipboard = ''
            getFav();
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
        var trash = function(){
            StoreItemProcess.trash($scope.selectedItem.id).then(function (data) {
                refresh();
            })

        }

        //add to favorites
        var addFav = function(){
            StoreItemProcess.addFavorites($scope.selectedItem.id).then(function(){
                refresh();
            })
        }


        //remove from favorites
        var removeFav = function(){
            StoreItemProcess.removeFavorites($scope.selectedItem.id).then(function(){
                refresh();
            })
        }


        $scope.contextMenuAction = function (action) {
            var item = $scope.selectedItem;


            switch (action) {
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
                case 'removefav':
                    removeFav();
                    break;

                default:

            }
        }


    }


]);