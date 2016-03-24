mean.controller('NoteActionCtrl',
    ['$scope', 'Api', '$routeParams', '$location',
    function($scope, Api, $routeParams, $location) {

        // keep state (whether edit or new note)
        var isEdit = !!$route.Params.id;
        $scope.action = isEdit ? 'Edit' : 'New';

        // inputs and errors for display
        $scope.inputs = {};
        $scope.errors = {};

        if (isEdit) {
            // reque the note
            $scope.loading = true;

            Api.note.read({
                id: $routeParams.id
            // on success
            }, function(result) {
                $scope.loading = false;

                // apply the resulting note to the inputs
                $scope.inputs = {
                    id: result._id,
                    title: result.title,
                    content: result.content
                }
            // on error
            }, function() {
                // display `not found` message
                $scope.notFound = true;
            });

            // add a delete option to edits only
            $scope.delete = function() {
                clearErrors();
                Api.note.destroy({
                    id: $routeParams.id
                }, responseSuccess, responseError);
            }
        }

        $scope.submit = function submit() {
            clearErrors();

            // assume it's an edit if an id exists
            if (isEdit) {
                Api.note.update($scope.inputs, responseSuccess, responseError);
            // otherwise, it must be a create
            } else {
                Api.notes.create({
                    title: $scope.inputs.title,
                    content: $scope.inputs.content
                }, responseSuccess, responseError);
            }
        }

        // response success callback, redirects to home
        function responseSuccess() {
            $location.path('/');
        }

        // response error callback, displays errors
        function responseError(response) {
            var err = response.data || {},
                details = err.details || [];

            $scope.errors.global = err.error;

            // pair up each error to its input
            details.forEach(function(error) {
                if (error.path && error.message) {
                    $scope.errors[error.path] = error.message;
                }
            });
        }

        // helper function for error cleanup
        function clearErrors() {
            var errorKeys = Object.keys($scope.errors);
            for (var i = 0, l = errorKeys.length; i < l; i++) {
                if (errorKeys[i]) {
                    delete $scope.errors[errorKeys[i]];
                }
            }
        }

    }]);
