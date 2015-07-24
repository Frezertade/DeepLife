<?php

namespace Application\Form\View\Helper;

use Zend\Form\ElementInterface;
use Zend\Form\View\Helper\AbstractHelper;

class FormTypeahead extends AbstractHelper
{
    protected $template = '<input type="text" name="%s" %s ng-model="%s" typeahead-wait-ms="250" typeahead-min-length="3" typeahead="%s | filter:$viewValue | limitTo:300" class="%s" placeholder="%s">';

    public function render(ElementInterface $element)
    {
        // Render your element here
        $options = $element->getOptions();
        $value = $element->getValue();
        $name = $element->getName();

        $attributes = $element->getAttributes();

        $required = isset($attributes['required']) ? $attributes['required'] == 'required' : false;
        $required = $required ? "required='required'" : "";

        // Class attribute
        $classes = $attributes['class'];

        // Model
        $ngModel = $attributes['data-ng-model'];

        // Options
        $ngOptions = $attributes['data-ng-options'];

        // can_create flag to add a creation button
        $canCreate = isset($options['can_create']) ? $options['can_create'] : false;
        $createFunc = isset($attributes['create_func']) ? $attributes['create_func'] : false;
        if($canCreate && $createFunc) {
            $this->template = '<div class="input-group date">' . $this->template . '<span class="input-group-btn"><button class="btn btn-success" ng-click="'.$createFunc.'"><i class="glyphicon glyphicon-plus"></i></button></span></div>';
        }

        return sprintf(
            $this->template,
            $name,
            $required,
            $ngModel,
            $ngOptions,
            $classes,
            $options['empty_option']
        );
    }
}
