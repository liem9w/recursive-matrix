<?php

namespace Morsekode\RecursiveMatrix\models;

use Exception;
use craft\elements\Entry;
use craft\elements\MatrixBlock;
use Morsekode\RecursiveMatrix\models\Context;
use Morsekode\RecursiveMatrix\models\Block;

class Block 
{
    public $handle;
    public $entry;
    public $matrixBlock;
    public $hasContainer = false;

    public function __construct(array $attributes = [], MatrixBlock $matrixBlock = null)
    {
        if (!empty($matrixBlock)) {
            $attributes['matrixBlock'] = $matrixBlock;
        }

        foreach ($attributes as $prop => $value) {
            $this->$prop = $value;
        }

        if (!($attributes['matrixBlock'] instanceof MatrixBlock)) {
            throw new Exception("matrixBlock not provided");
        }
    }

    /**
     * Get property from matrixBlock
     */
    public function __get($name)
    {
        if (isset($this->matrixBlock->$name)) {
            return $this->matrixBlock->$name;
        }

        return null;
    }

    /**
     * Get method from matrixBlock
     */
    public function __call($name, $args)
    {
        if ($this->matrixBlock->hasMethod($name)) {
            return $this->matrixBlock->$name(...$args);
        } elseif ($this->matrixBlock->canGetProperty($name)) {
            return $this->matrixBlock->$name;
        }

        return null;
    }

    /**
     * Creates either WrapperBlock or ContentBlock
     *
     * This function parses the $matrixBlock handle for 'Start' or 'End'. In the case that either is found, the block is
     * assumed to be a WrapperBlock. Otherwise, a ContentBlock is created.
     *
     * @param   MatrixBlock $matrixBlock    Matrix block object from Matrix entry type
     * @param   Context     $context        Data contained in matrix block
     *
     * @return  WrapperBlock|ContentBlock
     */
    public static function create(MatrixBlock $matrixBlock, Entry $entry): Block
    {
        $matrixBlockHandle = $matrixBlock->getType()->handle;

        // parse handle for wrapper properties
        preg_match('/^([a-zA-Z]+)(End|Start)([A-Za-z]+)?$/', $matrixBlockHandle, $matchGroups);
        @list($match, $wrapperType, $wrapperMode, $wrapperHandle) = $matchGroups;

        // is WrapperBlock
        if (!empty($wrapperMode)) {
            $wrapper = new WrapperBlock([
                'handle'            => lcfirst($wrapperHandle),
                'entry'             => $entry,
                'matrixBlock'       => $matrixBlock,
                'wrapperType'       => $wrapperType,
                'wrapperMode'       => $wrapperMode,
            ]);

            return $wrapper;
        }

        // // fallback as ContentBlock
        return new ContentBlock([
            'entry'         => $entry,
            'handle'        => $matrixBlockHandle,
            'matrixBlock'   => $matrixBlock,
        ]);
    }
}
