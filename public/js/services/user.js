skeletonServices
    .service('UserResource', ['$resource',
        function ($resource) {
            return $resource('/api/users/:id', {id: '@id'}, {
                update: {method: 'PUT'}
            });
        }
    ])

    .service('UserService', ['$q', '$filter', 'UserResource',
        function($q, $filter, UserResource) {
            var users = [], currentUser = null, currentUserId = null;

            this.get = function(params) {
                var defer = $q.defer();

                if(currentUser && currentUserId === id) {
                    defer.resolve(currentUser);
                } else {
                    UserResource.get(params, function(data) {
                        currentUser = data;
                        currentUserId = params.id ? params.id : null;

                        defer.resolve(currentUser);
                    });
                }

                return defer.promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(users && users.length) {
                    defer.resolve(users);
                } else {
                    UserResource.query().$promise
                        .then(function(data) {
                            users = data;
                            defer.resolve(users);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(user) {
                var defer = $q.defer();

                var temp = new UserResource();
                temp.$delete({id:user.id}, function(data) {
                    angular.forEach(users, function(u, index) {
                        if(user.id === u.id) {
                            users.splice(index, 1);
                        }
                    });

                    defer.resolve(users);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new UserResource(data);
                temp.$save(null,
                    function success(data) {
                        users.push(data);

                        defer.resolve(users);
                    },
                    function error(data) {
                        defer.reject(data);
                    });

                return defer.promise;
            };

            this.update = function(user) {
                var defer = $q.defer();

                var found = currentUser;
                if(!currentUser || user.id !== currentUser.id) {
                    // Find it in the list and update it
                    found = $filter('filter')(users, {id: user.id}, true);
                    if(found && found.length === 1) {
                        found = found[0];
                    }
                }

                var temp = new UserResource(found);
                temp.$update({}, function(data) {
                    found = data;
                    defer.resolve(found);
                });

                return defer.promise;
            };

            this.changePassword = function(id, password) {
                // Find it in the list and update it
                var found = $filter('filter')(users, {id: id}, true);
                if(found && found.length === 1) {
                    found = found[0];

                    found.password = password;

                    return this.update(found);
                }

                return false;
            };
        }
    ]);
