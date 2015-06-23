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

                function decode(find, replace, str) {
                    return str.replace(new RegExp(find, 'g'), replace);
                }

                decode ('%252F', '/', val);

                return val != null ? val.toString() : val;
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