skeletonServices
    .service('TaxResource', ['$resource',
        function ($resource) {
            return $resource('/api/taxes/:id', {id: '@id'}, {
                update: {method: 'PUT'}
            });
        }
    ])

    .service('TaxService', ['TaxResource', '$q',
        function(TaxResource, $q) {
            var taxes = [], currentTax = null, currentTaxId = null;

            this.get = function(params) {
                var defer = $q.defer();

                if(currentTax && currentTaxId === id) {
                    defer.resolve(currentTax);
                } else {
                    TaxResource.get(params, function(data) {
                        currentTax = data;
                        currentTaxId = params.id ? params.id : null;

                        defer.resolve(currentTax);
                    });
                }

                return defer.promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(taxes && taxes.length) {
                    defer.resolve(taxes);
                } else {
                    TaxResource.query().$promise
                        .then(function(data) {
                            taxes = data;
                            defer.resolve(taxes);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(tax) {
                var defer = $q.defer();

                var temp = new TaxResource();
                temp.$delete({id:tax.id}, function(data) {
                    angular.forEach(taxes, function(u, index) {
                        if(tax.id === u.id) {
                            taxes.splice(index, 1);
                        }
                    });

                    defer.resolve(taxes);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new TaxResource(data);
                temp.$save(null, function(data) {
                    taxes.push(data);

                    defer.resolve(taxes);
                });

                return defer.promise;
            };

            this.update = function(tax) {
                var defer = $q.defer();

                var found = currentTax;
                if(tax.id !== currentTax.id) {
                    // Find it in the list and update it
                    found = $filter('filter')(taxes, {id: tax.id}, true);
                    if(found && found.length === 1) {
                        found = found[0];
                    }
                }

                var temp = new TaxResource(found);
                temp.$update({}, function(data) {
                    found = data;
                    defer.resolve(found);
                });

                return defer.promise;
            };
        }
    ]);

