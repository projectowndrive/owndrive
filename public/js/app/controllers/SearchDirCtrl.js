ownDriveCtrl.controller('SearchDirCtrl', ['$scope', '$animate', 'StoreItemProcessServ',
    function ($scope, $animate, StoreItemProcessServ) {

        var searching = false;
        $scope.searchList = function (query) {
            if (!searching) {
                searching = true;
                $scope.autocompleteList = StoreItemProcessServ.searchItem(query).then(function (response) {
                    searching = false;
                    return response;
                });
            } else {
             return '';
            }
        }

        //$scope.searchList();

        /* $scope.search = function(query){
         //$scope.autocompleteList = query ? $scope.autocompleteList.filter( fileSearch(query) ) : $scope.searchList(query).filter(fileSearch(query));

         $scope.autocompleteList = $scope.searchList(query).filter(fileSearch(query));
         }*/

        var fileSearch = function (query) {
            if (query) {
                var arr = $scope.autocompleteList.filter(function (file) {
                    var name = file.name.toLowerCase()
                    return (name.indexOf(query.toLowerCase()) != -1);
                });
            }
        }


        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

    }
])