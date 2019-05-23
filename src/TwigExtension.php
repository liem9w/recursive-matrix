<?php

namespace Morsekode\RecursiveMatrix;

use Twig\TwigFilter;
use craft\elements\Entry;
use craft\models\MatrixBlockType;
use craft\elements\db\MatrixBlockQuery;
use Morsekode\RecursiveMatrix\Models\Block;
use Morsekode\RecursiveMatrix\Models\Context;
use Morsekode\RecursiveMatrix\Models\ContentBlock;
use Morsekode\RecursiveMatrix\Models\WrapperBlock;

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

            $context = Context::create([
                'entry' => $entry
            ]);

            // add block to ContentBlock or WrapperBlock
            $currentBlock = $block instanceof Block ? $block : Block::create($block, $context);

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

            // $contentComponent = $block instanceof ContentComponents_BaseComponentModel
            //     ? $block
            //     : ContentComponents_BaseComponentModel::factory($block, $context);

            // $isContentBlock = get_class($contentComponent) == ContentComponents_ContentBlockModel::class;

            // if ($isContentBlock) {
            //     if ($currentNestingLevel > 0) {
            //         $currentWrapperComponent->addChildComponent($contentComponent);
            //     } else {
            //         $levelComponents[] = $contentComponent;
            //     }

            //     continue;
            // }

            // if ($contentComponent->isStartWrapper()) {
            //     if ($currentNestingLevel > 0) {
            //         $currentWrapperComponent->addChildComponent($contentComponent);
            //     } else {
            //         $currentWrapperComponent = $contentComponent;
            //     }

            //     $currentNestingLevel++;

            //     continue;
            // }

            // if ($contentComponent->isEndWrapper()) {
            //     if ($currentNestingLevel > 1) {
            //         $currentWrapperComponent->addChildComponent($contentComponent);
            //     } else {
            //         $levelComponents[] = $currentWrapperComponent;
            //         unset($currentWrapperComponent);
            //     }

            //     $currentNestingLevel--;

            //     continue;
            // }
        }

        return $currentLevelBlocks;
    }
}
