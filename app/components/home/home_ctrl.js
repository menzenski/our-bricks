// Home controller
mean.controller('HomeCtrl', ['$scope', 'Api', function($scope, Api) {

    // create a notes array bound to the controller's scope
    $scope.notes = [];
    $scope.loading = true;

    // define notes request
    $scope.requestNotes = function(name) {
        Api.notes.read({ search: $scope.search }, function(result) {
            $scope.notes = result && result.notes ? result.notes : [];
            $scope.loading = false;
        });
    }

    // invoke notes request
    $scope.requestNotes();

}]);
