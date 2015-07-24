<?php

namespace SamUser\Controller;

use Zend\View\Model\JsonModel;
use Zend\Validator\ValidatorChain;
use Zend\Validator\EmailAddress;
use Zend\Validator\StringLength;
use DoctrineModule\Validator\ObjectExists;
use DoctrineModule\Validator\UniqueObject;
use Zend\Crypt\Password\Bcrypt;

use Application\Controller\BasicRestController;
use SamUser\Entity\User;
use SamUser\Entity\Role;

class RestController extends BasicRestController
{
    // Entity used to fetch data
    protected $entity = 'SamUser\Entity\User';

    // Max results
    protected $maxResults = 1000;

    // Cache time
    protected $cacheTime = 3600;

    // Select fields
//    protected $selectFields = 'id,email,firstName,sureName';

    // Join fields
    protected $joinFields = array(
        'roles' => 'id'
    );

    // Returned index
    protected $index = 'users';

    protected $cost = 14;

    /**
     * Validators
     */
    protected function getEmailValidator() {
        $chain = new ValidatorChain();
        $chain->attach(new StringLength(array('encoding' => 'utf-8',
                                              'min' => 2,
                                              'max' => 199)));
        $chain->attach(new EmailAddress());
        $chain->attach(new UniqueObject(array('object_repository' => $this->getEntityManager()->getRepository('SamUser\Entity\User'),
                                              'object_manager' => $this->getEntityManager(),
                                              'fields' => array('email'))));
        return $chain;
    }

    public function create($data)
    {
//        $request = $this->getRequest();
//        if(!$request->isPost()) {
//            $this->getResponse()->setStatusCode(500)->setReasonPhrase("Missing parameter.");
//            return new JsonModel();
//        }

//        $em = $this->getEntityManager();
        // Validate using the form
//        $form = $this->getServiceLocator()->get('EntityForm')->getForm($this->entity);
//        $form->setData($data);
        return new JsonModel(array($data));
//        if(!$form->isValid()) {
//            $this->getResponse()->setStatusCode(500);
////            return new JsonModel(array('messages' => $form->getMessages()));
//            return new JsonModel(array($data));
//        }
//        // Get linked object
//        $object = $form->getData();
//        // Save password
//        $bcrypt = new Bcrypt;
//        $bcrypt->setCost($this->cost);
//        $pass = $bcrypt->create($object->getPassword());
//        $object->setPassword($pass);
//
//        // Set display name
//        $object->setDisplayName("{$object->getFirstName()} {$object->getmiddleName()}");
//
//        // Set default user role
//        $userRole = $em->getRepository('SamUser\Entity\Role')->findOneBy(array('roleId' => 'user'));
//        $object->addRole($userRole);
//
//        // Save to DB
//        $em->persist($object);
//        $em->flush();
//
//        // Invalidate cache
//        $this->invalidateCache();
//
//        return new JsonModel($object->toArray());
    }

    public function update($id, $data)
    {
        parent::update($id, $data);

        // Get values
        $email = isset($data['email']) ? (string)$data['email'] : null;
        $password = isset($data['password']) ? (string)$data['password'] : null;
        $firstName = isset($data['firstName']) ? (string)$data['firstName'] : null;
        $lastName = isset($data['lastName']) ? (string)$data['lastName'] : null;
        $rolesSlugs = isset($data['roles']) ? (array)$data['roles'] : null;

        $user = $this->getEntityManager()->find('SamUser\Entity\User', $id);

        // Update only passed information
        $em = $this->getEntityManager();
        if($rolesSlugs) {
          // First remove all elements
            $roles = $user->getRoles();
            foreach ($roles as $role) {
                $roles->removeElement($role);
            }
            $em->flush();

            // Then add the ones checked
            foreach ($rolesSlugs as $slug) {
                $role = $this->getEntityManager()->find('SamUser\Entity\Role', $slug);
                $user->addRole($role);
            }
        }

        if($email)
            $user->setEmail($email);

        if($password) {
            $bcrypt = new Bcrypt;
            $bcrypt->setCost($this->cost);
            $pass = $bcrypt->create($password);
            $user->setPassword($pass);
        }

        if($firstName)
            $user->setFirstName($firstName);

        if($lastName)
            $user->setLastName($lastName);

        $em->flush();

        // Invalidate cache
        $this->invalidateCache();

        return new JsonModel($user->toArray());
    }
}
