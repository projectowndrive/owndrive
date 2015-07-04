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
            url: owndriveconst.APP_BACKEND + '/getsettingresource/userlist',
            method: 'get',
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

    service.saveSettings = function (settingName, settingData){
        var deferred = $q.defer();

        $http({
            url: owndriveconst.APP_BACKEND + '/settings/' + settingName + '/save',
            method: 'post',
            data: settingData,
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


	return service;
}]);