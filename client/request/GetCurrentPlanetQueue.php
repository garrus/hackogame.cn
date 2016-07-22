<?php
namespace request;


use lib\BaseRequest;
use models\Queue;

class GetCurrentPlanetQueue extends BaseRequest
{

    /**
     * @return string
     */
    public function getMod()
    {
        return 'queue';
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return [
            'mod' => 'planet',
            'xid' => mt_rand(0, 2),
        ];
    }

    /**
     * @param $msg
     * @return Queue
     */
    public function buildResult($msg)
    {
        return new Queue($msg);
    }
}