<?php

namespace Morsekode\RecursiveMatrix\Models;

use Exception;
use craft\elements\MatrixBlock;
use Morsekode\RecursiveMatrix\Models\Context;
use Morsekode\RecursiveMatrix\Models\Block;

class Block extends MatrixBlock
{
    public $handle;
    public $context;
    public $matrixBlock;

    public function __construct(array $attributes = [], MatrixBlock $matrixBlock = null)
    {
        foreach ($attributes as $prop => $value) {
            $this->$prop = $value;
        }
        if (!empty($matrixBlock)) {
            $attributes['matrixBlock'] = $matrixBlock;
        }
        if (!($attributes['matrixBlock'] instanceof MatrixBlock)) {
            throw new Exception("matrixBlock not provided");
        }

        // merge in $matrixBlock properties
        $props = get_object_vars($attributes['matrixBlock']);
        foreach ($props as $prop => $value) {
            $this->$prop = $value;
        }
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
    public static function create(MatrixBlock $matrixBlock, Context $context): Block
    {
        $matrixBlockHandle = $matrixBlock->getType()->handle;

        // parse handle for wrapper properties
        preg_match('/^([a-zA-Z]+)(End|Start)([A-Za-z]+)?$/', $matrixBlockHandle, $matchGroups);
        @list($match, $wrapperType, $wrapperMode, $wrapperHandle) = $matchGroups;

        // is WrapperBlock
        if (!empty($wrapperMode)) {
            return new WrapperBlock([
                'handle'            => lcfirst($wrapperHandle),
                'context'           => $context,
                'matrixBlock'       => $matrixBlock,
                'wrapperType'       => $wrapperType,
                'wrapperMode'       => $wrapperMode,
            ]);
        }

        // fallback as ContentBlock
        return new ContentBlock([
            'context'       => $context,
            'handle'        => $matrixBlockHandle,
            'matrixBlock'   => $matrixBlock,
        ]);
    }
}
