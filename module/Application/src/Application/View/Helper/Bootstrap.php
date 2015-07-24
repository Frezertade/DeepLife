<?Php

namespace Application\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Bootstrap extends AbstractHelper {
  public function __invoke() {
    return $this;
  }

  public function row($element) {
    $output = '';

    $output .= '<div class="form-group">';

    if($element instanceof \Zend\Form\FieldSet) {
      $output .= "<fieldset>";
      $fieldsetLabel = $element->getLabel();
      if($fieldsetLabel)
        $output .= "<legend>{$fieldsetLabel}</legend>";
      foreach($element->getElements() as $subelement) {
        $output .= $this->row($subelement);
      }
      $output .= "</fieldset>";
    }
    else {
      $output .= $this->renderElement($element);
    }

    $output .= '</div>';

    return $output;
  }

  public function renderElement($element) {
    // Check some custom options
    $prepend = $element->getOption('prepend');
    $append = $element->getOption('append');

    // Add Bootstrap class for element, if not present
    if(!$element->hasAttribute('class'))
      $element->setAttribute('class', 'form-control');

    // Put everything together
    return sprintf("%s\n%s\n%s\n%s\n%s\n%s\n%s",
      ($element->getLabel()) ? $this->view->formLabel($element) : '',
      ($prepend || $append) ? '<div class="input-group">' : '', // If we have a custom prepend or append span, we need an input-group
      $prepend,
      $this->view->formElement($element),
      $append,
      ($prepend || $append) ? '</div>' : '',
      $this->errors($element)
    );
  }

  public function errors($element) {
    return '<div class="alert alert-danger errors hide"></button></div>';
  }

  public function openTag($form, $class = null) {
    if(isset($class))
      $form->setAttribute('class', $class);
    return $this->view->form()->openTag($form);
  }

  public function closeTag($form) {
    return $this->view->$form()->closeTag();
  }

  public function form($form) {
    $form->prepare();

    $output = $this->openTag($form);

    foreach ($form as $element) {
      $output .= $this->row($element);
    }

    $output .= $this->closeTag($form);
    return $output;
  }
}

?>
