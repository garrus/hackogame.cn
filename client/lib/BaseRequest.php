<?php

namespace lib;


abstract class BaseRequest extends Object
{

    /**
     * @return string
     */
    abstract public function getMod();

    /**
     * @return array
     */
    abstract public function getParams();

    /**
     * @param $msg
     */
    abstract public function buildResult($msg);

    
    public function execute(Client $client){
        
        $ret = $client->send($this);
        if ($ret) {
            return $this->buildResult($ret);
        }
        return $ret;
    }
}