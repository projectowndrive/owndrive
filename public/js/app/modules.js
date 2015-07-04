//var store = angular.module('store', ['ngMaterial','ui.router',]);
var ownDriveServ = angular.module('ownDriveServ', []);

var ownDriveCtrl = angular.module('ownDriveCtrl', []);
var ownDriveDir = angular.module('ownDriveDir', []);

var ownDrive = angular.module('ownDrive', ['ngCookies', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ui.router', 'ng-context-menu', 'angular-loading-bar', 'angularFileUpload', 'toastr', 'ngDialog', 'ownDriveServ', 'ownDriveCtrl', 'ownDriveDir']);