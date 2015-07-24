<?php

namespace Application\Service;

use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

use Zend\Form\Annotation\AnnotationBuilder;
use Zend\Form\Fieldset;
use DoctrineModule\Stdlib\Hydrator\DoctrineObject;

class EntityForm implements ServiceLocatorAwareInterface {

    protected $services;
    private $translator;

    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->services = $serviceLocator;
    }

    public function getServiceLocator()
    {
        return $this->services;
    }

    public function __construct()
    {
        // Empty translator to tell POEdit to hook on our translations
        $this->translator = new \Zend\I18n\Translator\Translator;
    }

    public function getForm($entity, $action = null, $id = null) {
        $object_manager = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');

        $formObject = null;
        if($id) {
            $formObject = $object_manager->find($entity, $id);
        } else {
            $formObject = new $entity;
        }
        $builder = new AnnotationBuilder();
        $form = $builder->createForm($entity);
        $form->setHydrator(new DoctrineObject($object_manager, $entity));
        $form->setObject($formObject);
        // If we have a Doctrine Select, we need to set the object_manager on this element
        foreach($form as $element) {
            if($element instanceof \DoctrineORMModule\Form\Element\EntitySelect) {
                $elementOptions = $element->getOptions();
                $elementOptions['object_manager'] = $object_manager;
                $element->setOptions($elementOptions);
            }

            // Fieldset are generally used with composedobject in our setup. Knowing this,
            // we must set the object for each composedobject if we want to save it.
            if($element instanceof \Zend\Form\FieldSet) {
                $method = 'get' . ucfirst($element->getName());
                if(is_callable(array($formObject, $method))) {
                    $newObject = $formObject->$method();
                    if($newObject) {
                        $element->setHydrator(new DoctrineObject($object_manager, get_class($newObject)));
                        $element->setObject($newObject);
                    }
                }
            }
        }

        if($id)
            $form->bind($formObject);

        $actions = new Fieldset('actions');
        $actions->add(array(
            'name' => 'close',
            'attributes' => array('type' => 'button', 'value' => 'Close', 'class' => 'form-control btn btn-default', 'data-dismiss' => "modal")
        ));
        $actions->add(array(
            'name' => 'submit',
            'attributes' => array('type' => 'submit', 'value' => 'Save', 'class' => 'form-control btn btn-primary')
        ));

        $form->add($actions);

        if($action)
            $form->setAttribute('data-ng-submit', $action);

        return $form;
    }

    public function hideElement($form, $fieldName, $value = null)
    {
        if(!$form instanceof \Zend\Form\Form)
            return false;

        $field = null;
        if(is_array($fieldName)) {
            $source = $form;
            foreach($fieldName as $name) {
                $field = $source->get($name);
                $source = $field;
            }
        } else {
            $field = $form->get($fieldName);
        }

        if(null !== $field) {
            $field->setAttribute('type', 'hidden');

            if(null !== $value)
                $field->setValue($value);

            // We need to remove the label manually
            $fieldOpt = $field->getOptions();
            $fieldOpt['label'] = '';
            $field->setOptions($fieldOpt);

            return true;
        }

        return false;
    }
}
