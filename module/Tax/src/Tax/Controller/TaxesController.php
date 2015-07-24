<?php

namespace Tax\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class TaxesController extends AbstractActionController {
    /**
     * User list / default action
     */
    public function indexAction() {
        $createForm = $this->getServiceLocator()->get('EntityForm')->getForm('Tax\Entity\Tax', 'create()');

        return array(
            'form' => $createForm,
        );
    }

    public function detailsAction() {
        $id = (int)$this->params()->fromRoute('id');
        if(!$id)
            $this->redirect()->toRoute('taxes');

        return array();
    }
}
