//var store = angular.module('store', ['ngMaterial','ui.router',]);
var ownDriveServ = angular.module('ownDriveServ', []);

var ownDriveCtrl = angular.module('ownDriveCtrl', []);
var ownDriveDir = angular.module('ownDriveDir', []);

var ownDrive = angular.module('ownDrive', ['ngCookies', 'ngAnimate', 'ngMaterial', 'ui.router', 'ng-context-menu', 'angular-loading-bar', 'angularFileUpload', 'toastr', 'ngDialog', 'ownDriveServ', 'ownDriveCtrl', 'ownDriveDir']);


ownDriveServ.factory('AuthServ', ['$http', '$q', '$window', 'owndriveconst',
    function($http, $q, $window, owndriveconst) {

        var service = {};

        service.login = function(userCred) {
            var defered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/login',
                data: userCred,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            .success(function(data, status, hdr, config) {
                    if (data.loginStatus){
                        $window.localStorage.setItem("loginStatus", true);
                        $window.localStorage.setItem("activeUser", JSON.stringify(data));


                    } else{
                        $window.localStorage.setItem("loginStatus", false);
                        $window.localStorage.setItem("activeUser", '');
                    }

                    defered.resolve(data);
            })

            .error(function(data, status) {
                //defered.reject(data);
            });

            return defered.promise;
        }


        service.logout = function() {
            var defered = $q.defer();

            $http({
                url : owndriveconst.APP_BACKEND + '/logout',
                method: 'post',
                withCredentials: true
            })

                .success(function(data, status){
                    if (!data.loginStatus){
                        $window.localStorage.setItem("loginStatus", false);
                    }

                    defered.resolve(data);
                })

                .error(function(data, status){

                });

            return defered.promise;
        }

        return service;
    }
])
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
ownDriveServ.factory('ExplorerServ', ['$http', '$q', '$rootScope', 'owndriveconst',
    function ($http, $q, $rootScope, owndriveconst) {
        var service = {};

        service.getStoreContents = function (parentId, path) {


            var deferred = $q.defer();
            var data;


            if (parentId) {
                data = {parentId: parentId};
            } else if (path) {
                data = {path: path};
            } else {
                data = {path: '/'};
            }


            $http({
                url: owndriveconst.APP_BACKEND + '/getfiles',
                method: 'post',
                data: data,
                headers: {
                    'Content-Type': 'aplication/json'
                },
                withCredentials: true
            })


                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })

                .error(function (data, status, headers, config) {
                    $rootScope.ErrorHandler(status, data);
                })

            return deferred.promise;
        };




        service.getTrashContents = function(){
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/gettrashedfiles',
                method: 'post',
                data: '',
                headers: {
                    'Content-Type': 'aplication/json'
                },
            })


                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })

                .error(function (data, status, headers, config) {
                    $rootScope.ErrorHandler(status, data);
                })

            return deferred.promise;
        }


        service.getSharedWIrhMeContents = function(path, userId, parentId){

            var deferred = $q.defer();
            var data

            if (parentId) {
                data = {parentId: parentId};
            } else if (path) {
                data = {path: path, ownerId:userId};
            } else {
                data = {path: '', ownerId:userId};
            }

            $http({
                url: owndriveconst.APP_BACKEND + '/getfilessharedwith',
                method: 'post',
                data: data,
                headers: {
                    'Content-Type': 'aplication/json'
                },
            })


                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })

                .error(function (data, status, headers, config) {
                    $rootScope.ErrorHandler(status, data);
                })

            return deferred.promise;
        }


        service.getFavoriteContents = function(){
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/getfavoritefiles',
                method: 'post',
                data: '',
                headers: {
                    'Content-Type': 'aplication/json'
                },
            })


                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })

                .error(function (data, status, headers, config) {
                    $rootScope.ErrorHandler(status, data);
                })

            return deferred.promise;
        }


        service.getRecentContents = function(){
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/getrecentfiles',
                method: 'post',
                data: '',
                headers: {
                    'Content-Type': 'aplication/json'
                },
            })


                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })

                .error(function (data, status, headers, config) {
                    $rootScope.ErrorHandler(status, data);
                })

            return deferred.promise;
        }


        return service;
    }
]);
ownDriveServ.factory('OwndriveInterceptor', ['$q', 'owndriveconst', '$injector', function($q, owndriveconst, $injector){

    var url = owndriveconst.APP_BACKEND;

    var service = {}


    service.request = function(config){

        if(config.url.indexOf(url) > -1){
            //console.log('@interceptor->request');
            //console.log(config);

            var toastr = $injector.get('toastr');
            var window = $injector.get('$window');
            var state = $injector.get('$state');

            //console.log('@interceptor->request'+ !(config.url.indexOf(url + '/login') > -1))

            if (window.localStorage.getItem("loginStatus") == "false" && !(config.url.indexOf(url + '/login') > -1)) {
                var canceller = $q.defer();
                config.timeout = canceller.promise;
                config.statusText = 'canceled by owndrive';
                canceller.resolve();


                toastr.error('You have already logged out. <br> please login again.', 'Error');
                state.go('login');


            }
        }

        return config;
    }

    service.requestError = function(rejection) {
        //console.log('@interceptor->requestError');
        //console.log(rejection);

        return $q.reject(rejection);
    }



    service.response = function(response){

        var toastr = $injector.get('toastr');


        //console.log('@interceptor->response');
        //console.log(response);

        if(response.config.url.indexOf(url) > -1) {
            //console.log('@interceptor->response');
            //console.log(response);

            if(response.data.status === 'success'){
                toastr.success(response.data.message, 'Success');
            }
        }

        return response;
    }



    service.responseError = function(rejection) {
        //console.log('@interceptor->responseError' + rejection);
        //console.log(rejection);

        var toastr = $injector.get('toastr');
        var window = $injector.get('$window');
        var state = $injector.get('$state');


        if (rejection.status === 400) {

            if(rejection.data){
                if(rejection.data.status === 'error'){
                    toastr.error(rejection.data.message, 'Error, ' + rejection.statusText);
                }
            }

        } else if (rejection.status === 401) {

            var User = $injector.get('UserServ');
            User.isLoggedin().then(function(data) {
                if (data.authState === 'false') {
                    toastr.error('Something went wrong! Please login.', 'Error');
                    window.localStorage.setItem("loginStatus", "false");
                    state.go('login');
                }
            })

        } else if (rejection.status === 422) {

            if(rejection.data){
                if(rejection.data.status === 'error'){
                    toastr.error(rejection.data.message, 'Error');
                }
            }

        } else if (rejection.status === 408) {

            toastr.error('The server timed out waiting for the request. <br> Please inform admin.', 'Error');

        } else if (rejection.status === 500) {

            toastr.error('An internal server error occurred. <br> Please inform admin.', 'Error');

        } else if (rejection.status === 503) {

            toastr.error('The server is currently unavailable. <br> Please try again later.', 'Error');

        } else if (rejection.status === 0 && rejection.config.statusText !=='canceled by owndrive') {

            toastr.error('Server not reachable. <br> Please check your network connection.', 'Error');
        }

        return $q.reject(rejection);
    }

    return service;
}])
ownDriveServ.factory('StoreItemProcessServ', ['$http', '$q', 'owndriveconst',

    function($http, $q, owndriveconst) {
        var service = {};

        service.getIetmIcon = function(mimeType) {

            var script


                /*Get content type from mime type*/
                var mimeType = mimeType;
                var split = mimeType.split("/");

                var contentType = split[0];
                var format = split[1];

                /*Special considerations for different files*/


            var processIcon = null;

                if(format){
                    if (format.indexOf("script") > -1) {
                        processIcon = "script";
                    }
                    if (format.indexOf("msword") > -1 || format.indexOf("word") > -1){
                        processIcon = "document";
                    }
                    if (format.indexOf("powerpoint") > -1 || format.indexOf("presentation") > -1){
                        processIcon = "presentation";
                    }
                    if (format.indexOf("excel") > -1 || format.indexOf("spreadsheet") > -1){
                        processIcon = "spreadsheet";
                    }
                }


            var itemIcon = null;
            /*Set icons for content types*/
            switch (contentType) {
                case 'application':
                    itemIcon = 'ion-android-expand';
                    break;
                case 'text':
                    itemIcon = 'ion-document-text';
                    break;
                case 'video':
                    itemIcon = 'ion-android-film';
                    break;
                case 'audio':
                    itemIcon = 'ion-ios-musical-note';
                    break;
                case 'image':
                    itemIcon = 'ion-android-image';
                    break;

                default:
                    itemIcon = 'ion-android-document';
            }


            /*Set icons for content types*/
            if (processIcon === "script"||mimeType === 'text/html' || mimeType === 'text/x-php') {
                itemIcon = 'ion-code';
            }

            if (processIcon === "document"){
                itemIcon = 'ion-ios-list';
            }

            if (processIcon === "presentation"){
                itemIcon = 'ion-ios-pie';
            }

            if (processIcon === "spreadsheet"){
                itemIcon = 'ion-stats-bars';
            }
            
            return itemIcon;
        }


        service.getFormatedSize = function(itemSize) {

            if (itemSize < 1024) {
                itemSize = itemSize + ' Bytes';
            } else if (itemSize > 1024 && itemSize < 1000000) {
                itemSize = (itemSize / 1024);
                itemSize = itemSize.toFixed(2) + ' KB';
            }
            else if (itemSize > 1000000) {
                itemSize = (itemSize / 1024)/1024;
                itemSize = itemSize.toFixed(2) + ' MB';
            }
            return itemSize;


            /*function bytesToSize(bytes) { if(bytes == 0) return '0 Byte'; var k = 1000; var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; var i = Math.floor(Math.log(bytes) / Math.log(k)); return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]; }*/

        }

        service.rename = function (fileId, newName) {
        	var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/renamefile',
                method: 'post',
                 data: {
                     'fileId': fileId,
                     'newName': newName
                 },
                 headers: {
                    'Content-Type': 'aplication/json'
                 },
                withCredentials: true
             })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })


                .error(function(data, status, headers, config){

                })

            //deffered.resolve("success");
            return deffered.promise;
        }


        service.copy = function (fileId, newPath) {
            var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/copyfile',
                method: 'post',
                data: {
                    'fileId': fileId,
                    'newPath': newPath
                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }

        service.move = function (fileId, newPath) {
            var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/movefile',
                method: 'post',
                data: {
                    'fileId': fileId,
                    'newPath': newPath

                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }

        service.trash = function(fileId){
            var deferred = $q.defer();


            $http({
                url: owndriveconst.APP_BACKEND + '/trashfile',
                method: 'post',
                data: {
                    'fileId': fileId
                },
                headers: {
                    'Content-Type': 'aplication/json'
                },
                withCredentials: true
            })

                .success(function(data, status, headers, config){
                    deferred.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deferred.promise;
        }




        service.restore = function(fileId) {
            var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/restorefile',
                method: 'post',
                data: {
                    'fileId': fileId
                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;

        }




        service.delete = function (fileId) {
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/deletefile',
                method: 'post',
                data: {
                    'fileId': fileId

                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deferred.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deferred.promise;
        }


        service.addFavorites = function (fileId) {
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/addfavorites',
                method: 'post',
                data: {
                    'fileId': fileId
                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deferred.resolve(data);
                })

                .error(function(data, status, headers, config){

                })


            return deferred.promise;
        }

        service.removeFavorites = function (fileId) {
            var deferred = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/removefavorites',
                method: 'post',
                data: {
                    'fileId': fileId
                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deferred.resolve(data);
                })

                .error(function(data, status, headers, config){

                })


            return deferred.promise;
        }




        service.createDirectory = function (directoryName, path) {
            var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/createdir',
                method: 'post',
                data: {
                    'directoryName': directoryName,
                    'path': path

                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }


        service.shareFile = function (fileId, shareUsers, unshareUsers) {
            var deffered = $q.defer();

            $http({
                url: owndriveconst.APP_BACKEND + '/managefileshare',
                method: 'post',
                data: {
                    'fileId': fileId,
                    'shareUserIds': shareUsers,
                    'unshareUserIds': unshareUsers
                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }

        service.getLink = function (fileId) {
            var deffered = $q.defer();

            $http({
                url: 'owndriveconst.APP_BACKEND' + '/getlink',
                method: 'post',
                data: {
                    'fileId': fileId

                },
                headers: {
                    'Content-Type': 'aplication/json'
                }
            })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }

        service.download = function (fileId, mime, filename) {
            var deffered = $q.defer();


            $http({
                url: owndriveconst.APP_BACKEND + '/getdownloadurl',
                method: 'post',
                data: {
                    'fileId': fileId
                }
            })

                .success(function(data, status, headers, config){
                    var element = angular.element('<a/>');
                    element.attr({
                        href: owndriveconst.APP_BACKEND + '/downloadfile/' + data.key,
                        target: '_self'
                    })[0].click();


                    //deffered.resolve(data);
                })

                .error(function(data, status, headers, config){

                })

            return deffered.promise;
        }


        service.downloadzip = function (fileId) {
                var deffered = $q.defer();

                $http({
                    url: 'owndriveconst.APP_BACKEND' + '/downloadzip',
                    method: 'post',
                    data: {
                        'fileId': fileId

                    },
                    headers: {
                        'Content-Type': 'aplication/json'
                    }
                })

                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })

                .error(function(data, status, headers, config){
                })

            return deffered.promise;
        }


        return service;
    }
])
ownDriveServ.factory('UserServ', ['$http', '$q', '$window', 'owndriveconst', '$rootScope', '$mdToast', '$state', 'AuthServ', function ($http, $q, $window, owndriveconst, $rootScope, $mdToast, $state, AuthServ) {

	var service = {};

    service.getAvatar = function () {

		var deferred = $q.defer();
		deferred.resolve('/img/profile.jpg');
		return deferred.promise;

	};

    service.getUserList = function () {

        var deferred = $q.defer();


        $http({
            url: owndriveconst.APP_BACKEND + '/getsettingresource',
            method: 'post',
            headers: {
                'Content-Type': 'aplication/json'
            },
            data: {
                resource : 'userlist'
            },
            withCredentials: true
        })

            .success(function (data, status, headers, config){
                deferred.resolve(data);
            })

            .error(function (data, status, headers, config){
                deferred.reject(data);
            })

        return deferred.promise;

    };


    service.isLoggedin = function() {

    /*if($window.localStorage.getItem("loginStatus") !== null){
    	return $window.localStorage.getItem("loginStatus");
    }*/

      var deferred = $q.defer();


      $http({
          url: owndriveconst.APP_BACKEND + '/checkauth',
          method: 'post',
          headers: {
              'Content-Type': 'aplication/json'
          },
          withCredentials: true
      })

          .success(function (data, status, headers, config){
              deferred.resolve(data);

              /*var sKey = 'laravel_session';
              var getCookie = function(sKey) {
                  if (!sKey) { return null; }
                  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
              }
              console.log(getCookie(sKey));*/
          })

          .error(function (data, status, headers, config){
             // deferred.reject(data);
          })

      return deferred.promise;
  }



    service.getUserList = function (fileId, userId) {
        var deffered = $q.defer();

        $http({
            url: owndriveconst.APP_BACKEND + '/getsettingresource',
            method: 'post',
            data: {
                'resource': 'userlist'
            },
            headers: {
                'Content-Type': 'aplication/json'
            }
        })

            .success(function(data, status, headers, config){
                deffered.resolve(data);
            })

            .error(function(data, status, headers, config){

            })

        return deffered.promise;
    }


	return service;
}]);


ownDriveCtrl.controller('BottomSheetCtrl', ['$scope', '$mdBottomSheet', 'bottemsheetItems', 'item', function($scope, $mdBottomSheet, bottemsheetItems, item){
	$scope.bottemsheetItems = bottemsheetItems;
	$scope.item = item;
}])
ownDriveCtrl.controller('ContextMenuDirCtrl', ['$scope',
    function($scope) {
    }

])


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
ownDriveCtrl.controller('FavoritesCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, $mdToast) {

        $scope.pathFrmUrl = $stateParams.path ? decodeURIComponent($stateParams.path) : null;
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
                case 'share':
                    share();
                    break;

                default:

            }
        }


    }


]);
ownDriveCtrl.controller('FileShareDialogCtrl', ['$scope', '$mdDialog', '$animate', 'item', 'StoreItemProcessServ',
    function ($scope, $mdDialog, $animate, item, StoreItemProcessServ) {


        $scope.share = function () {
            var selectedUserIds = [];

            angular.forEach($scope.selectedUsers, function (selectedUser) {
                selectedUserIds.push(selectedUser.id);
            })

            var unsharedUserIds = $scope.unsharedUserIds();
            StoreItemProcessServ.shareFile(item.id, selectedUserIds, unsharedUserIds).then(function () {
                $mdDialog.hide();
            })
        }


        $scope.unsharedUserIds = function () {
            var unshareUserIds = [];
            var selectedUserIds = [];

            angular.forEach($scope.selectedUsers, function (selecteduser) {
                selectedUserIds.push(selecteduser.id);
            })

            if (item.shared_with) {
                angular.forEach(item.shared_with, function (id) {
                    if (selectedUserIds.indexOf(id) === -1) {
                        unshareUserIds.push(id);
                    }
                })
            }

            return unshareUserIds;
        }


        $scope.addToSelectedUsers = function (users) {
            var selectedUsers = [];

            angular.forEach(users, function (user) {
                if (item.shared_with && item.shared_with.indexOf(user.id) > -1) {
                    selectedUsers.push(user);
                }
            })

            return selectedUsers;
        }


        $scope.closeDialog = function () {
            $mdDialog.cancel();
        }
    }
])
ownDriveCtrl.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$mdToast', '$window', 'AuthServ', 'toastr',
        function($scope, $rootScope, $state, $mdToast, $window, AuthServ, toastr) {

            $scope.cred = { remember: false}

            $scope.login = function(cred) {

                if ($scope.cred.username&&$scope.cred.password){

                    AuthServ.login(cred).then(function (response) {

                        //console.log(response);
                        if (response.loginStatus) {
                            toastr.success('Successfully Logged in', 'Success');
                            $state.go('app.explorer');
                        } else {
                            toastr.error('Log in unsuccessful', 'Error');
                        }
                    });

            }

            }

 }]);
ownDriveCtrl.controller('MainToolbarDirCtrl', ['$scope', '$window', '$state', 'toastr', '$rootScope', 'AuthServ', 'UserServ', 'owndriveconst', function ($scope, $window, $state, toastr, $rootScope, Auth, User, owndriveconst) {
	

	$scope.logout = function() {
    	Auth.logout().then(function(data){
            console.log(data);
            if (!data.loginStatus){
                toastr.success('Successfully Logged out.', 'success');
                $state.go('login');
            }
            else{
                toastr.error('Log out unsuccessful', 'Error');
            }
        });
    };

    $rootScope.activeUser = JSON.parse($window.localStorage.getItem('activeUser'));

    $scope.avatar = owndriveconst.APP_BACKEND + '/img/profile/' + $rootScope.activeUser.profile_pic;
    $scope.userName = $rootScope.activeUser.first_name + $rootScope.activeUser.last_name


	/*User.getAvatar().then(function (data) {
		$scope.avatar = data;


    *//*$scope.getMatches = function(searchText) {
        return {
          display: ''
        };

        $scope.searchText  = '';
    };    *//*

	});*/

	


}]);
ownDriveCtrl.controller('RecentCtrl', ['$state', '$rootScope', '$scope', '$stateParams', 'ExplorerServ', 'ContextMenuServ', 'StoreItemProcessServ', '$mdBottomSheet', '$mdDialog', '$mdToast',
    function ($state, $rootScope, $scope, $stateParams, ExplorerServ, ContextMenu, StoreItemProcess, $mdBottomSheet, $mdDialog, $mdToast) {

        $scope.pathFrmUrl = $stateParams.path ? decodeURIComponent($stateParams.path) : null;
        $scope.parentpath = $scope.pathFrmUrl ? $scope.pathFrmUrl : '/';
        $scope.selectedItem = '';
        $scope.selectedItem.id = '';



        /*Get drive contents*/

        var getStoreContents;
        getStoreContents = function (id, path) {
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


        };


        var getRecent = function () {
            ExplorerServ.getRecentContents().then(function (data){
                $scope.StoreContents = data;
                $scope.parentpath = '';
            });
        }

        getRecent();


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
            getRecent();
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
                case 'share':
                    share();
                    break;

                default:

            }
        }


    }


]);
ownDriveCtrl.controller('SearchDirCtrl',['$scope', '$animate', 'StoreItemProcessServ',
    function ($scope, $animate, StoreItemProcessServ) {


         $scope.searchList = function(){
             /*StoreItemProcessServ.getUserList().then(function (response){
                 console.log(response);
                 $scope.autocompleteList = response;
             })*/
         }

        $scope.searchList();

        $scope.item = function(query){
            $scope.autocompleteList = query ? $scope.autocompleteList.filter( createFilterFor(query) ) : $scope.autocompleteList;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

    }
])
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
ownDriveCtrl.controller('UserChipsDirCtrl', ['$scope', '$animate', 'owndriveconst', 'UserServ',
    function ($scope, $animate, owndriveconst, UserServ) {

        $scope.selectedUsers = [];

        $scope.getUserList = function () {
            UserServ.getUserList().then(function (response) {
                $scope.users = response;

                angular.forEach($scope.users, function(user) {
                    user.lowercaseName = angular.lowercase(user.first_name + ' ' + user.last_name);
                    user.name = user.first_name + ' ' + user.last_name;
                    user.image = owndriveconst.APP_BACKEND + '/img/profile/' + user.profile_pic;
                })

                if($scope.addToSelectedUsers){
                    $scope.selectedUsers = $scope.addToSelectedUsers($scope.users);
                }
            })
        }

        $scope.getUserList();


        /**
         * Search for contacts.
         */

        $scope.userSearch = function(query) {
            if(query) {
                var arr = $scope.users.filter(function(user) {
                    return (user.lowercaseName.indexOf(query.toLowerCase()) != -1)||(user.email.indexOf(query.toLowerCase()) != -1);

                });
                return arr;
            }
            return [];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
                return ($scope.user.lowercaseName.indexOf(lowercaseQuery) != -1);
        }
    }
])
ownDriveDir.directive('contextMenu', function(){
	return {
		 controller: 'ContextMenuDirCtrl',
		 restrict: 'E',
		 templateUrl: 'templates/directives/context-menu.html',
	};
});

ownDriveDir.directive('mainToolbar', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/main-toolbar.html',
		controller: 'MainToolbarDirCtrl'
	}
});
'use strict'
ownDriveDir.directive('search', function () {
	return {
		restrict: '',
		templateUrl: '/templates/directives/search.html',
		controller: 'SearchDirCtrl'
	}
});


ownDriveDir.directive('storeItem', [

    function() {
        // Runs during compile
        return {
            scope: {
                name: '@',
                itemType: '@',
                mimeType: '@'
            }, // {} = isolate, true = child, false/undefined = no change
            controller: 'StoreItemDirCtrl',
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'templates/directives/store-item.html',
        };

    }
]);
'use strict'
ownDriveDir.directive('userChips', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/user-chips.html',
		controller: 'UserChipsDirCtrl'
	}
});


ownDrive


    .config(["$stateProvider", "$urlRouterProvider", "$mdThemingProvider", "$locationProvider", "$urlMatcherFactoryProvider",
        function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $locationProvider, $urlMatcherFactoryProvider) {

            $mdThemingProvider.theme('default')
                .primaryPalette('blue', {
                    'hue-1': '900'
                })
                /*.primaryPalette('blue-grey', {
                 'hue-1': '50'
                 })*/
                .accentPalette('grey');


            // For any unmatched url, redrect to /state1
            //	$urlRouterProvider.otherwise("/404");

            //$locationProvider.html5Mode(true)

            $stateProvider

                /*.state('', {
                 url: "/",
                 requireAuth: "true"
                 })*/

                .state('login', {
                    url: "/",
                    requireAuth: false,
                    templateUrl: "/templates/login.html",
                    controller: "LoginCtrl"
                })

                .state('app', {
                    url: "",
                    templateUrl: "templates/app-templates/app.html",
                    requireAuth: true,
                    abstract: true
                })

                .state('app.dashboard', {
                    url: "/dashboard",
                    templateUrl: "templates/app-templates/dashboard.html",
                    requireAuth: true
                })

                .state('app.explorer', {
                    url: "/drive/my-files{path:string}",
                    templateUrl: "/templates/app-templates/explorer.html",
                    requireAuth: true,
                    allowUpload: true,
                    controller: "ExplorerCtrl"
                })


                .state('app.trash', {
                    url: "/drive/trash",
                    templateUrl: "/templates/app-templates/explorer-no-upload.html",
                    requireAuth: true,
                    controller: "TrashCtrl"
                })

                .state('app.fav', {
                    url: "/drive/favorites",
                    templateUrl: "/templates/app-templates/explorer-no-upload.html",
                    requireAuth: true,
                    controller: "FavoritesCtrl"
                })

                .state('app.recent', {
                    url: "/drive/recent",
                    templateUrl: "/templates/app-templates/explorer-no-upload.html",
                    requireAuth: true,
                    controller: "RecentCtrl"
                })

                .state('app.shared-with-me', {
                    url: "/drive/shared-with-me{path:string}",
                    templateUrl: "/templates/app-templates/explorer-no-upload.html",
                    requireAuth: true,
                    controller: "SharedWithMeCtrl"
                })

                /*.state('app.explorer.path', {
                 url:"/drive/",
                 templateUrl: "/templates/app-templates/explorer.html",
                 requireAuth: true,
                 controller: "ExplorerCtrl",
                 })*/


                .state('settings', {
                    url: "",
                    templateUrl: "<ui-view/>",
                    requireAuth: true,
                    abstract: true

                })

                .state('404', {
                    url: "/404",
                    templateUrl: "templates/404.html",
                    requireAuth: false

                });

            function valToString(val) {
                console.log('valtostring');

                val = decodeURIComponent(val);
                /*function decode(find, replace, str) {
                    return str.replace(new RegExp(find, 'g'), replace);
                }

                decode ('%252F', '/', val);*/

                return val != null ? val.toString() : '';
            }
            function regexpMatches(val) { /*jshint validthis:true */ return this.pattern.test(val); }

            $urlMatcherFactoryProvider.type('string', {
                encode: valToString,
                decode: valToString,
                is: regexpMatches,
                pattern: /[^/]*/
            });

        }
    ])

    .config(['cfpLoadingBarProvider', '$httpProvider', function (cfpLoadingBarProvider, $httpProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        $httpProvider.defaults.withCredentials = true;


        $httpProvider.interceptors.push('OwndriveInterceptor');
    }])


    .config(['toastrConfig', 'ngDialogProvider', '$urlMatcherFactoryProvider', function(toastrConfig, ngDialogProvider, $urlMatcherFactoryProvider) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            allowHtml: true
        })

        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-plain',
            plain: false,
            overlay: false,
            showClose: false,
            closeByDocument: false,
            closeByEscape: false,
            setForceBodyReload: true,
            appendTo: '.app-space'
        });


        //function valToString(val) { return val != null ? val.toString() : val; }
        //function valFromString(val) { return val != null ? val.toString() : val; }
        //function regexpMatches(val) { /*jshint validthis:true*/  return this.pattern.test(val); }
        //
        //$urlMatcherFactoryProvider.type("myType", {
        //    encode: valToString,
        //    decode: valFromString,
        //    is: regexpMatches,
        //    pattern: /.*/
        //});

        /*function valToString(val) {
            console.log('valtostring');

            function decode(find, replace, str) {
                return str.replace(new RegExp(find, 'g'), replace);
            }

            decode ('%252F', '/', val);

            return val != null ? val.toString() : val;
        }
        function regexpMatches(val) { *//*jshint validthis:true *//* return this.pattern.test(val); }
        $urlMatcherFactoryProvider.type('string', {
            encode: valToString,
            decode: valToString,
            is: regexpMatches,
            pattern: /[^/]*//*
        });*/

    }])
    //pattern: /(?:[^/]+\/[^/]+)/




    .run(["$urlMatcherFactory", "$window", "$rootScope", "$state", "$timeout", "UserServ", "owndriveconst", 'FileUploader', 'toastr',
        function ($urlMatcherFactory, $window, $rootScope, $state, $timeout, User, owndriveconst, FileUploader, toastr) {

            $rootScope.uploader = new FileUploader();
            $rootScope.uploader.url = owndriveconst.APP_BACKEND + '/upload';
            $rootScope.uploader.autoUpload = true;
            $rootScope.uploader.withCredentials = true;
            $rootScope.uploader.headers = {Accept: 'application/json'};



            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {


                    if (!$window.localStorage.getItem("loginStatus")) {
                        $window.localStorage.setItem("loginStatus", false);
                    }

                    var loginStatus = $window.localStorage.getItem("loginStatus");


                    if (toState.requireAuth === true && loginStatus === "false") {
                        $timeout(function () {
                            $state.go('login');
                        })
                    } else if (toState.requireAuth === false && loginStatus === "true") {
                        $timeout(function () {
                            $state.go('app.explorer');
                        })
                    }


                    $rootScope.disableUpload = true;
                    if(toState.allowUpload){
                        $rootScope.disableUpload = false;
                    }





                })

            /*});*/





            $rootScope.ErrorHandler = function (status, data) {

                console.log('ErrorHandler Called' + status);


            }


        }
    ])

    .constant('owndriveconst', {
        APP_BACKEND: window.location.protocol + '//backend.' + window.location.host
    })