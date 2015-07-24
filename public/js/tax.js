skeletonControllers.controller('TaxCtrl', ['$scope', '$q', 'TaxService', 'Utils',
    function($scope, $q, TaxService, Utils) {
        $scope.taxes = [];
        $scope.query = "";
        $scope.enableFilter = false;
        $scope.opened = false;

        var getData = function() {
            return $scope.taxes;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = Utils.createNgTable({sorting:{code:'asc'}}, getData);

        $scope.create = function() {
            var selector = "#tax-create";
            var inputs = $(selector).find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);
            var createPromise = TaxService.create(data);

            Utils.create(selector, createPromise);

            createPromise.then(function(taxes) {
                $scope.taxes = taxes;
                $scope.tableParams.reload();
            });
        };

        $scope.deleteTax = function(tax) {
            if(confirm(_p("Do you really want to delete '%1'?", [tax.title]))) {
                TaxService.delete(tax).then(function(taxes) {
                    $scope.taxes = taxes;
                    $scope.tableParams.reload();
                });
            }
        };

        $scope.finishedLoading = function() {
            $scope.enableFilter = true;
            $scope.tableParams.reload();
        };

        // Load as soon as possible.
        var queryPromise = TaxService.query();

        queryPromise.then(function(taxes) {
            $scope.taxes = taxes;
        });

        $q.all([queryPromise]).then(function(data) {
            $scope.finishedLoading();
        });
    }
]);

skeletonControllers.controller('TaxDetailsCtrl', ['$scope', '$location', '$window', 'TaxService', 'Utils',
    function($scope, $location, $window, TaxService, Utils) {
        $scope.currentTax = null;

        $scope.deleteTax = function() {
            if(confirm(_p("Do you really want to delete '%1'?", [$scope.currentTax.title]))) {
                TaxService.delete($scope.currentTax).then(function(taxes) {
                    $window.history.back();
                });
            }
        };

        $scope.update = function(newValue, oldValue) {
            TaxService.update($scope.currentTax);
        };

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var taxId = Utils.getIdFromUrl($location.absUrl());
        if (taxId) {
            TaxService.get({id: taxId}).then(function(tax) {
                $scope.currentTax = tax;
            });
        }
    }
]);

