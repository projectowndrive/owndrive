ownDriveCtrl.controller('SearchDirCtrl',['$scope', '$animate', 'StoreItemProcessServ',
    function ($scope, $animate, StoreItemProcessServ) {


         $scope.searchList = function(){
             /*StoreItemProcessServ.getUserList().then(function (response){
                 console.log(response);
                 $scope.autocompleteList = response;
             })*/
         }

        $scope.searchList();

        $scope.item = function(query){
            $scope.autocompleteList = query ? $scope.autocompleteList.filter( createFilterFor(query) ) : $scope.autocompleteList;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

    }
])