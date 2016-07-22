<?php

namespace lib;


abstract class BaseRequest extends Object
{
    
    protected $responseObj;

    /**
     * @return string
     */
    abstract public function getMod();

    /**
     * Get any params except mod and xid
     * @return array
     */
    public function getParams(){
        return [];
    }

    /**
     * @param ResponseObject $obj
     */
    public function setResponseObject(ResponseObject $obj){
        $this->responseObj = $obj;
    }

    /**
     * @return ResponseObject
     */
    public function getResponseObj(){
        return $this->responseObj;
    }
}