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



        service.shareWithUser = function (fileId, userId) {
            var deffered = $q.defer();

            $http({
                url: 'owndriveconst.APP_BACKEND' + '/sharewithuser',
                method: 'post',
                data: {
                    'fileId': fileId,
                    'userId': userId

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

        service.shareWithUser = function (fileId, groupId) {
            var deffered = $q.defer();

            $http({
                url: 'owndriveconst.APP_BACKEND' + '/sharewithgroup',
                method: 'post',
                data: {
                    'fileId': fileId,
                    'userId': groupId

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