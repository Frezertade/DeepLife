skeletonDirectives.directive('uiEditable', ['$timeout', '$compile', function ($timeout, $compile) {
    return {
        restrict: 'A',
        require: '?ngModel',
        transclude: true,
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            scope.$watch(
                function() { return ngModel.$modelValue; },
                function(modelValue, oldModelValue) {
                    // We remove the <span> tags added by angular for the transcluded data
                    var options = {
                        type: !attrs.type ? 'text' : attrs.type,
                        placeholder: __("Click to edit"),
                    };

                    // If we want a textarea, we need the buttons to save. Else we just press
                    // enter to get a new line.
                    if(['textarea', 'masked', 'select', 'datepicker'].indexOf(options['type']) !== -1) {
                        options['cancel'] = 'Cancel';
                        options['submit'] = 'OK';

                        switch(options['type']) {
                            case 'select':
                                options['data'] = attrs.data;
                                break;
                            case 'masked':
                                options['mask'] = attrs.mask;
                                break;
                        }
                    }

                    //Formatting of jEditable fields so that they take full width.
                    //We also need to add the options['width'] = 'none' and options['height'] = 'none'
                    options['cssclass'] = 'inplace-edit';

                    // If we have a select, our data will come async. So we must wait till we get it
                    // before using jeditable.
                    if (attrs.type == "select") {
                        attrs.$observe('data', function(value) {
                            // Update options
                            options['data'] = value;

                            // Not totally synced, wait a bit more.
                            $timeout(function() {
                                // On IE, placeholder doesn't get replaced. Check if it's our case.
                                var currentText = element.children(0).text();
                                if(currentText.indexOf(ngModel.$viewValue) !== -1) {
                                    if(currentText.indexOf(options.placeholder) !== -1) {
                                        element.children(0).text(currentText.replace(options.placeholder, ''));
                                    }
                                }

                                element.children(0).editable(function (val) {
                                    var tVal = $.trim(val);
                                    if (ngModel.$viewValue !== tVal)
                                        scope.$apply(function () {
                                            ngModel.$setViewValue(tVal);
                                            ngModel.$render();

                                            if(attrs.ngChange) {
                                                scope[attrs.ngChange](tVal, ngModel.$viewValue);
                                            }

                                            return true;
                                        });

                                    // We have a select, we must return the string value, not the id
                                    var tempJSON = JSON.parse(attrs.data);

                                    return tempJSON[tVal];
                                }, options);
                            }, 1000);
                        });
                    } else {
                        options['width'] = 'none';
                        options['height'] = 'none';

                        // Wait for iiiiiiit.
                        $timeout(function() {
                            // On IE, placeholder doesn't get replaced. Check if it's our case.
                            var currentText = element.children(0).text();
                            if(currentText.indexOf(ngModel.$viewValue) !== -1) {
                                if(currentText.indexOf(options.placeholder) !== -1) {
                                    element.children(0).text(currentText.replace(options.placeholder, ''));
                                }
                            }

                            element.children(0).editable(function (val) {
                                var tVal = $.trim(val);
                                if (ngModel.$viewValue !== tVal)
                                    scope.$apply(function () {
                                        ngModel.$setViewValue(tVal);
                                        ngModel.$render();

                                        if(attrs.ngChange) {
                                            scope[attrs.ngChange](tVal, ngModel.$viewValue);
                                        }

                                        return true;
                                    });
                                return tVal;
                            }, options);
                        }, 500);
                    }
                }
            );
        }
    };
}]);
