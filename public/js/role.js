skeletonControllers.controller('RoleCtrl', ['$scope', '$q', 'RoleService', 'Utils',
    function($scope, $q, RoleService, Utils) {
        $scope.roles = [];
        $scope.query = "";
        $scope.enableFilter = false;

        var getData = function() {
            return $scope.roles;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = Utils.createNgTable({sorting:{roleId:'asc'}}, getData);

        $scope.create = function() {
            var selector = "#role-create";
            var inputs = $(selector).find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);
            var createPromise = RoleService.create(data);

            Utils.create(selector, createPromise);

            createPromise.then(function(roles) {
                $scope.roles = roles;
                $scope.tableParams.reload();
            });
        };

        $scope.deleteRole = function(role) {
            if(confirm(_p("Do you really want to delete '%1'?", [role.roleId]))) {
                RoleService.delete(role).then(function(roles) {
                    $scope.roles = roles;
                    $scope.tableParams.reload();
                });
            }
        };

        $scope.finishedLoading = function() {
            $scope.enableFilter = true;
            $scope.tableParams.reload();
        };

        // Load as soon as possible.
        var queryPromise = RoleService.query();

        queryPromise.then(function(roles) {
            $scope.roles = roles;
        });

        $q.all([queryPromise]).then(function(data) {
            $scope.finishedLoading();
        });
    }
]);

skeletonControllers.controller('RoleDetailsCtrl', ['$scope', '$location', '$window', 'RoleService', 'Utils',
    function($scope, $location, $window, RoleService, Utils) {
        $scope.currentRole = null;
        $scope.availableRoles = null;

        $scope.deleteRole = function(role) {
            if(confirm(_p("Do you really want to delete '%1'?", [role.roleId]))) {
                UserService.delete($scope.currentUser).then(function(taxes) {
                    $window.history.back();
                });
            }
        };

        $scope.update = function(newValue, oldValue) {
            RoleService.update($scope.currentRole);
        };

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var roleId = Utils.getIdFromUrl($location.absUrl());
        if(roleId) {
            RoleService.get({id: roleId}).then(function(role) {
                $scope.currentRole = role;
            });
        }
    }
]);
