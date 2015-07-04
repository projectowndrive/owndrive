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
                url: owndriveconst.APP_BACKEND + '/logout',
                method: 'post',
                withCredentials: true
            })

                .success(function (data, status) {
                    if (!data.loginStatus) {
                        $window.localStorage.setItem("loginStatus", false);
                    }

                    defered.resolve(data);
                })

                .error(function (data, status) {

                });
            return defered.promise;
        }



            service.registerUser = function(data) {
            var defered = $q.defer();

            $http({
                url : owndriveconst.APP_BACKEND + '/register',
                method: 'post',
                data: data,
                withCredentials: true
            })

                .success(function(data, status){

                    defered.resolve(data);
                })

                .error(function(data, status){

                });

            return defered.promise;
        }

        return service;
    }
])