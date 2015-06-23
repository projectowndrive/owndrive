ownDriveCtrl.controller('UserSearchDirCtrl', ['$scope', '$q', '$timeout', '$log', 'UserServ', function($scope, $q, $timeout, $log, UserServ){
    var self = this;


    // list of `state` value/display objects
    self.states        = loadAll();
    //self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    $scope.placeholder = 'Please select the users to share with';
    $scope.noCache = 'false';


    function querySearch (query) {
        var results = query ? self.states.filter( createFilterFor(query) ) : self.states;

    }

    function loadAll()
    {
        UserServ.getUserList().then(function (data) {
            return data;
        })
    }

    var selectedItemChange = function(){

    }

    var searchTextChange = function(){

    }
}])