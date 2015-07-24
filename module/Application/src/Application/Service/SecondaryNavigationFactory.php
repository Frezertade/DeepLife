<?php

namespace Application\Service;

use Zend\Navigation\Service\DefaultNavigationFactory;

class SecondaryNavigationFactory extends DefaultNavigationFactory
{
    protected function getName()
    {
        return 'secondary';
    }
}