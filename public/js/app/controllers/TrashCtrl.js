ownDriveCtrl.controller('TrashCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, $mdToast) {


        $scope.selectedItem = '';
        $scope.selectedItem.id = '';



        /*Get Trash contents*/
        var getTrashContents = function () {
            ExplorerServ.getTrashContents().then(function (data){
                $scope.StoreContents = data;
                $scope.parentpath = '';
            });
        }

        getTrashContents();


            /*GOn Item Focus*/

        $scope.storeItemFocus = function (ietmType, selectedItem) {
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer('trashed-item');
            $scope.selectedItem = selectedItem;
        }

        $scope.emptyAreaContextMenu = function(){
            $scope.contextMenuItems = ContextMenu.getcontextMenuItemsforExplorer('blank-area-trash');

        }

        /*Functions for context menu*/


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
            getTrashContents();
        }


        //restore
        var restore = function () {
            StoreItemProcess.restore($scope.selectedItem.id).then(function(data){
                refresh();
            });
        }

        //delete forever
        var deleteForever = function(){
            StoreItemProcess.delete($scope.selectedItem.id).then(function (data) {
                refresh();
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
                case 'delforever':
                    deleteForever();
                    break;
                case 'restore':
                    restore();
                    break;

                default:

            }
        }


    }


]);