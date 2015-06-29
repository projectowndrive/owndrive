ownDriveServ

    .factory('ContextMenuServ', function () {


        /*Context Menu Items for Explorer*/

        var service = {}


        service.getcontextMenuItemsforExplorer = function (item) {

            var contextMenuItemsforExplorer = [{
                label: 'open',
                icon: '',
                action: 'open',
                tabIndex: '1',
                divider: false,
                enabled: false
            }, {
                label: 'new directory',
                icon: 'ion-plus',
                action: 'newDirectory',
                tabIndex: '2',
                divider: false,
                enabled: false
            }, {
                label: 'rename',
                icon: '',
                action: 'rename',
                tabIndex: '3',
                divider: true,
                enabled: false
            }, {
                label: 'copy',
                icon: 'ion-ios-copy',
                action: 'copy',
                tabIndex: '4',
                divider: false,
                enabled: false
            }, {
                label: 'cut',
                icon: 'ion-scissors',
                action: 'cut',
                tabIndex: '5',
                divider: false,
                enabled: false
            }, {
                label: 'paste',
                icon: 'ion-scissors',
                action: 'paste',
                tabIndex: '6',
                divider: false,
                enabled: false
            }, {
                label: 'delete',
                icon: 'ion-android-delete',
                action: 'delete',
                tabIndex: '7',
                divider: true,
                enabled: false
            }, {
                label: 'restore',
                icon: 'ion-android-refresh',
                action: 'restore',
                tabIndex: '8',
                divider: false,
                enabled: false
            }, {
                label: 'delete forever',
                icon: 'ion-android-delete',
                action: 'delforever',
                tabIndex: '9',
                divider: false,
                enabled: false
            }, {
                label: 'refresh',
                icon: 'ion-loop',
                action: 'refresh',
                tabIndex: '10',
                divider: false,
                enabled: false
            }, {
                label: 'add to favorites',
                icon: 'ion-android-favorite',
                action: 'fav',
                tabIndex: '11',
                divider: false,
                enabled: false
            }, {
                label: 'remove from favorites',
                icon: 'ion-android-favorite-outline',
                action: 'removefav',
                tabIndex: '12',
                divider: false,
                enabled: false
            }, {
                label: 'share',
                icon: 'ion-android-share-alt',
                action: 'share',
                tabIndex: '13',
                divider: false,
                enabled: false
            }, {
                label: 'get link',
                icon: 'ion-link',
                action: 'getlink',
                tabIndex: '14',
                divider: false,
                enabled: false
            }, {
                label: 'download',
                icon: 'ion-android-download',
                action: 'download',
                tabIndex: '15',
                divider: true,
                enabled: false
            }, {
                label: 'download as zip',
                icon: 'ion-android-download',
                action: 'downloadzip',
                tabIndex: '16',
                divider: true,
                enabled: false
            }, {
                label: 'properties',
                icon: 'ion-ios-information',
                action: 'properties',
                tabIndex: '17',
                divider: false,
                enabled: false
            }

            ]


            angular.forEach(contextMenuItemsforExplorer, function (item) {
                item.enabled = false
            });


            var enable = function (itemLabel, noDivider) {
                angular.forEach(contextMenuItemsforExplorer, function (item) {
                    if (item.label == itemLabel) {
                        item.enabled = true;

                        if(noDivider){
                            item.divider = false;
                        }
                    }

                })
            };

            if (item === "folder") {
                enable('open');
                enable('rename');
                enable('copy');
                enable('cut');
                enable('delete');
                enable('share');
                //enable('download as zip');
                enable('properties');
            } else if (item === "file") {
                enable('rename');
                enable('copy');
                enable('cut');
                enable('delete');
                enable('share');
                //enable('get link');
                enable('download');
                enable('properties');
            } else if (item === "blank-area-explorer") {
                enable('new directory');
                enable('refresh');
                //enable ('paste');
            } else if (item === "blank-area") {
                enable('refresh');
                //enable ('paste');
            } else if (item === "trashed-item"){
                enable('restore');
                enable('delete forever');
                enable('properties');
            } else if (item === "sharedwithme-item"){
                //enable('copy');
                enable('download', true);
            }

            return contextMenuItemsforExplorer;

        };

        return service;

        /*    return {
         //element: null,
         //: null
         };*/
    });