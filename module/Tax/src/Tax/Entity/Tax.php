<?php

namespace Tax\Entity;

use Doctrine\ORM\Mapping as ORM;

use Zend\Form\Annotation as ZFA;

/**
 * @ORM\Entity
 * @ORM\Table(name="tax")
 *
 * @ZFA\Name("tax-form")
 */
class Tax
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     *
     * @ZFA\Filter({"name":"StringTrim"})
     * @ZFA\Required(false)
     * @ZFA\Attributes({"type":"hidden", "data-ng-model":"id"})
     */
    protected $id = null;

    /**
     * @ORM\Column(type="string", name="code", length=5, unique=false, nullable=false)
     *
     * @ZFA\Filter({"name":"StringTrim"})
     * @ZFA\Required(true)
     * @ZFA\Validator({"name":"StringLength", "options":{"min":1, "max":5}})
     * @ZFA\Attributes({"type":"text", "data-ng-model":"currentTax.code"})
     * @ZFA\Options({"label":"Code"})
     */
    protected $code = null;

    /**
     * @ORM\Column(type="string", name="title", length=100, unique=false, nullable=false)
     *
     * @ZFA\Filter({"name":"StringTrim"})
     * @ZFA\Required(true)
     * @ZFA\Validator({"name":"StringLength", "options":{"min":1, "max":100}})
     * @ZFA\Attributes({"type":"text", "data-ng-model":"currentTax.title"})
     * @ZFA\Options({"label":"Title"})
     */
    protected $title = null;

    /**
     * @ORM\Column(type="decimal", name="rate", scale=3, precision=8, unique=false, nullable=false)
     *
     * @ZFA\Filter({"name":"StringTrim"})
     * @ZFA\Required(true)
     * @ZFA\Attributes({"type":"number", "step":"0.001", "data-ng-model":"currentTax.rate"})
     * @ZFA\Options({"label":"Rate"})
     */
    protected $rate = null;

    /**
     * @ORM\Column(type="date", name="valid", nullable=false)
     *
     * @ZFA\Type("Application\Form\Element\Date")
     * @ZFA\Filter({"name":"StringTrim"})
     * @ZFA\Required(true)
     * @ZFA\Attributes({"data-ng-model":"currentTax.date"})
     * @ZFA\Options({"label":"Valid From"})
     */
    protected $valid = null;


    public function __construct()
    {
        $this->valid = new \DateTime('now');
    }

    public function toArray()
    {
        return array(
            'id' => $this->getId(),
            'code' => $this->getCode(),
            'title' => $this->getTitle(),
            'rate' => $this->getRate(),
            'valid' => $this->getValid(),
        );
    }


    /**
     * -----------------------------------------------------------------------------
     * GETTERS / SETTERS
     * -----------------------------------------------------------------------------
     */

    /**
     * Gets the value of id.
     *
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Sets the value of id.
     *
     * @param mixed $id the id
     *
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Gets the value of code.
     *
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Sets the value of code.
     *
     * @param mixed $code the code
     *
     * @return self
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Gets the value of title.
     *
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Sets the value of title.
     *
     * @param mixed $title the title
     *
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Gets the value of rate.
     *
     * @return mixed
     */
    public function getRate()
    {
        return $this->rate;
    }

    /**
     * Sets the value of rate.
     *
     * @param mixed $rate the rate
     *
     * @return self
     */
    public function setRate($rate)
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * Gets the value of valid.
     *
     * @return mixed
     */
    public function getValid()
    {
        return isset($this->valid) ? $this->valid->format('Y-m-d') : $this->valid;
    }

    /**
     * Gets the value of valid in raw datetime.
     *
     * @return mixed
     */
    public function getValidRaw()
    {
        return $this->valid;
    }

    /**
     * Sets the value of valid.
     *
     * @param mixed $valid the valid
     *
     * @return self
     */
    public function setValid($valid)
    {
        if ($valid instanceof \DateTime) {
            return $this->setValidRaw($valid);
        }

        if (null !== $valid) {
            $this->valid = \DateTime::createFromFormat('Y-m-d', $valid);
        } else {
            $this->valid = $valid;
        }

        return $this;
    }

    /**
     * Sets the raw value of valid.
     *
     * @param mixed $valid the valid
     *
     * @return self
     */
    public function setValidRaw($valid)
    {
        $this->valid = $valid;

        return $this;
    }
}
