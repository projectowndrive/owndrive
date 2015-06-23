ownDriveServ.factory('UserServ', ['$http', '$q', '$window', 'owndriveconst', '$rootScope', '$mdToast', '$state', 'AuthServ', function ($http, $q, $window, owndriveconst, $rootScope, $mdToast, $state, AuthServ) {

	var serivce = {};

	serivce.getAvatar = function () {

		var deferred = $q.defer();
		deferred.resolve('/img/profile.jpg');
		return deferred.promise;

	};

    serivce.getUserList = function () {

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


  serivce.isLoggedin = function() {                     

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
  };


	return serivce;
}]);

