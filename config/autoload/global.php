<?php

return array(
  	'doctrine' => array(
    	'connection' => array(
      		'orm_default' => array(
        		'driverClass' => 'Doctrine\DBAL\Driver\PDOMySql\Driver',
        		'params' => array('driverOptions' => array(1002 => 'SET NAMES utf8'))
    		)
    	),
    )
);
