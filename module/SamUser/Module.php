<?php

namespace SamUser;

use Zend\ModuleManager\Feature;
use Zend\Loader;
use Zend\EventManager\EventInterface;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\Router\RouteMatch;

class Module
{
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $e)
    {
        $app = $e->getParam('application');
        $em  = $app->getEventManager();

        $em->attach(MvcEvent::EVENT_DISPATCH, array($this, 'selectLayoutBasedOnRoute'));
    }

    /**
     * Select the admin layout based on route name
     *
     * @param  MvcEvent $e
     * @return void
     */
    public function selectLayoutBasedOnRoute(MvcEvent $e)
    {
        $app    = $e->getParam('application');
        $sm     = $app->getServiceManager();
        $config = $sm->get('config');

        $match      = $e->getRouteMatch();
        $controller = $e->getTarget();

        if (!$match instanceof RouteMatch
            || 0 !== strpos($match->getMatchedRouteName(), 'zfcuser/login')
            || $controller->getEvent()->getResult()->terminate()
        ) {
   
            return;
        }

        $layout     = 'layout/layout-login';
        $controller->layout($layout);
    }
}
