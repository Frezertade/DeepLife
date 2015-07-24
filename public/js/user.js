skeletonControllers.controller('UserCtrl', ['$scope', '$q', 'UserService', 'Utils',
    function($scope, $q, UserService, Utils) {
        $scope.users = [];
        $scope.query = "";
        $scope.enableFilter = true;

        // Form data
        $scope.passwordForm = {id:0, password:'', passwordConfirm:''};

        var getData = function() {
            return $scope.users;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = Utils.createNgTable({sorting:{email:'asc'}}, getData);

        $scope.create = function() {
            var selector = "#user-create";
            var inputs = $(selector).find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);
            var createPromise = UserService.create(data);

            Utils.create(selector, createPromise);

            createPromise.then(function(users) {
                $scope.users = users;
                $scope.tableParams.reload();
            });
        };

        $scope.savePassword = function() {
            var selector = "#user-password";

            if ($scope.passwordForm.password === "" || $scope.passwordForm.password != $scope.passwordForm.passwordConfirm) {
                return;
            }

            var updatePromise = UserService.changePassword($scope.passwordForm.id, $scope.passwordForm.password);

            if(updatePromise) {
                Utils.create(selector, updatePromise);
            }
        };

        $scope.openModalRoles = function(user) {
            var modal = $("#user-roles");

            // Open modal window
            modal.data("id", user.id).modal("show")
                .find(".modal-body :input")
                .prop("checked", null);

            // Get selected user roles and check them in the modal window
            angular.forEach(user.roles, function(role) {
                modal.find(":input[value='" + role.id + "']").prop("checked", "checked");
            });
        };

        $scope.saveRoles = function() {
            var modal = $("#user-roles");
            var userId = modal.data("id");
            var button = modal.find("button");
            var roles = $.map(modal.find(":input:checked"), function(n) { return $(n).val(); });

            button.attr('disabled','disabled');

            // Find resource and update it
            $scope.users.forEach(function(userResource, index) {
                if (userId === userResource.id) {
                    // Create temp object
                    var temp = new User();
                    temp.roles = roles;

                    temp.$update({id: userId}, function() {
                        userResource.roles = temp.roles;

                        // Close modal window
                        modal.modal("hide");

                        // Enable button
                        button.removeAttr('disabled');
                    });
                }
            });
        };

        $scope.deleteUser = function(user) {
            if(confirm(_p("Do you really want to delete '%1'?", [user.firstName + " " + user.lastName + " <" + user.email + ">"]))) {
                UserService.delete(user).then(function(users) {
                    $scope.users = users;
                    $scope.tableParams.reload();
                });
            }
        };

        $scope.finishedLoading = function(users) {
            $scope.enableFilter = true;
            $scope.tableParams.reload();
        };

        // Load as soon as possible.
        var queryPromise = UserService.query();

        queryPromise.then(function(users) {
            $scope.users = users;
        });

        $q.all([queryPromise]).then(function(data) {
            $scope.finishedLoading();
        });
    }
]);

skeletonControllers.controller('UserDetailsCtrl', ['$scope', '$location', '$window', 'UserService', 'Utils',
    function($scope, $location, $window, UserService, Utils) {
        $scope.currentUser = null;

        $scope.deleteUser = function() {
            if(confirm(_p("Do you really want to delete '%1'?", [$scope.currentUser.firstName + " " + $scope.currentUser.lastName + " <" + $scope.currentUser.email + ">"]))) {
                UserService.delete($scope.currentUser).then(function(users) {
                    $window.history.back();
                });
            }
        };

        $scope.update = function(newValue, oldValue) {
            UserService.update($scope.currentUser);
        };

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var userId = Utils.getIdFromUrl($location.absUrl());
        if(userId) {
            UserService.get({id: userId}).then(function(user) {
                $scope.currentUser = user;
            });
        }
    }
]);


