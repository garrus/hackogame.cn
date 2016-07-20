<?php
namespace lib;


abstract class BaseAction extends Object {

    /**
     * @return mixed
     */
    abstract public function run();
    
    /**
     * @return mixed
     */
    public function __invoke(){
        
        return $this->run();
    }
}