<?php

namespace Tax;

return array(
    'router' => array(
        'routes' => array(
            'taxes' => array(
                'type'    => 'Literal',
                'options' => array(
                    'route'    => '/taxes',
                    'defaults' => array(
                        '__NAMESPACE__' => 'Tax\Controller',
                        'controller'    => 'Taxes',
                        'action'        => 'index',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '/[:action[/:id]]',
                            'constraints' => array(
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id'     => '[0-9]+',
                            ),
                            'defaults' => array(
                            ),
                        ),
                    ),
                ),
            ),
            'taxesApi' => array(
                'type'    => 'Segment',
                'options' => array(
                    'route'    => '/api/taxes[/:id]',
                    'constraints' => array(
                        'id'     => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Tax\Controller\Rest',
                    ),
                ),
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Tax\Controller\Taxes' => 'Tax\Controller\TaxesController',
            'Tax\Controller\Rest' => 'Tax\Controller\RestController',
        ),
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
    'doctrine' => array(
        'driver' => array(
            __NAMESPACE__ . '_driver' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Entity')
            ),
            'orm_default' => array(
                'drivers' => array(
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver')
            )
        )
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
);
