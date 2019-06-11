<?php

namespace Morsekode\RecursiveMatrix;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

class Assets extends AssetBundle
{
    public function init()
    {
        $this->sourcePath = '@Morsekode/RecursiveMatrix/resources';

        $this->depends = [
            CpAsset::class,
        ];

        $this->css = [
            'css/RecursiveMatrix.css',
        ];

        $this->js = [
            'js/DataObserver.js',
            'js/NestedMatrix.js',
            'js/NestedMatrixBlock.js',
            'js/NestedMatrixButtons.js',
            'js/MatrixHierarchyPlugin.js',
            'js/RecursiveMatrix.js',
        ];

        parent::init();
    }
}
