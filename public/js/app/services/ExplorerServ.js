ownDriveServ.factory('ExplorerServ', ['$http', '$q', '$rootScope', 'owndriveconst',
    function ($http, $q, $rootScope, owndriveconst) {
        var service = {};

        service.getStoreContents = function (parentId, path) {


            var deferred = $q.defer();


            if (parentId) {
                var data = {parentId: parentId};
            } else if (path) {
                var data = {path: path};
            } else {
                var data = {path: '/'};
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

            /*if (folderId === null || folderId === "/") {

             deferred.resolve([{
             'name': 'Songs',
             'id': 1,
             'type': 'folder',
             'mime': '',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-01-2015',
             'dateModified': '25-01-2015',
             'contentSize': '25859',


             }, {
             'name': 'Project',
             'id': 4,
             'type': 'folder',
             'mime': '',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',

             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '',
             'dateModified': '',
             'contentSize': '56984',


             }, {
             'name': 'photos',
             'id': 3,
             'type': 'folder',
             'mime': '',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-01-2015',
             'dateModified': '17-02-2015',
             'contentSize': '51483',


             }, {
             'name': 'mypic.jpg',
             'id': 7,
             'type': 'file',
             'mime': 'image/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '15-03-2015',
             'dateModified': '02-04-2015',
             'contentSize': '4978',


             }, {
             'name': 'office.jpg',
             'id': 5,
             'type': 'file',
             'mime': 'image/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '05-01-2015',
             'dateModified': '12-03-2015',
             'contentSize': '10387',


             }, {
             'name': 'project.zip',
             'id': 6,
             'type': 'file',
             'mime': 'application/zip',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-02-2015',
             'dateModified': '28-02-2015',
             'contentSize': '859485',


             }, {
             'name': 'jquery.min.js',
             'id': 12,
             'type': 'file',
             'mime': 'application/x-javascript',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-02-2015',
             'dateModified': '28-02-2015',
             'contentSize': '1569',


             }, {
             'name': 'Tum hi ho.mp3',
             'id': 8,
             'type': 'file',
             'mime': 'audio/x-mpeg-3',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '02-01-2015',
             'dateModified': '03-01-2015',
             'contentSize': '7854',


             }, {
             'name': 'TED talk.mp4',
             'id': 9,
             'type': 'file',
             'mime': 'video/mp4',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '14-03-2015',
             'dateModified': '18-03-2015',
             'contentSize': '8475',


             }, {
             'name': 'Shoot To Thrill.mp3',
             'id': 10,
             'type': 'file',
             'mime': 'audio/x-mpeg-3',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '12-01-2015',
             'dateModified': '12-01-2015',
             'contentSize': '6324',


             }]);

             }

             else if(folderId === 1){
             deffered.resolve([
             {
             'name': 'I like the way you lie',
             'id': 17,
             'type': 'file',
             'mime': 'audio/x-mpeg-3',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '12-01-2015',
             'dateModified': '12-01-2015',
             'contentSize': '4624',


             },{
             'name': '01 - Tum Hi Ho',
             'id': 18,
             'type': 'file',
             'mime': 'audio/x-mpeg-3',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '12-01-2015',
             'dateModified': '12-01-2015',
             'contentSize': '6324',


             },{
             'name': 'Shoot To Thrill.mp3',
             'id': 19,
             'type': 'file',
             'mime': 'audio/x-mpeg-3',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '12-01-2015',
             'dateModified': '12-01-2015',
             'contentSize': '8424',


             }
             ]);
             }

             else if(folderId === 4){
             deffered.resolve([
             {
             'name': 'my-code.js',
             'id': 15,
             'type': 'file',
             'mime': 'application/x-javascript',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-02-2015',
             'dateModified': '28-02-2015',
             'contentSize': '1389',


             },
             {
             'name': 'angular.min.js',
             'id': 16,
             'type': 'file',
             'mime': 'application/x-javascript',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '25-02-2015',
             'dateModified': '28-02-2015',
             'contentSize': '1499',


             },
             ]);
             }

             else if(folderId === 3){
             deffered.resolve([
             {
             'name': 'office.jpg',
             'id': 11,
             'type': 'file',
             'mime': 'image/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '05-01-2015',
             'dateModified': '12-03-2015',
             'contentSize': '9467',


             },
             {
             'name': 'my Class.jpg',
             'id': 12,
             'type': 'file',
             'mime': 'image/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '05-01-2015',
             'dateModified': '12-03-2015',
             'contentSize': '8987',


             },
             {
             'name': 'mobile pic 1.jpg',
             'id': 13,
             'type': 'file',
             'mime': 'image/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '05-01-2015',
             'dateModified': '12-03-2015',
             'contentSize': '11577',


             },
             {
             'name': 'mobile pic 2.jpg',
             'id': 14,
             'type': 'file',
             'mime': 'Nimage/jpeg',
             'attributes': {
             'starred': '',
             'trashed': '',
             'restricted': '',
             'viewed': '',
             },
             'ownerId': 2,
             'permissions': ['full'],
             'dateCreated': '05-01-2015',
             'dateModified': '12-03-2015',
             'contentSize': '13387',


             },
             ]);
             }*/

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