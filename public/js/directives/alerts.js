skeletonDirectives.config(['$provide', '$httpProvider', '$compileProvider', function($provide, $httpProvider, $compileProvider) {
    var elementsList = $();

    var toggleShowElementList = function() {
        elementsList.toggleClass('hide').toggleClass('show');
    };

    var showMessage = function(content, cl, time) {
        toggleShowElementList();
        $('<div/>')
            .addClass('message')
            .addClass(cl)
            .hide()
            .fadeIn('fast')
            .delay(time)
            .fadeOut('fast', function() { $(this).remove(); toggleShowElementList(); })
            .appendTo(elementsList)
            .text(content);
    };

    $httpProvider.responseInterceptors.push(['$timeout', '$q', function($timeout, $q) {
        return function(promise) {
            return promise.then(function(successResponse) {
                if (successResponse.config.method.toUpperCase() != 'GET')
                    showMessage('Success!', 'alert alert-success', 5000);
                return successResponse;

            }, function(errorResponse) {
                switch (errorResponse.status) {
                    case 401:
                        showMessage('Wrong usename or password', 'alert alert-danger', 20000);
                        break;
                    case 403:
                        showMessage('Access forbidden to ' + errorResponse.config.url, 'alert alert-danger', 20000);
                        break;
                    case 500:
                        var message = "";
                        if(typeof errorResponse.data == "object" && errorResponse.data.detail)
                            message = errorResponse.data.detail;
                        if(typeof errorResponse.data == "object" && errorResponse.data.messages)
                            message = errorResponse.data.messages;
                        else
                            message = errorResponse.data;
                        showMessage('Server internal error: ' + message, 'alert alert-danger', 20000);
                        break;
                    case 0:
                        break;
                    default:
                        showMessage('Error ' + errorResponse.status + ': ' + errorResponse.data, 'alert alert-danger', 20000);
                }
                return $q.reject(errorResponse);
            });
        };
    }]);

    $compileProvider.directive('appMessages', function() {
        var directiveDefinitionObject = {
            link: function(scope, element, attrs) { elementsList.push($(element)); }
        };
        return directiveDefinitionObject;
    });
}]);
