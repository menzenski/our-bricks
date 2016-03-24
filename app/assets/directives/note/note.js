// NOTE directive
// Scope should contain:
// {
//     _id: Number,
//     title: String,
//     content: String,
//     created: Date
// }
mean.directive('note', ['Api', function(Api) {
    return {
        // only execute the directive on elements `<note></note>`
        restrict: 'E',
        // use the note template
        templateUrl: '../views.note.html',
        // share the container's scope
        scope: true,
        // replace the directive html with the compiled template
        replace: true,
        link: function(scope, element, attrs, ctrl) {
            // on send, delete this note from the server
            // and if successful, remove it from the DOM
            scope.delete = function() {
                Api.note.destroy({
                    id: attrs.id
                }, function(result) {
                    if (result.success) {
                        element.remove();
                    }
                });
            }
        }
    };
}]);
