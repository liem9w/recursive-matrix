<?php

namespace Morsekode;

use Craft;
use craft\base\Plugin;
use Morsekode\RecursiveMatrix\TwigExtension;

class RecursiveMatrix extends Plugin
{
    public function init()
    {
        parent::init();

        // register Twig Extension
        Craft::$app->view->registerTwigExtension(new TwigExtension());
    }
}
