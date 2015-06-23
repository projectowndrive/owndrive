ownDriveDir.directive('storeItem', [

    function() {
        // Runs during compile
        return {
            scope: {
                name: '@',
                itemType: '@',
                mimeType: '@'
            }, // {} = isolate, true = child, false/undefined = no change
            controller: 'StoreItemDirCtrl',
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'templates/directives/store-item.html',
        };

    }
]);