<?php

namespace SamUser\Controller;

use Zend\View\Model\JsonModel;

use Application\Controller\BasicRestController;
use SamUser\Entity\User;
use SamUser\Entity\Role;

class RoleRestController extends BasicRestController
{
    // Entity used to fetch data
    protected $entity = 'SamUser\Entity\Role';

    // Max results
    protected $maxResults = 1000;

    // Cache time
    protected $cacheTime = 3600;

    // Select fields
    protected $selectFields = 'id,roleId';

    // Join fields
    protected $joinFields = array(
        'parent' => 'id,roleId',
    );

    // Returned index
    protected $index = 'roles';

    /**
     * @param mixed $data
     * @return JsonModel
     */
    public function create($data)
    {
        $request = $this->getRequest();
        if(!$request->isPost()) {
            $this->getResponse()->setStatusCode(500)->setReasonPhrase("Missing parameter.");
            return new JsonModel();
        }

        $em = $this->getEntityManager();

        // Validate using the form
        $form = $this->getServiceLocator()->get('EntityForm')->getForm($this->entity);
        $form->setData($data);
        if(!$form->isValid()) {
            $this->getResponse()->setStatusCode(500);
            return new JsonModel(array('messages' => $form->getMessages()));
        }

        // Get linked object
        $object = $form->getData();

        // Save to DB
        $em->persist($object);
        $em->flush();

        return new JsonModel($object->toArray());
    }

    public function update($id, $data)
    {
        // Validate that we have a correctly formed ajax request
        if(!$this->getIdValidator()->isValid($id, array('id' => $id))) {
            $this->getResponse()->setStatusCode(500)->setReasonPhrase("Invalid id provided.");
            return new JsonModel();
        }

        // Get values
        $roleId = isset($data['roleId']) ? (string)$data['roleId'] : null;
        $parent = isset($data['parent']) ? (int)$data['parent'] : null;

        $role = $this->getEntityManager()->find('SamUser\Entity\Role', $id);

        // Update only passed information
        $em = $this->getEntityManager();

        if($roleId)
            $role->setRoleId($roleId);

        if($parent)
            $role->setParent($em->find($this->entity, $parent));

        $em->flush();

        return new JsonModel($role->toArray());
    }
}
