<?php

namespace Morsekode;

use Craft;
use craft\base\Plugin;
use Morsekode\RecursiveMatrix\Assets;
use Morsekode\RecursiveMatrix\TwigExtension;

class RecursiveMatrix extends Plugin
{
    public function init()
    {
        // register Twig Extension
        Craft::$app->view->registerTwigExtension(new TwigExtension());

        Craft::$app->view->registerAssetBundle(Assets::class);

        parent::init();
    }
}
