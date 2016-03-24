// wrapper for simplifying requests to the API
mean.service('Api', ['$http', '$resource', function($http, $resource) {

    // return a function which thinly wraps the $http object
    var api = function(settings) {
        return $http(settings);
    }

    // RESOURCES
    // Notes
    api.notes = $resource('/notes', null, {
        create: { method: 'POST' },
        read: { method: 'GET' }
    });

    // Note
    api.note = $resource('/notes/:id', null, {
        create: { method: 'POST' },
        read: { method: 'GET' },
        destroy: { method: 'DELETE' },
        update: {
            method: 'PUT',
            params: {
                // make sure `id` is used as URI parameter, not in the body
                id: '@id'
            }
        }
    });

    return api;

}]);
