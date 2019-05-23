<?php

namespace Morsekode\RecursiveMatrix\Models;

use craft\base\Model;

class Context extends Model
{
    public $entry;
    public $default;

    public static function create($attributes)
    {
        $model = new Context();

        $model->setAttributes($attributes, false);

        return $model;
    }
}
