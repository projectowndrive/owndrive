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