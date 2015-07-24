<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Session\Container;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }

    public function languageAction() {
//    	$to = $this->params()->fromQuery('to');
////
//		$language = new Container('language');
//		$language->current = $to;

		$redirectUrl = $this->params()->fromQuery('redirect');
    	$this->redirect()->toUrl(htmlspecialchars($redirectUrl));
    }
}
