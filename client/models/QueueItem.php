<?php

namespace models;


use lib\Helper;
use lib\Object;

class QueueItem extends Object
{
    public $bid;
    public $costtime;
    public $count;
    public $crystal;
    public $deuterium;
    public $metal;
    public $pid;
    public $starttime;

    public function __toString(){

        $str = 'BID: '. $this->bid;
        $str .= ' CostTime: '. Helper::friendlyDuration($this->costtime);
        if ($this->count > 1) {
            $str .= ' Count: '. $this->count;
        }
        $str .= sprintf(' Resource: %s|%s|%s', 
            Helper::friendlyNumber($this->metal),
            Helper::friendlyNumber($this->crystal),
            Helper::friendlyNumber($this->deuterium)
        );
        
        if ($this->starttime == 0) {
            $str .= ' (pending)';
        } else {
            $endTime = $this->starttime + $this->costtime;
            $leftTime = $endTime - time();
            $str .= ' (left time: '. Helper::friendlyDuration($leftTime). ')';
        }
        return $str;
    }
}