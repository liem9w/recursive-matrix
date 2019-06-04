<?php

namespace Morsekode\RecursiveMatrix;

use Twig\TwigFilter;
use craft\elements\Entry;
use craft\elements\MatrixBlock;
use craft\elements\db\MatrixBlockQuery;
use Morsekode\RecursiveMatrix\models\Block;
use Morsekode\RecursiveMatrix\models\Context;
use Morsekode\RecursiveMatrix\models\ContentBlock;
use Morsekode\RecursiveMatrix\models\WrapperBlock;

class TwigExtension extends \Twig_Extension implements \Twig_Extension_GlobalsInterface
{
    /**
     * Automatically adds this to Twig globals
     */
    public function getGlobals()
    {
        return [
            'recursiveMatrix'   => $this,
        ];
    }

    public function render($blocks, Entry $entry): array
    {
        $currentLevel = 0;
        $currentLevelBlocks = [];
        $currentWrapper = null;

        // Add nested blocks to wrappers
        foreach ($blocks as $block) {
            if (!$block->enabled) {
                continue;
            }

            // add block to ContentBlock or WrapperBlock
            $currentBlock = $block instanceof Block ? $block : Block::create($block, $entry);

            switch (get_class($currentBlock)) {
                case ContentBlock::class:
                    if ($currentLevel > 0) {
                        // nested in wrapper
                        $currentWrapper->addChild($currentBlock);
                    } else {
                        // standalone
                        $currentLevelBlocks[] = $currentBlock;
                    }
                    break;

                case WrapperBlock::class:
                    if ($currentBlock->isStart()) {
                        if ($currentLevel > 0) {
                            $currentWrapper->addChild($currentBlock);
                        } else {
                            $currentWrapper = $currentBlock;
                        }

                        $currentLevel++;

                    } else if ($currentBlock->isEnd()) {
                        if ($currentLevel > 1) {
                            $currentWrapper->addChild($currentBlock);
                        } else {
                            $currentLevelBlocks[] = $currentWrapper;
                            unset($currentWrapper);
                        }

                        $currentLevel--;
                    }
                    break;
            }
        }

        return $currentLevelBlocks;
    }
}
