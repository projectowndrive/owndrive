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