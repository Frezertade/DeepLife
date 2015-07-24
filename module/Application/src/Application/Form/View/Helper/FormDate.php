<?php

namespace Application\Form\View\Helper;

use Zend\Form\ElementInterface;
use Zend\Form\View\Helper\AbstractHelper;

class FormDate extends AbstractHelper
{
    public function render(ElementInterface $element)
    {
        // Render your element here
        $attributes = $element->getAttributes();
        $options = $element->getOptions();
        $value = $element->getValue();
        $name = $element->getName();
        $required = isset($attributes['required']) ? $attributes['required'] == 'required' : false;

        return '
            <div class="input-group date">
                <input type="text" name="'.$name.'" class="'.$attributes['class'].'" datepicker-popup="yyyy-MM-dd" ng-model="dt_'.$name.'" is-open="'.$name.'_opened" ng-required="'.$required.'" close-text="Close" max="max_'.$name.'" />
                <span class="input-group-btn">
                    <button class="btn btn-default" ng-click="'.$name.'_open($event)"><i class="glyphicon glyphicon-th"></i></button>
                </span>
            </div>
        ';
    }
}
