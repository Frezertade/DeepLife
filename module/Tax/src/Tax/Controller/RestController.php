<?php

namespace Tax\Controller;

use Zend\View\Model\JsonModel;
use Zend\Validator\ValidatorChain;
use DoctrineModule\Validator\ObjectExists;

use Application\Controller\BasicRestController;
use Taxe\Entity\Taxe;

class RestController extends BasicRestController
{
    // Entity used to fetch data
    protected $entity = 'Tax\Entity\Tax';

    // Max results
    protected $maxResults = 1000;

    // Cache time
    protected $cacheTime = 3600;

    // Select fields
    protected $selectFields = 'id,code,title,rate,valid';

    // Returned index
    protected $index = 'taxes';
}
