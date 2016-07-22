<?php
namespace lib;


abstract class ResponseObject extends Object
{
    /**
     * @param $mod
     * @param $msgObj
     * @return static
     */
    public static function factory($mod, $msgObj){
        
        $class = '\\models\\'. ucfirst($mod);
        if (class_exists($class)) {
            return new $class($msgObj);
        }
        throw new \InvalidArgumentException('Unknown mod "'. $mod. '". No related class.');
    }
}