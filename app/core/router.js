// client-side routing
mean.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        // HOME - display a list of notes
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        // NEW - new note submission
        .when('/new', {
            templateUrl: 'views/note_action.html',
            controller: 'NoteActionCtrl'
        })
        // EDIT - edit an existing note
        .when('/edit/:id', {
            templateUrl: 'views/note_action.html',
            controller: 'NoteActionCtrl'
        })
        // 404 - everything else
        .otherwise({
            templateUrl: 'views/404.html'
        });

}]);
