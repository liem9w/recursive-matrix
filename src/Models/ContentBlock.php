<?php

namespace Morsekode\RecursiveMatrix\Models;

use Craft;
use craft\web\View;
use Morsekode\RecursiveMatrix\Models\Block;

class ContentBlock extends Block
{
    public function render() {
        $view = Craft::$app->getView();
        $view->setTemplateMode(View::TEMPLATE_MODE_SITE);
        
        return Craft::$app->getView()->renderTemplate(
            "_contentComponents/contentBlock/{$this->handle}",
            [ $this->handle => $this ]
        );
    }
}
