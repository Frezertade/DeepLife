skeletonDirectives.directive('uiEditableCheck', function() {
    return {
        restrict: 'A',
        scope: {
            model: '=ngModel',
        },
        template: '<input type="checkbox" ng-model="model" />'
    };
});
