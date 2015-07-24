<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2013 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

$translator = new \Zend\I18n\Translator\Translator;

// Get current session language
$language = new \Zend\Session\Container('language');
$locale = isset($language->current) ? $language->current : "fr_CA";
$redirect = isset($_SERVER) && isset($_SERVER['REDIRECT_URL']) ? $_SERVER['REDIRECT_URL'] : "/";

return array(
    'router' => array(
        'routes' => array(
            'home' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
            // The following is a route to simplify getting started creating
            // new controllers and actions without needing to create a new
            // module. Simply drop new controllers in, and you can access them
            // using the path /application/:controller/:action
            'application' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/application',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Application\Controller',
                        'controller'    => 'Index',
                        'action'        => 'index',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '/[:action]',
                            'constraints' => array(
                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ),
                            'defaults' => array(
                                '__NAMESPACE__' => 'Application\Controller',
                                'controller'    => 'Index',
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
           // 'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
           // 'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'translator' => 'Zend\I18n\Translator\TranslatorServiceFactory',
            'navigation' => 'Zend\Navigation\Service\DefaultNavigationFactory',
            'secondary_navigation' => 'Application\Service\SecondaryNavigationFactory',
        ),
        'invokables' => array(
            'EntityForm' => 'Application\Service\EntityForm',
        ),
    ),
    'translator' => array(
        //'locale' => 'fr_CA',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo'
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Application\Controller\Index' => 'Application\Controller\IndexController'
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    'view_helpers' => array(
        'invokables' => array(
            'bootstrap' => 'Application\View\Helper\Bootstrap',
            'formelement' => 'Application\Form\View\Helper\FormElement',
            'formdate' => 'Application\Form\View\Helper\FormDate',
            'formtypeahead' => 'Application\Form\View\Helper\FormTypeahead',
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
    'navigation' => array(
        'default' => array(
            array(
                'label' => 'Data',
                'uri' => '#',
                'class' => 'category-title',
            ),
            array(
                'label' => 'Taxes',
                'route' => 'taxes',
                'pages' => array(
                    array(
                        'label' => 'Tax Details',
                        'route' => 'taxes/default',
                        'action' => 'details',
                    ),
                ),
            ),
        ),
        'secondary' => array(
            array(
                'label' => 'Administration',
                'uri' => '#',
                'class' => 'top-menu-category',
            ),
            array(
                'label' => 'Users',
                'route' => 'users',
            ),
            array(
                'label' => 'Roles',
                'route' => 'roles',
            ),
            array(
                'label' => 'Change Language',
                'uri' => '/application/language?to=' . ($locale =='en_US'  ? 'fr_CA' : 'en_US' ) . '&redirect=' . $redirect,
            ),
        ),
    ),
);
