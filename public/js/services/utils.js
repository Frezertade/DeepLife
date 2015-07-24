skeletonServices.service('Utils', ['$filter', 'ngTableParams', function($filter, ngTableParams) {
    this.getIdFromUrl = function(absUrl) {
        var id = null;
        var url = absUrl.split("/");
        url = url.splice(3, url.length-3); // Remove start of url

        // Here we should have at least 2 items in the array. If not, it's the root and we won't have
        // any id provied.
        if(url.length > 1 && !isNaN(parseFloat(url[url.length-1])) && isFinite(url[url.length-1]))
            id = url[url.length-1]; // ID is last argument

        return id;
    };

    this.formErrorMessages = function(messages, formSelector) {
        console.log(messages, messages.length);
        if(messages && messages instanceof Array) {
            angular.forEach(messages, function(message, input) {
                var inputInError = $.grep(formSelector.find(':input'), function(e) { return e.name == input; });
                var errorMessage = $(inputInError).closest('div[class^="form-group"]').find('.errors').removeClass('hide');
                var appendedMessage = "";
                angular.forEach(message, function(msg) {
                    appendedMessage += msg + '\n<br/>';
                });

                $(errorMessage).html(appendedMessage);
                $(inputInError).parent().addClass('.has-error');
            });
        } else {
            formSelector.find('.form-errors').html(messages).removeClass('hide');
        }

        return true;
    };

    this.JSONObjFromInputs = function(inputs) {
        var data = {};
        angular.forEach(inputs, function(input) {
            var el = $(input);
            var name = el.attr('name');
            var type = el.attr('type');
            var multiple = el.attr('multiple');
            var value;

            // Remove the brackets from array input
            if(name && name.indexOf('[') !== -1 && name.indexOf(']') !== -1)
                name = name.substr(0, name.indexOf('['));

            // We need to check 'checked' on checkboxes
            if(type === "checkbox")
                value = el.prop('checked');
            else if(multiple)
                value = el.val();
            else
                value = el.val().trim();

            if(name !== undefined && value !== undefined)
                data[name] = value;
        });

        return data;
    };

    this.formatDataToSelect = function(data, outputField, selected) {
        var out = {};

        // Format each item to be
        // {id: outputFieldValue}
        angular.forEach(data, function(item) {
            var output = "";

            if(typeof outputField === "object") {
                angular.forEach(outputField, function(outField) {
                    if(output.length !== 0) output += "-";
                    output += item[outField];
                });
            } else {
                output = item[outputField];
            }
            out[item.id] = output;
        });

        // Add selected item if selected
        if(selected)
            out.selected = selected.id;

        return out;
    };

    this.openModal = function(selector, params) {
        var modal = $(selector);

        if(params && params.field && params.value)
            modal.find("input[name='"+initField+"']").val(initValue);

        modal.find(".errors").addClass('hide').html("");
        modal.modal("show");
    };

    this.disable = function(selector) {
        $(selector).prop("disabled",!$(selector).prop("disabled"));
    };

    this.JSONObjFromForm = function(form) {
        var o = {};
        var a = form.serializeArray();
        $.each(a, function() {
            if(this.name.indexOf('[') != -1) {
                var parts = this.name.split('[');
                var left = parts[0];
                var right = parts[1].substr(0, parts[1].length-1);
                if (o[left] !== undefined) {
                    o[left][right] = this.value || '';
                } else {
                    o[left] = {};
                    o[left][right] = this.value || '';
                }
            } else {
                addToArray(o, this);
            }
        });
        return o;
    };

    function addToArray(array, object) {
        if (array[object.name] !== undefined) {
            if (!array[object.name].push) {
                array[object.name] = [array[object.name]];
            }
            array[object.name].push(object.value || '');
        } else {
            array[object.name] = object.value || '';
        }
    }

    this.create = function(selector, promise) {
        var $selector = $(selector);
        var self = this;

        // Disable inputs
        this.disable(selector + " .modal-footer :input");

        // Reset errors
        $selector.find(".errors").addClass('hide').html("");

        promise
            .then(function(data) {
                $selector.find("form")[0].reset();
                $selector.modal('hide');
            })
            .catch(function(data) {
                if(data && data.data && data.data.messages) {
                    self.formErrorMessages(data.data.messages, $selector.find('form'));
                }
            }).
            finally(function() {
                // Enable inputs
                self.disable(selector + " .modal-footer :input");
            });
    };

    this.createNgTable = function(params, data) {
        return new ngTableParams({
            page: params.page ? params.page : 1,
            count: params.count ? params.count : 25,
            filter: {},
            sorting: params.sorting ? params.sorting : {id: 'asc'}
        }, {
            total: function () { return data().length; }, // length of data
            getData: function($defer, params) {
                var temp = data();

                if(temp) {
                    // use build-in angular filter
                    var filteredData = params.filter() ? $filter('filter')(temp, params.filter()) : temp;
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                    params.total(orderedData.length); // set total for recalc pagination

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            },
            $scope: { $data: {} }
        });
    };
}]);
