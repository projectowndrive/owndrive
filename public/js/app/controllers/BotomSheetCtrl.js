ownDriveCtrl.controller('BottomSheetCtrl', ['$scope', '$mdBottomSheet', 'bottemsheetItems', 'item', function($scope, $mdBottomSheet, bottemsheetItems, item){
	$scope.bottemsheetItems = bottemsheetItems;
	$scope.item = item;
}])