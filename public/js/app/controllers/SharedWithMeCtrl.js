ownDriveCtrl.controller('SharedWithMeCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, $mdToast) {


        $scope.pathFrmUrl = $stateParams.path ? decodeURIComponent($stateParams.path) : null;
        $scope.parentpath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '';
        $scope.selectedItem = '';
        $scope.selectedItem.id = '';



        /*Get drive contents*/

        var getSharedWIrhMeContents;
        getSharedWIrhMeContents = function (path, ownerId, id) {
            var temppath = '';
            if (id) {
                temppath = $scope.selectedItem.path;
            } else if (path) {
                temppath = path

                //window.location.assign(path);
            } else {
                temppath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '';
                path = $scope.pathFrmUrl;
            }


            ExplorerServ.getSharedWIrhMeContents(path, ownerId, id).then(function (data) {
                $scope.StoreContents = data;
                // window.history.pushState("object or string", "Title", "/new-url");
                $scope.parentpath = temppath;
            });


        };



        getSharedWIrhMeContents();


            /*GOn Item Focus*/

        $scope.storeItemFocus = function (ietmType, selectedItem) {
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer('sharedwithme-item');
            $scope.selectedItem = selectedItem;
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
                //$state.go('app.shared-with-me', {path : path});
                getSharedWIrhMeContents(path, $scope.selectedItem.owner_id);
                console.log($scope.selectedItem.owner_id);
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


        //refresh
        var refresh = function () {
            getSharedWIrhMeContents();
        }

        //Download
        var download = function () {
            StoreItemProcess.download($scope.selectedItem.id, $scope.selectedItem.mime, $scope.selectedItem.name).then(function () {
            })
        }


        $scope.contextMenuAction = function (action) {
            var item = $scope.selectedItem;


            switch (action) {
                case 'properties':
                    bottomsheetProperties();
                    break;
                case 'refresh':
                    refresh();
                    break;
                case 'open':
                    $scope.openDirectory(item.id);
                    break;
                case 'download':
                    download();
                    break;
                case 'copy':
                    copy();
                    break;

                default:

            }
        }


    }


]);