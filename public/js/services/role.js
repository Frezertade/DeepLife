skeletonServices
    .service('RoleResource', ['$resource',
        function ($resource) {
            return $resource('/api/roles/:id', {id: '@id'}, {
                update: {method: 'PUT'}
            });
        }
    ])

    .service('RoleService', ['RoleResource', '$q',
        function(RoleResource, $q) {
            var roles = [], currentRole = null, currentRoleId = null;

            this.get = function(params) {
                var defer = $q.defer();

                if(currentRole && currentRoleId === id) {
                    defer.resolve(currentRole);
                } else {
                    RoleResource.get(params, function(data) {
                        currentRole = data;
                        currentRoleId = params.id ? params.id : null;

                        defer.resolve(currentRole);
                    });
                }

                return defer.promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(roles && roles.length) {
                    defer.resolve(roles);
                } else {
                    RoleResource.query().$promise
                        .then(function(data) {
                            roles = data;
                            defer.resolve(roles);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(role) {
                var defer = $q.defer();

                var temp = new RoleResource();
                temp.$delete({id:role.id}, function(data) {
                    angular.forEach(roles, function(u, index) {
                        if(role.id === u.id) {
                            roles.splice(index, 1);
                        }
                    });

                    defer.resolve(roles);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new RoleResource(data);
                temp.$save(null, function(data) {
                    roles.push(data);

                    defer.resolve(roles);
                });

                return defer.promise;
            };

            this.update = function(role) {
                var defer = $q.defer();

                var found = currentRole;
                if(role.id !== currentRole.id) {
                    // Find it in the list and update it
                    found = $filter('filter')(roles, {id: role.id}, true);
                    if(found && found.length === 1) {
                        found = found[0];
                    }
                }

                var temp = new RoleResource(found);
                temp.$update({}, function(data) {
                    found = data;
                    defer.resolve(found);
                });

                return defer.promise;
            };
        }
    ]);
