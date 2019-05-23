<?php

namespace Morsekode\RecursiveMatrix\Models;

use Craft;
use craft\web\View;
use Morsekode\RecursiveMatrix\Models\Block;

class WrapperBlock extends Block
{
    public $wrapperMode;
    public $wrapperType;

    public $childComponents = [];

    public function __construct(...$args)
    {
        parent::__construct(...$args);
    }

    public function render() {
        $view = Craft::$app->getView();
        $view->setTemplateMode(View::TEMPLATE_MODE_SITE);
        
        return Craft::$app->getView()->renderTemplate(
            "_contentComponents/{$this->wrapperType}/{$this->handle}",
            [ $this->handle => $this ]
        );
    }

    public function isStart(): bool
    {
        return strtolower($this->wrapperMode) === 'start';
    }

    public function isEnd(): bool
    {
        return strtolower($this->wrapperMode) === 'end';
    }

    public function addChild(Block $block)
    {
        $this->childComponents[] = $block;
    }
}
